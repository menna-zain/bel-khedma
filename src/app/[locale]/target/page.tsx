"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaHandsHelping } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";

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

  // دالة تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  return (
    <>
      <nav
        className={`flex items-center justify-between p-4 bg-white border-b border-gray-300 sticky top-0 left-0 w-full  shadow-md z-50`}
        dir={direction}
      >
        {/* اللوجو واسم الخدمة */}
        <div className="flex items-center gap-2">
          <FaHandsHelping size={30} className="text-emerald-700" />
          <span className="font-bold text-2xl text-black">
            {t("serviceName")}
          </span>
        </div>
        {/* profile */}
        <div className="relative ">
          {/* Button */}
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center  px-2 py-1 rounded-lg hover:bg-gray-200 transition"
          >
            <MdAccountCircle size={32} />
          </button>

          {/* Dropdown */}
          {open && (
            <div
              className={`absolute mt-2  bg-white shadow-lg rounded-xl border border-gray-300 z-[5000] p-2 
          ${locale === "ar" ? "left-0 w-38" : "right-0 w-28"}`}
            >
              <button
                onClick={() => {
                  router.push("/requests");
                  setOpen(false);
                }}
                className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 transition text-sm"
              >
                {t("requests")}
              </button>

              <button
                // onClick={() =>}
                className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 transition text-sm"
              >
                {t("profile")}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-600 hover:text-red-800 font-semibold justify-between w-full px-4 py-2 hover:bg-gray-100 transition text-sm"
              >
                {/* <FaSignOutAlt size={20} /> */}
                <span>{t("logout")}</span>
              </button>
            </div>
          )}
        </div>
      </nav>
      <div className="p-6 space-y-6 flex flex-col items-center justify-center ">
        {/* Welcome */}
        <div className=" p-4  w-1/2">
          <h1 className="text-2xl text-center font-bold text-emerald-700">
            {" "}
            {t("welcome")}
          </h1>
          <p className="font-bold text-xl text-gray-500 text-center ">
            {t("motivation")}
          </p>
        </div>

        <div className="flex gap-5 w-full">
          {/* Progress */}
          <div className="bg-white p-4 rounded-2xl shadow w-1/2">
            <h2 className="font-semibold mb-2">{t("progress")}</h2>
            <p className="mb-2">
              {completedHours} / {targetHours} hours
            </p>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-emerald-700 h-4 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm mt-1">{progress.toFixed(0)}%</p>
          </div>

          {/* Today */}
          <div className="bg-white p-4 rounded-2xl shadow w-1/2">
            <h2 className="font-semibold">{t("today")}</h2>
            <p className="text-gray-500">
              {t("todayHours", { hours: activities[0]?.hours || 0 })}
            </p>
          </div>
        </div>

        {/* Activities */}
        <div className="bg-white p-4 rounded-2xl shadow w-3/4">
          <h2 className="font-semibold mb-3">{t("activities")}</h2>
          <div className="space-y-2">
            {activities.map((a) => (
              <div
                key={a.id}
                className="flex justify-between bg-gray-100 p-2 rounded-lg"
              >
                <span>{a.title}</span>
                <span>{a.hours}h</span>
                <span className="text-gray-400 text-sm">{a.date}</span>
              </div>
            ))}
          </div>
          {/* Quick Actions */}
          <div className="flex gap-3 mt-5">
            <button
              onClick={addActivity}
              className="bg-violet-500 hover:bg-violet-900  text-white px-4 py-2 rounded-xl"
            >
              {t("addActivity")}
            </button>
          </div>
        </div>

        {/* Achievements */}
        {/* <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="font-semibold mb-2"> {t("achievements")}</h2>
        <div className="flex gap-3">
          <span className="bg-yellow-100 px-3 py-1 rounded">10h</span>
          <span className="bg-gray-200 px-3 py-1 rounded">25h</span>
          <span className="bg-orange-200 px-3 py-1 rounded">50h</span>
        </div>
      </div> */}
      </div>
    </>
  );
}
