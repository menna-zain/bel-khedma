"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import axios from "axios";
import Vnavbar from "@/components/Vnavbar";
import { Toaster, toast } from "react-hot-toast";
import { ClipLoader } from "react-spinners";

type Request = {
  id: string;
  serviceType: string;
  status: string;
  startLocation?: string;
  endLocation?: string;
  averageTime?: number;
  carType?: string;
  meetingLocation?: string;
  startAt?: string;
  endAt?: string;
  MTime?: string;
  landmarks?: string[];
};

export default function Requests() {
  const t = useTranslations("volunteer");
  const locale = useLocale() as "en" | "ar";

  const direction = locale === "ar" ? "rtl" : "ltr";
  const router = useRouter();

  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  //  حالة تحميل لكل زرار
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  //  Accept request
  const handleAccept = async (id: string, type: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      setAcceptingId(id);

      const res = await axios.post(
        `https://bilkhidmah-api.vercel.app/api/v1/requests/${type}/${id}/accept`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      console.log(res);
     setRequests((prev) =>
  prev.map((req) =>
    req.id === id
      ? { ...req, status: "accepted" }
      : req
  )
);

      toast.success("Request accepted successfully");
    } catch (error) {
      console.log("Error accepting request:", error);
      toast.error("Something went wrong");
    } finally {
      setAcceptingId(null);
    }
  };

  //  تحويل الاحداثيات لعنوان
  const getAddressFromCoords = async (lat: string, lon: string) => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      );
      return res.data.display_name || "Unknown location";
    } catch (error) {
      console.log("Error fetching address:", error);
      return "Unknown location";
    }
  };

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  useEffect(() => {
    const getRequests = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }
        const res = await axios.get(
          "https://bilkhidmah-api.vercel.app/api/v1/requests/pending",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const data = res.data.data;



        const deliveryRequests: Request[] = [];

        for (const req of data.deliveries || []) {
          const start =
            req.PLat && req.PLong
              ? await getAddressFromCoords(req.PLat, req.PLong)
              : "N/A";

          await delay(1000);

          const end =
            req.DLat && req.DLong
              ? await getAddressFromCoords(req.DLat, req.DLong)
              : "N/A";

          deliveryRequests.push({
            id: req.id,
            serviceType: req.serviceType,
            status: req.status,
            startLocation: start,
            endLocation: end,
            averageTime: req.averageTime || null,
          });
        }

        const transportationRequests: Request[] = [];

        for (const req of data.rides || []) {
          const start =
            req.SLat && req.SLong
              ? await getAddressFromCoords(req.SLat, req.SLong)
              : "N/A";

          await delay(1000);

          const end =
            req.DLat && req.DLong
              ? await getAddressFromCoords(req.DLat, req.DLong)
              : "N/A";

          transportationRequests.push({
            id: req.id,
            serviceType: req.serviceType,
            status: req.status,
            startLocation: start,
            endLocation: end,
            averageTime: req.averageTime || null,
            carType: req.carType || "N/A",
          });
        }

        // tours
        const toursRequests: Request[] = [];
        for (const req of data.tours || []) {
          const meeting =
            req.MLat && req.MLong
              ? await getAddressFromCoords(req.MLat, req.MLong)
              : "N/A";

          toursRequests.push({
            id: req.id,
            serviceType: req.serviceType,
            status: req.status,
            meetingLocation: meeting,
            startAt: req.startAt,
            endAt: req.endAt,
            MTime: req.MTime,
            landmarks: req.landmarks?.map((l: any) => l.landmark.name) || [],
          });
        }

        setRequests([
          ...deliveryRequests,
          ...transportationRequests,
          ...toursRequests,
        ].reverse());
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

  // tours

  const decimalToTime = (value: number) => {
    const hours = Math.floor(value);
    const minutes = Math.round((value - hours) * 60);

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  const getDuration = (start: number, end: number) => {
    const diff = end - start;

    const hours = Math.floor(diff);
    const minutes = Math.round((diff - hours) * 60);

    return `${hours}h ${minutes}m`;
  };

  const formatDate = (date?: string) => {
    if (!date) return "N/A";

    const parsed = new Date(date);

    if (isNaN(parsed.getTime())) return "Invalid date";

    return parsed.toLocaleDateString("en-GB");
  };

  return (
    <>
      {/*  Toast container */}
      <Toaster position="top-center" />

      <Vnavbar locale={locale} />
        {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-white ">
          <ClipLoader color="#007A55" size={50} />
        </div>
      ) : (
        <div className="p-4 space-y-4 mb-5 flex justify-center">
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
                <h2 className="text-lg font-bold text-gray-800 mb-2">
                  {request.serviceType === "tour"
                    ? "Tour Guidance"
                    : request.serviceType}
                </h2>

                <div className="text-sm text-gray-700 flex flex-col gap-1">
                  {request.startLocation && request.endLocation && (
                    <div>
                      <p>
                        <span className="font-bold">From:</span>{" "}
                        {request.startLocation}
                      </p>
                      <p>
                        <span className="font-bold">To:</span>{" "}
                        {request.endLocation}
                      </p>
                    </div>
                  )}

                  {request.serviceType === "tour" && (
                    <>
                      <p>
                        <span className="font-bold">Meeting Point:</span>{" "}
                        {request.meetingLocation}
                      </p>

                      <p>
                        <span className="font-bold">Date: </span>{" "}
                        {formatDate(request.MTime)}
                      </p>
                      <p>
                        <span className="font-bold">Start: </span>{" "}
                        {decimalToTime(Number(request.startAt))}
                      </p>

                      <p>
                        <span className="font-bold">End:</span>{" "}
                        {decimalToTime(Number(request.endAt))}
                      </p>

                      <p>
                        <span className="font-bold">Duration:</span>{" "}
                        {getDuration(
                          Number(request.startAt),
                          Number(request.endAt),
                        )}
                      </p>
                    </>
                  )}

                  {request.landmarks && request.landmarks.length > 0 && (
                    <p>
                      <span className="font-bold">Landmarks:</span>{" "}
                      {request.landmarks.join(", ")}
                    </p>
                  )}

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

                  <div className="flex justify-end">
                   <button
  onClick={(e) => {
    e.stopPropagation();
    handleAccept(request.id, request.serviceType);
  }}
  disabled={
    acceptingId === request.id ||
    request.status === "accepted"
  }
  className={`px-3 py-1 rounded-md text-sm transition text-white
    ${
      request.status === "accepted"
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-emerald-600 hover:bg-emerald-700"
    }
  `}
>
  {acceptingId === request.id
    ? "Loading..."
    : request.status === "accepted"
      ? "Accepted"
      : "Accept"}
</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-lg">No requests found</p>
          )}
        </div>
      </div>
      )}
     
    </>
  );
}
