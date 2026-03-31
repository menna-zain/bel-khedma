"use client";
import ProfileNav from "@/components/ProfileNav";
import { useLocale, useTranslations } from "next-intl";

import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Map from "@/components/map";

type Position = [number, number];

export default function delivery() {
  const t = useTranslations("map");
  const locale = useLocale() as "en" | "ar";

  const isRTL = locale === "ar";

  // 🔹 suggestions لكل input
  const [startSuggestions, setStartSuggestions] = useState<any[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<any[]>([]);

  // 🔹 states
  const [position, setPosition] = useState<Position>([24.46861, 39.61417]);

  const [startQuery, setStartQuery] = useState("");
  const [endQuery, setEndQuery] = useState("");

  const [startPos, setStartPos] = useState<Position | null>(null);
  const [endPos, setEndPos] = useState<Position | null>(null);

  const [loading, setLoading] = useState(false);

  // 🔍 جلب الاقتراحات
  const getSuggestions = async (
    value: string,
    setter: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    if (!value) {
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
  "Accept-Language": locale, // ar أو en
}
        }
      );
      setter(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 تحويل الاسم لإحداثيات
  const getCoords = async (query: string): Promise<Position | null> => {
    if (!query) return null;

    try {
      const res = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: { q: query, format: "json" },
        }
      );

      if (res.data.length > 0) {
        return [
          parseFloat(res.data[0].lat),
          parseFloat(res.data[0].lon),
        ];
      }

      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  // 🔹 تحديد المسار
  const handleRoute = async () => {
    if (!startQuery || !endQuery)
      return toast.error("أدخل البداية والنهاية");

    setLoading(true);

    const start = await getCoords(startQuery);
    const end = await getCoords(endQuery);

    setLoading(false);

    if (start && end) {
      setStartPos(start);
      setEndPos(end);
      setPosition(start);
      toast.success("تم تحديد المسار!");
    } else {
      toast.error("من فضلك أدخل أماكن صحيحة");
    }
  };

  return (
    <div>
      <ProfileNav locale={locale} />

      <div className="p-4 space-y-4 rtl mb-5">
        <Toaster position="top-right" reverseOrder={false} />

        {/* 🔹 inputs */}
        <div className="flex gap-2 items-center justify-center mt-5 flex-wrap">

          {/* 🔹 Start */}
          <div className="relative border border-emerald-200 rounded-md p-3 focus-within:border-emerald-600 w-full sm:w-1/3">
            <input
              type="text"
              placeholder={t("startPoint")}
              value={startQuery}
              onChange={(e) => {
                setStartQuery(e.target.value);
                getSuggestions(e.target.value, setStartSuggestions);
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
                      setStartPos([
                        parseFloat(item.lat),
                        parseFloat(item.lon),
                      ]);
                      setStartSuggestions([]);
                    }}
                  >
                    {item.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 🔹 End */}
          <div className="relative border border-emerald-200 rounded-md p-3 focus-within:border-emerald-600 w-full sm:w-1/3">
            <input
              type="text"
              placeholder={t("endPoint")}
              value={endQuery}
              onChange={(e) => {
                setEndQuery(e.target.value);
                getSuggestions(e.target.value, setEndSuggestions);
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
                      setEndPos([
                        parseFloat(item.lat),
                        parseFloat(item.lon),
                      ]);
                      setEndSuggestions([]);
                    }}
                  >
                    {item.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 🔹 Button */}
          <button
            onClick={handleRoute}
            disabled={loading}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "جارٍ تحديد المسار..." : t("btnRoute")}
          </button>
        </div>

        {/* 🔹 Map */}
        <Map position={position} start={startPos} end={endPos} />
      </div>
    </div>
  );
}
