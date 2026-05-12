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
  const t = useTranslations("Vnavbar");
  const router = useRouter();
  const pathname = usePathname();

  const direction = locale === "ar" ? "rtl" : "ltr";

  const [open, setOpen] = useState(false);



    const navLinks = [
    { name: "Target", href: "/target" },
    { name: "Requests", href: "/vRequests" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

const isActive = (href: string) => {
  const cleanPath = pathname.replace(`/${locale}`, "") || "/";

  return (
    cleanPath === href ||
    cleanPath === href + "/" ||
    cleanPath.startsWith(href + "/")
  );
};

  return (
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
              className={`  font-semibold text-lg transition
               ${
                isActive(link.href)
                  ? "text-emerald-700 underline underline-offset-8 "
                  : "text-gray-800 hover:text-emerald-700"
              }`}
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
  );
}

























