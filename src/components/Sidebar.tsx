"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

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
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <div
              className={`p-3 rounded-lg mb-2 cursor-pointer  ${
                // pathname.includes(link.href)
                //   ? "bg-purple-400 text-white"
                  "hover:bg-gray-100"
              }`}
            >
              {link.name}
            </div>
          </Link>
        ))}
      </div>

      <button 
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg">
        {t("logout")}
      </button>
    </div>
  );
}