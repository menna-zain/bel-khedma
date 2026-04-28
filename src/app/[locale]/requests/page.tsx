"use client";

import { useEffect, useState } from "react";
import ProfileNav from "@/components/ProfileNav";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import axios from "axios";

type Request = {
  id: string;
  serviceType: string;
  status: string;
  startLocation?: string;
  endLocation?: string;
  averageTime?: number;
  carType?: string;
};

export default function Requests() {
  const locale = useLocale() as "en" | "ar";
  const router = useRouter();

  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Cache لتخزين العناوين
  const addressCache = new Map<string, string>();

  // ✅ دالة تحويل الاحداثيات لعنوان
  const getAddressFromCoords = async (lat: string, lon: string) => {
    const key = `${lat},${lon}`;

    // لو موجود في الكاش
    if (addressCache.has(key)) {
      return addressCache.get(key)!;
    }

    try {
      // ⏳ تأخير لتجنب rate limit
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const res = await axios.get(
        "https://nominatim.openstreetmap.org/reverse",
        {
          params: {
            lat,
            lon,
            format: "json",
          },
          headers: {
            "Accept-Language": "en",
          },
        },
      );

      const address = res.data.display_name || "Unknown location";

      // خزنه
      addressCache.set(key, address);

      return address;
    } catch (error) {
      console.log("Error fetching address:", error);
      return "Unknown location";
    }
  };

  useEffect(() => {
    const getRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          "https://bilkhidmah-api.vercel.app/api/v1/users/history",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        console.log("res :", res);

        const data = res.data.data;

        const allRequests: Request[] = [];

        // ✅ delivery (بدون Promise.all)
        for (const req of data.delivery || []) {
          const start =
            req.PLat && req.PLong
              ? await getAddressFromCoords(req.PLat, req.PLong)
              : "N/A";

          const end =
            req.DLat && req.DLong
              ? await getAddressFromCoords(req.DLat, req.DLong)
              : "N/A";

          allRequests.push({
            id: req.id,
            serviceType: req.serviceType,
            status: req.status,
            startLocation: start,
            endLocation: end,
            averageTime: req.averageTime || null,
          });
        }

        // ✅ transportation
        for (const req of data.transportation || []) {
          const start =
            req.SLat && req.SLong
              ? await getAddressFromCoords(req.SLat, req.SLong)
              : "N/A";

          const end =
            req.DLat && req.DLong
              ? await getAddressFromCoords(req.DLat, req.DLong)
              : "N/A";

          allRequests.push({
            id: req.id,
            serviceType: req.serviceType,
            status: req.status,
            startLocation: start,
            endLocation: end,
            averageTime: req.averageTime || null,
            carType: req.carType || "N/A",
          });
        }

        setRequests(allRequests);
      } catch (error) {
        console.log("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    getRequests();
  }, []);

  const formatTime = (decimalTime: number) => {
    const hours = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hours) * 60);

    const paddedHours = hours.toString().padStart(2, "0");
    const paddedMinutes = minutes.toString().padStart(2, "0");

    return `${paddedHours}:${paddedMinutes}`;
  };
  return (
    <>
      <ProfileNav locale={locale} />

      <div className="p-4 space-y-4 rtl mb-5 justify-center flex">
        <div className="flex flex-col items-center gap-4 w-1/2 mt-10">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : requests.length > 0 ? (
            requests.map((request: Request) => (
              <div
                key={request.id}
                onClick={() => router.push(`/requests/${request.id}`)}
                className="w-full sm:w-3/4 border border-emerald-200 rounded-md p-4 shadow-sm hover:shadow-md transition cursor-pointer"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-bold text-gray-800">
                    {request.serviceType}
                  </h2>
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                      request.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {request.status}
                  </span>
                </div>

                <div className="text-sm text-gray-700 flex flex-col gap-1">
                  <p>
                    <span className="font-bold">From:</span>{" "}
                    {request.startLocation}
                  </p>
                  <p>
                    <span className="font-bold">To:</span> {request.endLocation}
                  </p>

                  {request.averageTime && (
                    <p>
                      <span className="font-bold">Arrival Time:</span>{" "}
                      {formatTime(request.averageTime)}
                    </p>
                  )}

                  {request.carType && (
                    <p>
                      <span className="font-bold">Car Type:</span>{" "}
                      {request.carType}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No requests found</p>
          )}
        </div>
      </div>
    </>
  );
}
