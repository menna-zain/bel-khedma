"use client";

import { useEffect, useState } from "react";
import ProfileNav from "@/components/ProfileNav";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import axios from "axios";

type Request = {
  id: number;
  serviceType: string;
  status: string;
  description?: string;
};

export default function Requests() {
  const locale = useLocale() as "en" | "ar";
  const router = useRouter();

  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRequests = async () => {
      try {
        // ✅ نجيب التوكن من localStorage
        const token = localStorage.getItem("token");

        if (!token) {
          console.log("No token found");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          "https://bilkhidmah-api.vercel.app/api/v1/delivery/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log("get requests", res);
        setRequests(res.data.data || []);
      } catch (error) {
        console.log("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    getRequests();
  }, []);

  return (
    <>
      <ProfileNav locale={locale} />

      <div className="p-4 space-y-4 rtl mb-5">
        <div className="flex flex-col items-center gap-4">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : requests.length > 0 ? (
            requests.map((request: Request) => (
              <div
                key={request.id}
                onClick={() => router.push(`/requests/${request.id}`)}
                className="w-1/2 border border-emerald-200 rounded-md p-4 shadow-sm hover:shadow-md transition cursor-pointer"
              >
                <div className="flex justify-between">
                  <h2 className="text-lg font-bold text-gray-800">
                    {request.serviceType || "No Name"}
                  </h2>
                  <span>{request.status || "No Status"}</span>
                </div>

                <p className="text-sm text-gray-600 mt-1">
                  {request.description || "No Description"}
                </p>
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
