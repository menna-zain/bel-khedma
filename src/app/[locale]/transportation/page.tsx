"use client";

import { useState, useMemo } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Map from "@/components/map";
import ProfileNav from "@/components/ProfileNav";
import { useLocale, useTranslations } from "next-intl";
import { debounce } from "lodash";

type Position = [number, number];

type Car = {
  type: string;
};

const cars: Car[] = [
  { type: "Compact / Mini" },
  { type: "Sedan" },
  { type: "Sports Car" },
  { type: "Crossover" },
  { type: "SUV / 4x4" },
  { type: "Minivan / MPV" },
  { type: "Pickup Truck" },
];

export default function Transportation() {
  const t = useTranslations("transportation");
  const locale = useLocale() as "en" | "ar";

  const [position, setPosition] = useState<Position>([24.46861, 39.61417]);

  const [startSuggestions, setStartSuggestions] = useState<any[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<any[]>([]);

  const [selectedType, setSelectedType] = useState("");
  const [eta, setEta] = useState<number | null>(null);

  const [startQuery, setStartQuery] = useState("");
  const [endQuery, setEndQuery] = useState("");

  const [startPos, setStartPos] = useState<Position | null>(null);
  const [endPos, setEndPos] = useState<Position | null>(null);

  const [loading, setLoading] = useState(false);

  // اختيار نوع العربية
  const handleSelect = (type: string) => {
    setSelectedType(type);
  };

  // API suggestions
  const getSuggestions = async (
    value: string,
    setter: React.Dispatch<React.SetStateAction<any[]>>
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
        }
      );
      setter(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // debounce
  const debouncedStart = useMemo(
    () =>
      debounce((value: string) => {
        getSuggestions(value, setStartSuggestions);
      }, 500),
    []
  );

  const debouncedEnd = useMemo(
    () =>
      debounce((value: string) => {
        getSuggestions(value, setEndSuggestions);
      }, 500),
    []
  );

  // handle route + API
  const handleRoute = async () => {
    if (!startPos || !endPos) {
      return toast.error("اختار الأماكن من القائمة");
    }

    if (!selectedType) {
      return toast.error("Select car type first");
    }

    setLoading(true);

    try {
      // عرض المسار
      setPosition(startPos);

      // حساب الوقت مثل delivery
      const toRad = (x: number) => (x * Math.PI) / 180;
      const R = 6371;

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

      const averageSpeed = 40; // سرعة افتراضية كم/ساعة
      const timeHours = distanceKm / averageSpeed;
      const timeMinutes = Math.round(timeHours * 60);

      setEta(timeMinutes);

      // تجهيز البيانات
      const dataToSend = {
        SLat: startPos[0],
        SLong: startPos[1],
        DLat: endPos[0],
        DLong: endPos[1],
        carType: selectedType,
        averageTime: timeMinutes,
      };

      console.log("Data to send:", dataToSend);

      const token = localStorage.getItem("token");

      // إرسال API
      const res = await axios.post(
        "https://bilkhidmah-api.vercel.app/api/v1/rides",
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response:", res.data);

      toast.success("Ride created successfully ");
    } catch (err) {
      console.error(err);
      toast.error("Error while sending data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ProfileNav locale={locale} />

      <div className="p-4 space-y-4 rtl mb-5">
        <Toaster />

        {/* اختيار العربية */}
        <div className="flex items-center justify-center mt-5">
          <div className="border border-emerald-200 rounded-md p-3 focus-within:border-emerald-600 w-1/2">
            <select
              value={selectedType}
              onChange={(e) => handleSelect(e.target.value)}
              className="w-full outline-none bg-transparent text-gray-700"
            >
              <option value="">{t("selectCar")}</option>
              {cars.map((car, index) => (
                <option key={index} value={car.type}>
                  {car.type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* البداية والنهاية */}
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

          {/* Button */}
          <button
            onClick={handleRoute}
            disabled={loading}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? t("btnRouteLoading") : t("btnRoute")}
          </button>
        </div>

        {/* ETA */}
        {eta !== null && (
          <div className="text-center mt-2 text-gray-700">
            Time:{" "}
            {eta < 60
              ? `${eta} min`
              : `${Math.floor(eta / 60)} hr${
                  Math.floor(eta / 60) > 1 ? "s" : ""
                }${eta % 60 !== 0 ? ` ${eta % 60} min` : ""}`}
          </div>
        )}

        {/* Map */}
        <Map position={position} start={startPos} end={endPos} />
      </div>
    </>
  );
}







// "use client";

// import { useState, useMemo } from "react";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";
// import Map from "@/components/map";
// import ProfileNav from "@/components/ProfileNav";
// import { useLocale, useTranslations } from "next-intl";
// import { debounce } from "lodash";

// type Position = [number, number];

// type Car = {
//   type: string;
// };

// const cars: Car[] = [
//   { type: "Compact / Mini" },
//   { type: "Sedan" },
//   { type: "Sports Car" },
//   { type: "Crossover" },
//   { type: "SUV / 4x4" },
//   { type: "Minivan / MPV" },
//   { type: "Pickup Truck" },
// ];

// export default function Transportation() {
//   const t = useTranslations("transportation");
//   const locale = useLocale() as "en" | "ar";

//   const [position, setPosition] = useState<Position>([24.46861, 39.61417]);

//     const [startSuggestions, setStartSuggestions] = useState<any[]>([]);
//   const [endSuggestions, setEndSuggestions] = useState<any[]>([]);

//   const [selectedType, setSelectedType] = useState("");
//   const [eta, setEta] = useState<number | null>(null);

//   const [startQuery, setStartQuery] = useState("");
//   const [endQuery, setEndQuery] = useState("");
//   const [startPos, setStartPos] = useState<Position | null>(null);
//   const [endPos, setEndPos] = useState<Position | null>(null);

//   const [loading, setLoading] = useState(false);

//   // اختيار نوع العربية
//   const handleSelect = (type: string) => {
//     setSelectedType(type);
//   };

//    //  API suggestions
//   const getSuggestions = async (
//     value: string,
//     setter: React.Dispatch<React.SetStateAction<any[]>>,
//   ) => {
//     if (!value || value.length < 3) {
//       setter([]);
//       return;
//     }

//     try {
//       const res = await axios.get(
//         "https://nominatim.openstreetmap.org/search",
//         {
//           params: {
//             q: value,
//             format: "json",
//             addressdetails: 1,
//             limit: 5,
//           },
//           headers: {
//             "Accept-Language": locale,
//           },
//         },
//       );
//       setter(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };


//    //  Debounce (مهم جدًا)
//     const debouncedStart = useMemo(
//       () =>
//         debounce((value: string) => {
//           getSuggestions(value, setStartSuggestions);
//         }, 500),
//       [],
//     );
//     const debouncedEnd = useMemo(
//     () =>
//       debounce((value: string) => {
//         getSuggestions(value, setEndSuggestions);
//       }, 500),
//     [],
//   );

//   // حساب المسافة
//   const getDistance = (start: Position, end: Position) => {
//     const R = 6371;

//     const dLat = ((end[0] - start[0]) * Math.PI) / 180;
//     const dLon = ((end[1] - start[1]) * Math.PI) / 180;

//     const a =
//       Math.sin(dLat / 2) ** 2 +
//       Math.cos((start[0] * Math.PI) / 180) *
//         Math.cos((end[0] * Math.PI) / 180) *
//         Math.sin(dLon / 2) ** 2;

//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     return R * c;
//   };

//   // تحويل اسم لموقع
//   const getCoords = async (query: string): Promise<Position | null> => {
//     if (!query) return null;

//     try {
//       const res = await axios.get(
//         "https://nominatim.openstreetmap.org/search",
//         {
//           params: { q: query, format: "json" },
//         }
//       );

//       if (res.data.length > 0) {
//         return [parseFloat(res.data[0].lat), parseFloat(res.data[0].lon)];
//       }

//       return null;
//     } catch {
//       return null;
//     }
//   };

//   // تحديد المسار + الوقت
//   const handleRoute = async () => {
//     if (!startQuery || !endQuery)
//       return toast.error("Enter start and destination");

//     if (!selectedType)
//       return toast.error("Select car type first");

//     setLoading(true);

//     const start = await getCoords(startQuery);
//     const end = await getCoords(endQuery);

//     setLoading(false);

//     if (start && end) {
//       setStartPos(start);
//       setEndPos(end);
//       setPosition(start);

//       const distance = getDistance(start, end);

//       // ETA (سرعة تقريبية 40 كم/ساعة)
//       const speed = 40;
//       const time = Math.round((distance / speed) * 60);
//       setEta(time);

//       toast.success("Route selected!");
//     } else {
//       toast.error("Invalid locations");
//     }
//   };

//   return (
//     <>
//       <ProfileNav locale={locale} />

//       <div className="p-4 space-y-4 rtl mb-5">
//         <Toaster />

//         {/* اختيار العربية */}
//         <div className="flex items-center justify-center mt-5">
//           <div className="border border-emerald-200 rounded-md p-3 focus-within:border-emerald-600 w-1/2">
//             <select
//               value={selectedType}
//               onChange={(e) => handleSelect(e.target.value)}
//               className="w-full outline-none bg-transparent text-gray-700"
//             >
//               <option value="">{t("selectCar")}</option>
//               {cars.map((car, index) => (
//                 <option key={index} value={car.type}>
//                   {car.type}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* البداية والنهاية */}
//         <div className="flex gap-2 items-center justify-center mt-5">
//           {/* Start */}
//           <div className="relative border border-emerald-200 rounded-md p-3 focus-within:border-emerald-600 w-full sm:w-1/3">
//             <input
//               type="text"
//               placeholder={t("startPoint")}
//               value={startQuery}
//               onChange={(e) => {
//                 const value = e.target.value;
//                 setStartQuery(value);
//                 debouncedStart(value);
//               }}
//               onBlur={() => {
//                 setTimeout(() => setStartSuggestions([]), 100);
//               }}
//               className="w-full outline-none bg-transparent text-gray-700"
//             />

//             {startSuggestions.length > 0 && (
//               <div className="absolute left-0 bg-white shadow rounded w-full z-[1000] max-h-60 overflow-y-auto">
//                 {startSuggestions.map((item, index) => (
//                   <div
//                     key={index}
//                     className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
//                     onClick={() => {
//                       setStartQuery(item.display_name);
//                       setStartPos([parseFloat(item.lat), parseFloat(item.lon)]);
//                       setStartSuggestions([]);
//                     }}
//                   >
//                     {item.display_name}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* End */}
//           <div className="relative border border-emerald-200 rounded-md p-3 focus-within:border-emerald-600 w-full sm:w-1/3">
//             <input
//               type="text"
//               placeholder={t("endPoint")}
//               value={endQuery}
//               onChange={(e) => {
//                 const value = e.target.value;
//                 setEndQuery(value);
//                 debouncedEnd(value);
//               }}
//               onBlur={() => {
//                 setTimeout(() => setEndSuggestions([]), 100);
//               }}
//               className="w-full outline-none bg-transparent text-gray-700"
//             />

//             {endSuggestions.length > 0 && (
//               <div className="absolute left-0 bg-white shadow rounded w-full z-[1000] max-h-60 overflow-y-auto">
//                 {endSuggestions.map((item, index) => (
//                   <div
//                     key={index}
//                     className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
//                     onClick={() => {
//                       setEndQuery(item.display_name);
//                       setEndPos([parseFloat(item.lat), parseFloat(item.lon)]);
//                       setEndSuggestions([]);
//                     }}
//                   >
//                     {item.display_name}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/*  Button */}
//           <button
//             onClick={handleRoute}
//             disabled={loading}
//             className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded disabled:opacity-50"
//           >
//             {loading ? t("btnRouteLoading") : t("btnRoute")}
//           </button>
//         </div>
//         {/* الخريطة */}
//         <Map position={position} start={startPos} end={endPos} />
//       </div>
//     </>
//   );
// }

