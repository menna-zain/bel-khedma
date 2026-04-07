"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaHandsHelping } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import Link from "next/link";

interface Activity {
  id: number;
  title: string;
  hours: number;
  date: string;
}

export default function VolunteerHome() {
  const t = useTranslations("volunteer");
  const locale = useLocale(); // ar | en
  const direction = locale === "ar" ? "rtl" : "ltr";
  const router = useRouter();

  const [targetHours, setTargetHours] = useState(50);
  const [activities, setActivities] = useState<Activity[]>([
    { id: 1, title: "Delivery", hours: 2, date: "2026-04-05" },
    { id: 2, title: "Transportation", hours: 3, date: "2026-04-06" },
  ]);


   const navLinks = [
    { name: "delivery", href: "/target" },
    { name: "transportation", href: "/vRequests" },
  ];
  const completedHours = activities.reduce((acc, a) => acc + a.hours, 0);
  const progress = Math.min((completedHours / targetHours) * 100, 100);

  const [open, setOpen] = useState(false);

  const addActivity = () => {
    const newActivity: Activity = {
      id: Date.now(),
      title: "New Activity",
      hours: 1,
      date: new Date().toISOString().split("T")[0],
    };
    setActivities([newActivity, ...activities]);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  // دالة لتحويل الساعات إلى HH:MM
  const formatHours = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <nav
        className={`flex items-center justify-between p-4 bg-white border-b border-gray-300 sticky top-0 left-0 w-full shadow-md z-50`}
        dir={direction}
      >
        {/* اللوجو واسم الخدمة */}
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
        

        {/* profile */}
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
              <button className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 transition text-sm">
                {t("profile")}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-600 hover:text-red-800 font-semibold justify-between w-full px-4 py-2 hover:bg-gray-100 transition text-sm"
              >
                <span>{t("logout")}</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="p-6 space-y-6 flex flex-col items-center justify-center">
        {/* Welcome */}
        <div className="p-4 w-1/2">
          <h1 className="text-2xl text-center font-bold text-emerald-700">
            {t("welcome")}
          </h1>
        </div>

        <div className="flex gap-5 w-full justify-center">
          {/* Progress */}
          <div className="bg-white p-4 rounded-2xl shadow w-1/2">
            <h2 className="font-semibold mb-2 ">{t("progress")}</h2>
            <div className="mb-2 text-center">
              <div className="flex flex-col gap-3">
                <span className="text-6xl">{formatHours(completedHours)}</span>{" "}
                <span className="text-lg font-bold">{t("from")}</span>{" "}
                <span className="text-6xl">{formatHours(targetHours)}</span>{" "}
          
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
