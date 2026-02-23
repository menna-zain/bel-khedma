"use client";

import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations } from "next-intl";
import { FaHandsHelping } from "react-icons/fa";

type NavbarProps = {
  locale: "en" | "ar";
};

export default function Navbar({ locale }: NavbarProps) {
  const t = useTranslations("Navbar");

  // تحديد اتجاه النصوص تلقائي حسب اللغة
  const direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <nav
      className={`flex items-center justify-between p-4 bg-gray-100 border-b border-gray-300`}
      dir={direction}
    >
      {/* اللوجو واسم الخدمة */}
      <div className="flex items-center gap-2">
        {/* <img src="/logo.png" alt="Logo" className="w-10 h-10" /> */}
        <FaHandsHelping size={30} 
        className="text-emerald-600"/>
        <span className="font-bold text-2xl text-black">{t("serviceName")}</span>
      </div>

      {/* أزرار اللغة وتسجيل الدخول */}
      <div className="flex items-center gap-4">
        <LanguageSwitcher locale={locale} />
        <Link href="">
          <button className="px-4 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition">
            {t("login")}
          </button>
        </Link>
      </div>
    </nav>
  );
}
