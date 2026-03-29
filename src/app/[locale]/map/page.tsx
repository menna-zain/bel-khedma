"use client";

import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Map from "@/components/map";
import Navbar from "@/components/Navbar";
import { useLocale, useTranslations } from "next-intl";

type Position = [number, number];

export default function MapPage() {
  const t = useTranslations("map");
  const locale = useLocale() as "en" | "ar";

  const isRTL = locale === "ar";

  // 🔹 البحث عن مكان واحد
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState<Position>([24.7136, 46.6753]); // الرياض

  // 🔹 تحديد المسار
  const [startQuery, setStartQuery] = useState("");
  const [endQuery, setEndQuery] = useState("");
  const [startPos, setStartPos] = useState<Position | null>(null);
  const [endPos, setEndPos] = useState<Position | null>(null);

  const [loading, setLoading] = useState(false);

  // 🔍 البحث عن مكان واحد
  const searchLocation = async () => {
    if (!query) return toast.error("من فضلك أدخل مكان للبحث");
    setLoading(true);
    try {
      const res = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: { q: query, format: "json" },
        },
      );
      if (res.data.length > 0) {
        setPosition([parseFloat(res.data[0].lat), parseFloat(res.data[0].lon)]);
        toast.success("تم العثور على المكان!");
      } else {
        toast.error("لم يتم العثور على المكان");
      }
    } catch (err) {
      toast.error("حدث خطأ أثناء البحث");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 تحويل الاسم إلى إحداثيات
  const getCoords = async (query: string): Promise<Position | null> => {
    if (!query) return null;
    try {
      const res = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: { q: query, format: "json" },
        },
      );
      if (res.data.length > 0) {
        return [parseFloat(res.data[0].lat), parseFloat(res.data[0].lon)];
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handleRoute = async () => {
    if (!startQuery || !endQuery) return toast.error("أدخل البداية والنهاية");
    setLoading(true);
    const start = await getCoords(startQuery);
    const end = await getCoords(endQuery);
    setLoading(false);
    if (start && end) {
      setStartPos(start);
      setEndPos(end);
      setPosition(start); // تحريك الكاميرا للبداية
      toast.success("تم تحديد المسار!");
    } else {
      toast.error("من فضلك أدخل أماكن صحيحة");
    }
  };

  // 🔹 تحديد الموقع الحالي
  const getCurrentLocation = () => {
    if (!navigator.geolocation)
      return toast.error("المتصفح لا يدعم تحديد الموقع");
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: Position = [pos.coords.latitude, pos.coords.longitude];
        setPosition(coords);
        setLoading(false);
        toast.success("تم تحديد موقعك الحالي");
      },
      (err) => {
        console.error(err);
        setLoading(false);
        toast.error("تعذر الحصول على موقعك");
      },
    );
  };

  return (
    <>
      <Navbar locale={locale} />
      <div className="p-4 space-y-4 rtl mb-5">
        <Toaster position="top-right" reverseOrder={false} />

        {/* 🔹 Search for single location */}
        <div className="flex gap-2 flex-wrap items-center">
          <div className=" border border-emerald-200 rounded-md p-3 focus-within:border-emerald-600 w-1/2">
            <input
              type="text"
              placeholder={t("search")}
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              className="w-full sm:w-1/2 outline-none bg-transparent text-gray-700"
            />
          </div>
          <button
            onClick={searchLocation}
            disabled={loading}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded disabled:opacity-50"
          >
           {loading ? t("btnLoading") : t("btn")}
          </button>
          <button
            onClick={getCurrentLocation}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            {t("yourLocation")}
          </button>
        </div>

        {/* 🔹 Start & End for Route */}
        <div className="flex gap-2 flex-wrap items-center">
            <div className=" border border-emerald-200 rounded-md p-3 focus-within:border-emerald-600 w-1/2">
            <input
              type="text"
             placeholder={t("startPoint")}
              onChange={(e) => setStartQuery(e.target.value)}
             value={startQuery}
              className="w-full sm:w-1/2 outline-none bg-transparent text-gray-700"
            />
          </div>
            <div className=" border border-emerald-200 rounded-md p-3 focus-within:border-emerald-600 w-1/2">
            <input
              type="text"
               placeholder={t("endPoint")}
             onChange={(e) => setEndQuery(e.target.value)}
             value={endQuery}
              className="w-full sm:w-1/2 outline-none bg-transparent text-gray-700"
            />
          </div>
          <button
            onClick={handleRoute}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "جارٍ تحديد المسار..." : t("btnRoute")}
          </button>
        </div>

        {/* 🗺️ Map */}
        <Map position={position} start={startPos} end={endPos} />
      </div>
    </>
  );
}