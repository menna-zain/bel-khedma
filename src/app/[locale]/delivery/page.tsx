"use client";
import ProfileNav from "@/components/ProfileNav";
import { useLocale, useTranslations } from "next-intl";

import { useState, useMemo } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Map from "@/components/map";
import { debounce } from "lodash";

type Position = [number, number];

export default function delivery() {
  const t = useTranslations("delivery");
  const locale = useLocale() as "en" | "ar";

  const [position, setPosition] = useState<Position>([24.46861, 39.61417]);
  
  const [startSuggestions, setStartSuggestions] = useState<any[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<any[]>([]);


  const [startQuery, setStartQuery] = useState("");
  const [endQuery, setEndQuery] = useState("");

  const [startPos, setStartPos] = useState<Position | null>(null);
  const [endPos, setEndPos] = useState<Position | null>(null);

  const [loading, setLoading] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null); // بالدقائق

  //  API suggestions
  const getSuggestions = async (
    value: string,
    setter: React.Dispatch<React.SetStateAction<any[]>>,
  ) => {
    if (!value || value.length < 3) {
      setter([]);
      return;
    }

    try {
      const res = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: value,
            format: "json",
            addressdetails: 1,
            limit: 5,
          },
          headers: {
            "Accept-Language": locale,
          },
        },
      );
      setter(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  //  Debounce (مهم جدًا)
  const debouncedStart = useMemo(
    () =>
      debounce((value: string) => {
        getSuggestions(value, setStartSuggestions);
      }, 500),
    [],
  );

  const debouncedEnd = useMemo(
    () =>
      debounce((value: string) => {
        getSuggestions(value, setEndSuggestions);
      }, 500),
    [],
  );

  //  تحديد المسار وإرسال البيانات
  const handleRoute = async () => {
    if (!startPos || !endPos) {
      return toast.error("اختار الأماكن من القائمة");
    }

    setLoading(true);

    try {
      // عرض المسار على الخريطة
      setPosition(startPos);

      // حساب الوقت التقريبي (المسافة الجوية)
      const toRad = (x: number) => (x * Math.PI) / 180;
      const R = 6371; // نصف قطر الأرض بالكيلومتر
      const dLat = toRad(endPos[0] - startPos[0]);
      const dLon = toRad(endPos[1] - startPos[1]);
      const lat1 = toRad(startPos[0]);
      const lat2 = toRad(endPos[0]);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) *
          Math.sin(dLon / 2) *
          Math.cos(lat1) *
          Math.cos(lat2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distanceKm = R * c;

      const averageSpeed = 40; // سرعة افتراضية بالكيلو متر / ساعة
      const timeHours = distanceKm / averageSpeed;
      const timeMinutes = Math.round(timeHours * 60); // بالدقائق
      setEstimatedTime(timeMinutes);

      // تجهيز البيانات
      const dataToSend = {
        PLat: startPos[0],
        PLong: startPos[1],
        DLat: endPos[0],
        DLong: endPos[1],
        averageTime: timeMinutes,
      };

      console.log("Data to send:", dataToSend);

      // قراءة التوكن من localStorage
      const token = localStorage.getItem("token"); // حسب الاسم اللي عندك

      // إرسال البيانات للباك اند مع التوكن
      const res = await axios.post(
        "https://bilkhidmah-api.vercel.app/api/v1/delivery",
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`, // إضافة التوكن
          },
        },
      );

      console.log("Response from server:", res.data); // <-- هنا هيتطبع الرد من السيرفر

      toast.success("تم تحديد المسار ");
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء إرسال البيانات");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ProfileNav locale={locale} />

      <div className="p-4 space-y-4 rtl mb-5">
        <Toaster position="top-right" />

        {/*  Inputs */}
        <div className="flex gap-2 items-center justify-center mt-5 flex-wrap">
          {/* Start */}
          <div className="relative border border-emerald-200 rounded-md p-3 focus-within:border-emerald-600 w-full sm:w-1/3">
            <input
              type="text"
              placeholder={t("startPoint")}
              value={startQuery}
              onChange={(e) => {
                const value = e.target.value;
                setStartQuery(value);
                debouncedStart(value);
              }}
              onBlur={() => {
                setTimeout(() => setStartSuggestions([]), 100);
              }}
              className="w-full outline-none bg-transparent text-gray-700"
            />

            {startSuggestions.length > 0 && (
              <div className="absolute left-0 bg-white shadow rounded w-full z-[1000] max-h-60 overflow-y-auto">
                {startSuggestions.map((item, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => {
                      setStartQuery(item.display_name);
                      setStartPos([parseFloat(item.lat), parseFloat(item.lon)]);
                      setStartSuggestions([]);
                    }}
                  >
                    {item.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* End */}
          <div className="relative border border-emerald-200 rounded-md p-3 focus-within:border-emerald-600 w-full sm:w-1/3">
            <input
              type="text"
              placeholder={t("endPoint")}
              value={endQuery}
              onChange={(e) => {
                const value = e.target.value;
                setEndQuery(value);
                debouncedEnd(value);
              }}
              onBlur={() => {
                setTimeout(() => setEndSuggestions([]), 100);
              }}
              className="w-full outline-none bg-transparent text-gray-700"
            />

            {endSuggestions.length > 0 && (
              <div className="absolute left-0 bg-white shadow rounded w-full z-[1000] max-h-60 overflow-y-auto">
                {endSuggestions.map((item, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => {
                      setEndQuery(item.display_name);
                      setEndPos([parseFloat(item.lat), parseFloat(item.lon)]);
                      setEndSuggestions([]);
                    }}
                  >
                    {item.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/*  Button */}
          <button
            onClick={handleRoute}
            disabled={loading}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? t("btnRouteLoading") : t("btnRoute")}
          </button>
        </div>

        {/* Estimated Time */}
{estimatedTime !== null && (
  <div className="text-center mt-2 text-gray-700">
    Time:{" "}
    {estimatedTime < 60
      ? `${estimatedTime} min`
      : `${Math.floor(estimatedTime / 60)} hr${
          Math.floor(estimatedTime / 60) > 1 ? "s" : ""
        }${
          estimatedTime % 60 !== 0
            ? ` ${estimatedTime % 60} min`
            : ""
        }`}
  </div>
)}

        {/*  Map */}
        <Map position={position} start={startPos} end={endPos} />
      </div>
    </div>
  );
}
