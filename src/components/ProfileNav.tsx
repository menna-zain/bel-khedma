"use client";

import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations } from "next-intl";
import { FaHandsHelping } from "react-icons/fa";

type NavbarProps = {
  locale: "en" | "ar";
};

export default function ProfileNav({ locale }: NavbarProps) {
  const t = useTranslations("Navbar");

  // تحديد اتجاه النصوص تلقائي حسب اللغة
  const direction = locale === "ar" ? "rtl" : "ltr";

  // قائمة الروابط
  const navLinks = [
    { name: "Delivery", href: "/delivery" },
    { name: "Transportation", href: "/transportation" },
    { name: "Tour Guidance", href: "/tour" },
    // { name: "Guidance", href: "/guidance" },
    { name: "Hotels", href: "/hotels" },
    { name: "Restaurants", href: "/restaurants" },
  ];

  return (
    <nav
      className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-300 sticky top-0 left-0 w-full shadow-md z-50"
      dir={direction}
    >
      {/* اللوجو واسم الخدمة */}
      <div className="flex items-center gap-2">
        <FaHandsHelping size={30} className="text-emerald-700" />
        <span className="font-bold text-2xl text-black">{t("serviceName")}</span>
      </div>

      {/* روابط الصفحات  */}
      <div className="flex items-center  gap-6">
        <div className="flex gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-gray-800 hover:text-emerald-700 font-semibold text-lg transition"
            >
              {link.name}
            </Link>
          ))}
        </div>
        {/* LanguageSwitcher */}
      </div>
      <div className="flex items-center justify-center gap-6">
        
        <LanguageSwitcher />
      </div>
    </nav>
  );
}