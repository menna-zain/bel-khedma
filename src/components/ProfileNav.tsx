"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations } from "next-intl";
import { FaHandsHelping, FaSignOutAlt } from "react-icons/fa";

type NavbarProps = {
  locale: "en" | "ar";
};

export default function ProfileNav({ locale }: NavbarProps) {
  const t = useTranslations("profileNav");
  const router = useRouter();

  const direction = locale === "ar" ? "rtl" : "ltr";

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
        <span className="font-bold text-2xl text-black">{t("serviceName")}</span>
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
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-red-600 hover:text-red-800 font-semibold"
        >
          <FaSignOutAlt size={20} />
          <span>{t("logout")}</span>
        </button>
      </div>
    </nav>
  );
}