"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Star } from "lucide-react";
import ProfileNav from "@/components/ProfileNav";
import { useLocale, useTranslations } from "next-intl";

type Hotel = {
  id: string;
  name: string;
  stars?: number;
  address?: string;
  thumbnail?: string;
  description?: string;
};

export default function HotelDetails() {
  const { id } = useParams();
  const locale = useLocale()as "en" | "ar";
  const t = useTranslations("user");

  const [hotel, setHotel] = useState<Hotel | null>(null);
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

  const getHotel = async () => {
    try {
      const res = await axios.get(
        `https://bilkhidmah-api.vercel.app/api/v1/hotels/${id}`
      );

      setHotel(res.data?.data?.hotel || null);
    } catch (err) {
      console.log(err);
      setHotel(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHotel();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>{t("loading")}</p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-500">
          {t("hotelNotFound")}
        </p>
      </div>
    );
  }

  return (
    <>
      <ProfileNav locale={locale} />

      <div
        className="flex justify-center min-h-screen"
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        <div className="p-4 space-y-4 w-full md:w-1/2">

          {/* صورة */}
          <img
            src={hotel.thumbnail}
            className="w-full object-cover rounded-md"
          />

          {/* بيانات */}
          <h1 className="text-xl font-bold">{hotel.name}</h1>

          <p className="text-gray-500">{hotel.address}</p>

          <p className="text-gray-600">{hotel.description}</p>

          {/* stars */}
          <div className="flex items-center gap-2">
            {renderStars(hotel.stars || 0)}
            <span>{hotel.stars || 0}</span>
          </div>

          {/* زر */}
          {/* <button className="bg-emerald-700 text-white px-4 py-2 rounded w-full">
            {t("bookNow")}
          </button> */}
        </div>
      </div>
    </>
  );
}