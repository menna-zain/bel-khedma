"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { LogOut, Languages } from "lucide-react";
import { FaHandsHelping } from "react-icons/fa";

export default function Sidebar() {
  const t = useTranslations("dashboard");
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  const isRTL = locale === "ar";

  const links = [
    { name: t("hotels"), href: "/admin/hotels" },
    { name: t("rest"), href: "/admin/restaurants" },
    { name: t("land"), href: "/admin/landmarks" },
  ];

const cleanPath = pathname.replace(`/${locale}`, "") || "/";

const isActive = (href: string) => {
  return cleanPath === href || cleanPath.startsWith(href + "/");
};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  const toggleLanguage = () => {
    const newLocale = locale === "en" ? "ar" : "en";
    router.push(`/${newLocale}${pathname.replace(/^\/(en|ar)/, "")}`);
  };

  return (
   <div
  className={`w-64 bg-white flex flex-col justify-between p-4 h-screen sticky top-0 border-gray-300
    ${isRTL ? "border-l" : "border-r"}
  `}
>

      <div>
        <div className="flex items-center gap-2 mb-16">
          <FaHandsHelping size={30} 
                  className="text-emerald-700"/>
          <span className="font-bold text-2xl text-black">
            {t("serviceName")}
          </span>
        </div>

        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <div className={`p-3 rounded-lg mb-2 cursor-pointer font-semibold hover:bg-gray-100
              ${
         isActive(link.href)

            ? "bg-emerald-100 text-emerald-700"
            : "hover:bg-gray-100 text-black"
        }`
            }>
              {link.name}
            </div>
          </Link>
        ))}
      </div>

      {/* أزرار تحت */}
      <div className="flex flex-col gap-3">

        {/* زر اللغة */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 font-semibold text-black hover:text-blue-700 transition p-2"
        >
          <Languages className="w-5 h-5" />
          {locale === "en" ? "العربية" : "English"}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 font-semibold text-red-600 hover:text-red-800 transition p-2"
        >
          <LogOut className="w-5 h-5" />
          {t("logout")}
        </button>

      </div>
    </div>
  );
}