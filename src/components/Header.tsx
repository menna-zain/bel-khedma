"use client";

import { usePathname, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export default function Header({ title }: { title: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const isHotelPage = pathname.includes("/admin/hotels");
  const isRestaurantPage = pathname.includes("/admin/restaurants");

  const handleClick = () => {
    if (isHotelPage) {
      router.push("/admin/addHotel");
    } else if (isRestaurantPage) {
      router.push("/admin/addRestaurant");
    }
  };

  const showButton = isHotelPage || isRestaurantPage;

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">{title}</h1>

      {showButton && (
        <button
          onClick={handleClick}
          className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          {isHotelPage ? "Add Hotel" : "Add Restaurant"}
        </button>
      )}
    </div>
  );
}