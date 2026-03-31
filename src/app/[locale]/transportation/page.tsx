"use client";

import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Map from "@/components/map";
import ProfileNav from "@/components/ProfileNav";
import { useLocale, useTranslations } from "next-intl";

type Position = [number, number];

type Car = {
  type: string;
  model: string;
};

const cars: Car[] = [
  { type: "Sedan", model: "Toyota Corolla" },
  { type: "Sedan", model: "Honda Civic" },
  { type: "SUV", model: "Hyundai Tucson" },
  { type: "SUV", model: "Kia Sportage" },
  { type: "Van", model: "Toyota Hiace" },
  { type: "Van", model: "Nissan Urvan" },
];

// 💰 سعر أساسي لكل نوع
const basePrices: Record<string, number> = {
  Sedan: 20,
  SUV: 35,
  Van: 50,
};

export default function Transportation() {
  const t = useTranslations("map");
  const locale = useLocale() as "en" | "ar";

  const [position, setPosition] = useState<Position>([24.46861, 39.61417]);

  const [selectedType, setSelectedType] = useState("");
  const [selectedCar, setSelectedCar] = useState("");
  const [eta, setEta] = useState<number | null>(null); // ⏱ وقت الوصول

  const [startQuery, setStartQuery] = useState("");
  const [endQuery, setEndQuery] = useState("");
  const [startPos, setStartPos] = useState<Position | null>(null);
  const [endPos, setEndPos] = useState<Position | null>(null);

  const [loading, setLoading] = useState(false);

  // 🚗 اختيار نوع عربية
  const handleSelect = (type: string) => {
    setSelectedType(type);

    const filtered = cars.filter((car) => car.type === type);

    if (filtered.length === 0) {
      setSelectedCar("");
      return;
    }

    const randomCar =
      filtered[Math.floor(Math.random() * filtered.length)];

    setSelectedCar(randomCar.model);
  };

  // 📏 حساب المسافة
  const getDistance = (start: Position, end: Position) => {
    const R = 6371;

    const dLat = ((end[0] - start[0]) * Math.PI) / 180;
    const dLon = ((end[1] - start[1]) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((start[0] * Math.PI) / 180) *
        Math.cos((end[0] * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // 🔍 تحويل اسم لموقع
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
        return [parseFloat(res.data[0].lat), parseFloat(res.data[0].lon)];
      }

      return null;
    } catch {
      return null;
    }
  };

  // 🛣 تحديد المسار + السعر + الوقت
  const handleRoute = async () => {
    if (!startQuery || !endQuery)
      return toast.error("أدخل البداية والنهاية");

    if (!selectedType)
      return toast.error("اختار نوع العربية الأول");

    setLoading(true);

    const start = await getCoords(startQuery);
    const end = await getCoords(endQuery);

    setLoading(false);

    if (start && end) {
      setStartPos(start);
      setEndPos(end);
      setPosition(start);

      const distance = getDistance(start, end);

      

      //  ETA (سرعة تقريبية 40 كم/ساعة)
      const speed = 40;
      const time = Math.round((distance / speed) * 60);
      setEta(time);

      toast.success("تم تحديد الرحلة!");
    } else {
      toast.error("أماكن غير صحيحة");
    }
  };

  return (
    <>
      <ProfileNav locale={locale} />

      <div className="p-4 space-y-4 rtl mb-5">
        <Toaster />

        {/*  اختيار العربية */}
        <div className="flex items-center justify-center mt-5">
          <div className="border border-emerald-200 rounded-md p-3 focus-within:border-emerald-600 w-1/2">
            <select
              value={selectedType}
              onChange={(e) => handleSelect(e.target.value)}
              className="w-full outline-none bg-transparent text-gray-700"
            >
              <option value="">اختار نوع السيارة</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Van">Van</option>
            </select>
          </div>
        </div>

        

        {/*  البداية والنهاية */}
        <div className="flex gap-2 items-center justify-center mt-5">
          <div className="border border-emerald-200 rounded-md p-3 focus-within:border-emerald-600 w-1/4">
            <input
              type="text"
              placeholder={t("startPoint")}
              onChange={(e) => setStartQuery(e.target.value)}
              value={startQuery}
              className="w-1/2 sm:w-1/2 outline-none bg-transparent text-gray-700"
            />
          </div>

          <div className="border border-emerald-200 rounded-md p-3 focus-within:border-emerald-600 w-1/4">
            <input
              type="text"
              placeholder={t("endPoint")}
              onChange={(e) => setEndQuery(e.target.value)}
              value={endQuery}
              className="w-1/2 sm:w-1/2 outline-none bg-transparent text-gray-700"
            />
          </div>

          <button
            onClick={handleRoute}
            disabled={loading}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "جارٍ تحديد المسار..." : t("btnRoute")}
          </button>
        </div>

        {/*  عرض البيانات */}
        {selectedCar && (
          <div className="text-center text-gray-700">
           The Car : <span className="font-bold">{selectedCar}</span>
            <br />
             Arrrival Time{" "}
            <span className="font-bold">
              {eta ? `${eta} minute` : "--"}
            </span>
          </div>
        )}

        {/* الخريطة */}
        <Map position={position} start={startPos} end={endPos} />
      </div>
    </>
  );
}



