"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations } from "next-intl";
import { FaHandsHelping } from "react-icons/fa";
import { useState } from "react";
import { MdAccountCircle } from "react-icons/md";

type NavbarProps = {
  locale: "en" | "ar";
};

export default function ProfileNav({ locale }: NavbarProps) {
  const t = useTranslations("profileNav");
  const router = useRouter();
  const pathname = usePathname();

  const direction = locale === "ar" ? "rtl" : "ltr";

  const [open, setOpen] = useState(false);

  const navLinks = [
    { name: "delivery", href: "/delivery" },
    { name: "transportation", href: "/transportation" },
    { name: "tourGuidance", href: "/tour" },
    { name: "hotels", href: "/hotels" },
    { name: "restaurants", href: "/restaurants" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

const isActive = (href: string) => {
  const cleanPath = pathname.replace(`/${locale}`, "") || "/";
  return cleanPath === href || cleanPath.startsWith(href + "/");
};

  return (
    <nav
      className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-300 sticky top-0 left-0 w-full shadow-md z-50"
      dir={direction}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <FaHandsHelping size={30} className="text-emerald-700" />
        <span className="font-bold text-2xl text-black">
          {t("serviceName")}
        </span>
      </div>

      {/* Links */}
      <div className="flex gap-3">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={`text-lg font-semibold transition px-2 py-1 rounded-md
              ${
                isActive(link.href)
                  ? "text-emerald-700 "
                  : "text-gray-800 hover:text-emerald-700"
              }`}
          >
            {t(link.name)}
          </Link>
        ))}
      </div>

      {/* Right side */}
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
              className={`absolute mt-2 bg-white shadow-lg rounded-xl border border-gray-300 z-50 p-2 
              ${locale === "ar" ? "left-0 w-38" : "right-0 w-28"}`}
            >
              <button
                onClick={() => {
                  router.push("/requests");
                  setOpen(false);
                }}
                className="w-full px-4 py-2 hover:bg-gray-100 text-sm text-left"
              >
                {t("requests")}
              </button>

              <button className="w-full px-4 py-2 hover:bg-gray-100 text-sm text-left">
                {t("profile")}
              </button>

              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 hover:bg-gray-100 text-sm text-red-600 text-left"
              >
                {t("logout")}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}