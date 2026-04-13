"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LogOut } from "lucide-react";

export default function Sidebar() {
  const t = useTranslations("dashboard");
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { name: t("hotels"), href: "/admin/hotels" },
    { name: t("rest"), href: "/admin/restaurants" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  return (
    <div className="w-64 bg-white border-r flex flex-col justify-between p-4 min-h-screen border-gray-300">

      <div>
        <div className="flex items-center gap-2 mb-16">
          <span className="font-bold text-2xl text-black">
            {t("serviceName")}
          </span>
        </div>

        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <div
              className={`p-3 rounded-lg mb-2 cursor-pointer font-semibold hover:bg-gray-100`}
            >
              {link.name}
            </div>
          </Link>
        ))}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 font-semibold text-red-600 hover:text-red-700 transition p-2 mb-10"
      >
        <LogOut className="w-5 h-5" />
        {t("logout")}
      </button>
    </div>
  );
}