"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaHandsHelping } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import axios from "axios";

type HoursData = {
  current: number;
  goal: number;
  progress: string;
};

export default function VolunteerHome() {
  const t = useTranslations("volunteer");
  const locale = useLocale();
  const direction = locale === "ar" ? "rtl" : "ltr";
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [hoursData, setHoursData] = useState<HoursData | null>(null);
  const [loading, setLoading] = useState(true);

  const navLinks = [
    { name: "delivery", href: "/target" },
    { name: "transportation", href: "/vRequests" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  useEffect(() => {
    const fetchHours = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const res = await axios.get(
          "https://bilkhidmah-api.vercel.app/api/v1/volunteers/hours",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setHoursData(res.data.data);
      } catch (err: any) {
        console.error("ERROR:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHours();
  }, []);

  const completedHoursRaw = hoursData?.current ?? 0;
  const targetHours = hoursData?.goal ?? 0;

  // منع تجاوز الهدف
  const completedHours =
    targetHours > 0
      ? Math.min(completedHoursRaw, targetHours)
      : completedHoursRaw;

  // حساب النسبة الصح من عندنا
  const progressPercent =
    targetHours > 0
      ? (completedHoursRaw / targetHours) * 100
      : 0;

  const isCompleted =
    targetHours > 0 && completedHoursRaw >= targetHours;

  // تحويل الساعات إلى HH:MM
  const formatHours = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <>
      {/* NAVBAR */}
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

        <div className="flex items-center gap-3">
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
                <button className="w-full px-4 py-2 hover:bg-gray-100 text-sm text-left">
                  {t("profile")}
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 hover:bg-gray-100 text-sm text-red-600 font-semibold text-left"
                >
                  {t("logout")}
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="p-6 space-y-6 flex flex-col items-center justify-center">
        <div className="p-4 w-1/2 mt-14">
          <h1 className="text-6xl text-center font-bold text-emerald-700">
            {t("welcome")}
          </h1>
          <h2 className="text-4xl text-center font-bold text-emerald-700">
            {t("hours")}
          </h2>
        </div>

        {/* CARD */}
        <div className="flex gap-5 w-full justify-center">
          <div className="bg-white p-6 w-1/2 rounded-2xl shadow-md text-center">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 items-center">
                <span className="text-9xl font-bold text-gray-800">
                  {formatHours(completedHours)}
                </span>

                <span className="text-2xl font-bold text-gray-500">
                  {t("from")}
                </span>

                <span className="text-6xl font-bold text-emerald-700">
                  {formatHours(targetHours)}
                </span>

                {/* Progress */}
                <div className="w-full mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: Math.min(progressPercent, 100) + "%",
                      }}
                    />
                  </div>

                  <p className="text-sm text-gray-500 mt-2">
                    {Math.min(progressPercent, 100).toFixed(0)}%
                  </p>

                  {/* رسالة التهنئة */}
                  {isCompleted && (
                    <p className="text-emerald-600 font-bold mt-3 text-lg">
                     {t("cong")}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}




// "use client";

// import { useTranslations, useLocale } from "next-intl";
// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import { FaHandsHelping } from "react-icons/fa";
// import { MdAccountCircle } from "react-icons/md";
// import Link from "next/link";
// import LanguageSwitcher from "@/components/LanguageSwitcher";
// import axios from "axios";

// type HoursData = {
//   current: number;
//   goal: number;
//   progress: string;
// };

// export default function VolunteerHome() {
//   const t = useTranslations("volunteer");
//   const locale = useLocale();
//   const direction = locale === "ar" ? "rtl" : "ltr";
//   const router = useRouter();

//   const [open, setOpen] = useState(false);

//   const [hoursData, setHoursData] = useState<HoursData | null>(null);
//   const [loading, setLoading] = useState(true);

//   const navLinks = [
//     { name: "delivery", href: "/target" },
//     { name: "transportation", href: "/vRequests" },
//   ];

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     router.push("/login");
//   };

//   useEffect(() => {
//     const fetchHours = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         if (!token) {
//           setLoading(false);
//           return;
//         }

//         const res = await axios.get(
//           "https://bilkhidmah-api.vercel.app/api/v1/volunteers/hours",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         setHoursData(res.data.data); // 👈 مهم جدًا (حسب شكل الـ API اللي عندك)
//       } catch (err: any) {
//         console.error("ERROR:", err.response?.data || err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHours();
//   }, []);

//   const completedHours = hoursData?.current ?? 0;
//   const targetHours = hoursData?.goal ?? 0;

//   // تحويل الساعات إلى HH:MM
//   const formatHours = (hours: number) => {
//     const h = Math.floor(hours);
//     const m = Math.round((hours - h) * 60);
//     return `${h.toString().padStart(2, "0")}:${m
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   return (
//     <>
//       {/* NAVBAR */}
//       <nav
//         className="flex items-center justify-between p-4 bg-white border-b border-gray-300 sticky top-0 left-0 w-full shadow-md z-50"
//         dir={direction}
//       >
//         <div className="flex items-center gap-2">
//           <FaHandsHelping size={30} className="text-emerald-700" />
//           <span className="font-bold text-2xl text-black">
//             {t("serviceName")}
//           </span>
//         </div>

//         <div className="flex gap-4">
//           {navLinks.map((link) => (
//             <Link
//               key={link.name}
//               href={link.href}
//               className="text-gray-800 hover:text-emerald-700 font-semibold text-lg transition"
//             >
//               {t(link.name)}
//             </Link>
//           ))}
//         </div>

//         <div className="flex items-center gap-3">
//           <LanguageSwitcher />

//           <div className="relative">
//             <button
//               onClick={() => setOpen(!open)}
//               className="flex items-center px-2 py-1 rounded-lg hover:bg-gray-200 transition"
//             >
//               <MdAccountCircle size={32} />
//             </button>

//             {open && (
//               <div
//                 className={`absolute mt-2 bg-white shadow-lg rounded-xl border border-gray-300 z-[5000] p-2 ${
//                   locale === "ar" ? "left-0 w-38" : "right-0 w-28"
//                 }`}
//               >
//                 <button className="w-full px-4 py-2 hover:bg-gray-100 text-sm text-left">
//                   {t("profile")}
//                 </button>

//                 <button
//                   onClick={handleLogout}
//                   className="w-full px-4 py-2 hover:bg-gray-100 text-sm text-red-600 font-semibold text-left"
//                 >
//                   {t("logout")}
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </nav>

//       {/* CONTENT */}
//       <div className="p-6 space-y-6 flex flex-col items-center justify-center">
//         <div className="p-4 w-1/2 mt-14">
//           <h1 className="text-6xl text-center font-bold text-emerald-700">
//             {t("welcome")}
//           </h1>
//         </div>

//         {/* CARD */}
//         <div className="flex gap-5 w-full justify-center">
//           <div className="bg-white p-6 w-1/2 rounded-2xl shadow-md text-center">
//             {loading ? (
//               <div className="animate-pulse space-y-4">
//                 <div className="h-20 bg-gray-200 rounded"></div>
//                 <div className="h-10 bg-gray-200 rounded w-1/2 mx-auto"></div>
//               </div>
//             ) : (
//               <div className="flex flex-col gap-4 items-center">
//                 <span className="text-9xl font-bold text-gray-800">
//                   {formatHours(completedHours)}
//                 </span>

//                 <span className="text-2xl font-bold text-gray-500">
//                   {t("from")}
//                 </span>

//                 <span className="text-6xl font-bold text-emerald-700">
//                   {formatHours(targetHours)}
//                 </span>

//                 {/* Progress */}
//                 <div className="w-full mt-4">
//                   <div className="w-full bg-gray-200 rounded-full h-3">
//                     <div
//                       className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
//                       style={{
//                         width: hoursData?.progress || "0%",
//                       }}
//                     />
//                   </div>

//                   <p className="text-sm text-gray-500 mt-2">
//                     {hoursData?.progress || "0%"}
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }