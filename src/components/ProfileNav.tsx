"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations } from "next-intl";
import { FaHandsHelping, FaSignOutAlt } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiCheck, FiGlobe } from "react-icons/fi";
import { RiArrowDropDownLine } from "react-icons/ri";
import { MdAccountCircle } from "react-icons/md";

type NavbarProps = {
  locale: "en" | "ar";
};

export default function ProfileNav({ locale }: NavbarProps) {
  const t = useTranslations("profileNav");
  const router = useRouter();

  const direction = locale === "ar" ? "rtl" : "ltr";

  // profile
  const [open, setOpen] = useState(false);

  const navLinks = [
    { name: "delivery", href: "/delivery" },
    { name: "transportation", href: "/transportation" },
    { name: "tourGuidance", href: "/tour" },
    { name: "hotels", href: "/hotels" },
    { name: "restaurants", href: "/restaurants" },
  ];

  // دالة تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  return (
    <nav
      className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-300 sticky top-0 left-0 w-full shadow-md z-50"
      dir={direction}
    >
      {/* اللوجو واسم الخدمة */}
      <div className="flex items-center gap-2">
        <FaHandsHelping size={30} className="text-emerald-700" />
        <span className="font-bold text-2xl text-black">
          {t("serviceName")}
        </span>
      </div>

      {/* روابط الصفحات */}
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

      {/* أيقونات اللغة والخروج */}
      <div className="flex items-center ">
        <LanguageSwitcher />

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
                onClick={() => {router.push("/requests"); setOpen(false); }}
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
      </div>
    </nav>
  );
}
