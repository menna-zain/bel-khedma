"use client";

import { usePathname, useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export default function Header({ title }: { title: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("dashboard");
  const locale = useLocale();

  const isHotelPage = pathname.includes("/admin/hotels");
  const isRestaurantPage = pathname.includes("/admin/restaurants");
  const isLandmarkPage = pathname.includes("/admin/landmarks"); // 👈 جديد

  const handleClick = () => {
    if (isHotelPage) {
      router.push("/admin/addHotel");
    } else if (isRestaurantPage) {
      router.push("/admin/addRestaurant");
    } else if (isLandmarkPage) {
      router.push("/admin/addLandmark"); //  جديد
    }
  };

  const showButton = isHotelPage || isRestaurantPage || isLandmarkPage; //  مهم

  return (
    <div
      className="flex items-center justify-between mb-6 p-5"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <h1 className="text-3xl font-bold text-emerald-900">{title}</h1>

      {showButton && (
        <button
          onClick={handleClick}
          className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-4 h-4" />

          {isHotelPage
            ? t("addHotel")
            : isRestaurantPage
            ? t("addRestaurant")
            : t("addLandmark")} {/* جديد */}
        </button>
      )}
    </div>
  );
}