"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";

import axios from "axios";
import Link from "next/link";
import { MdAccountCircle } from "react-icons/md";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { FaHandsHelping } from "react-icons/fa";

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
  const t = useTranslations("volunteer");
  const locale = useLocale() as "en" | "ar";

  const direction = locale === "ar" ? "rtl" : "ltr";
  const router = useRouter();

  const navLinks = [
    { name: "delivery", href: "/target" },
    { name: "transportation", href: "/vRequests" },
  ];

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Accept request
  const handleAccept = async (id: string, type: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.post(
        `https://bilkhidmah-api.vercel.app/api/v1/requests/${type}/${id}/accept`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      console.log("accept:", res);

      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (error) {
      console.log("Error accepting request:", error);
    }
  };

  // ✅ تحويل الاحداثيات لعنوان
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

        // ✅ Delivery Requests
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

        // ✅ Transportation Requests
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
      <nav
        className="flex items-center justify-between p-4 bg-white border-b border-gray-300 sticky top-0 left-0 w-full shadow-md z-50"
        dir={direction}
      >
        <div className="flex items-center gap-2">
          <FaHandsHelping size={30} className="text-emerald-700" />
          <span className="font-bold text-2xl text-black">
            {t("serviceName")}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-800 hover:text-emerald-700 font-semibold text-lg transition"
              >
                {t(link.name)}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <LanguageSwitcher />
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center px-2 py-1 rounded-lg hover:bg-gray-200 transition"
            >
              <MdAccountCircle size={32} />
            </button>

            {open && (
              <div
                className={`absolute mt-2 bg-white shadow-lg rounded-xl border border-gray-300 z-[5000] p-2 ${
                  locale === "ar" ? "left-0 w-38" : "right-0 w-28"
                }`}
              >
                <button className="w-full px-4 py-2 hover:bg-gray-100 text-sm">
                  {t("profile")}
                </button>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-800 font-semibold w-full px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  {t("logout")}
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

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
                  {request.serviceType}
                </h2>

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

                  <div className="flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAccept(request.id, request.serviceType);
                      }}
                      className="bg-emerald-600 text-white px-3 py-1 rounded-md text-sm hover:bg-emerald-700 transition"
                    >
                      Accept
                    </button>
                  </div>
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
