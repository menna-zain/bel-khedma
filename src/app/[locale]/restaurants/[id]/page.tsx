"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Star } from "lucide-react";
import ProfileNav from "@/components/ProfileNav";
import { useLocale, useTranslations } from "next-intl";
import { ClipLoader } from "react-spinners";

type Restaurant = {
  id: string;
  name: string;
  stars?: number;
  address?: string;
  thumbnail?: string;
  description?: string;
};

export default function RestaurantDetails() {
  const { id } = useParams();
  const locale = useLocale() as "en" | "ar";
  const t = useTranslations("user");

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  const renderStars = (rating: number = 0) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
      </div>
    );
  };

  const getRestaurant = async () => {
    try {
      const res = await axios.get(
        `https://bilkhidmah-api.vercel.app/api/v1/restaurants/${id}`,
      );

      console.log(res);
      setRestaurant(res.data?.data?.rest || null);
    } catch (err) {
      console.log(err);
      setRestaurant(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRestaurant();
  }, [id]);

  return (
    <>
      <ProfileNav locale={locale} />
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-white ">
          <ClipLoader color="#007A55" size={50} />
        </div>
      ) : restaurant ? (
        <div
          className="flex justify-center min-h-screen"
          dir={locale === "ar" ? "rtl" : "ltr"}
        >
          <div className="p-4 space-y-4 w-full md:w-1/2">
            {/* صورة */}
            <img
              src={restaurant.thumbnail}
              className="w-full object-cover rounded-md"
            />

            {/* بيانات */}
            <h1 className="text-xl font-bold">{restaurant.name}</h1>

            <p className="text-gray-500">{restaurant.address}</p>

            <p className="text-gray-600">{restaurant.description}</p>

            {/* stars */}
            <div className="flex items-center gap-2">
              {renderStars(restaurant.stars || 0)}
              <span>{restaurant.stars || 0}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg text-gray-500">{t("restaurantNotFound")}</p>
        </div>
      )}
    </>
  );
}
