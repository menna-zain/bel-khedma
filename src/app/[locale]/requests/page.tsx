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

  // دالة لتحويل الاحداثيات لعنوان حقيقي
  const getAddressFromCoords = async (lat: string, lon: string) => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      return res.data.display_name || "Unknown location";
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
          }
        );

        console.log("res :",res)
        const data = res.data.data;

        // تحويل الـ delivery
        const deliveryRequests: Request[] = await Promise.all(
          (data.delivery || []).map(async (req: any) => ({
            id: req.id,
            serviceType: req.serviceType,
            status: req.status,
            startLocation:
              req.PLat && req.PLong
                ? await getAddressFromCoords(req.PLat, req.PLong)
                : "N/A",
            endLocation:
              req.DLat && req.DLong
                ? await getAddressFromCoords(req.DLat, req.DLong)
                : "N/A",
            averageTime: req.averageTime || null,
          }))
        );

        // تحويل الـ transportation
        const transportationRequests: Request[] = await Promise.all(
          (data.transportation || []).map(async (req: any) => ({
            id: req.id,
            serviceType: req.serviceType,
            status: req.status,
            startLocation:
              req.SLat && req.SLong
                ? await getAddressFromCoords(req.SLat, req.SLong)
                : "N/A",
            endLocation:
              req.DLat && req.DLong
                ? await getAddressFromCoords(req.DLat, req.DLong)
                : "N/A",
                averageTime: req.averageTime || null,
            carType: req.carType || "N/A",
          }))
        );

        setRequests([...deliveryRequests, ...transportationRequests]);
      } catch (error) {
        console.log("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    getRequests();
  }, []);

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins === 0
      ? `${hrs} hr${hrs > 1 ? "s" : ""}`
      : `${hrs} hr${hrs > 1 ? "s" : ""} ${mins} min`;
  };

  return (
    <>
      <ProfileNav locale={locale} />

      <div className="p-4 space-y-4 rtl mb-5 justify-center flex">
        <div className="flex flex-col items-center gap-4 w-1/2 mt-10">
        {/* <h2>Your Requests</h2> */}
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
                  <span className="text-sm font-medium">{request.status}</span>
                </div>

                <div className="text-sm text-gray-700 flex flex-col gap-1">
                  <p>
                    <span className="font-bold ">From:</span>{" "}
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


