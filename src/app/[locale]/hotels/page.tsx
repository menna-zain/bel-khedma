"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Star } from "lucide-react";
import ProfileNav from "@/components/ProfileNav";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

type Hotel = {
  id: string;
  name: string;
  stars?: number;
  address?: string;
  thumbnail?: string;
  description?: string;
};

export default function HotelsPage() {
  const locale = useLocale()as "en" | "ar";
  const t = useTranslations("user");
  const router = useRouter();

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  // فلترة
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("");
  const [city, setCity] = useState("");

  // ⭐ النجوم
  const renderStars = (rating: number = 0) => {
    return (
      <div className="flex gap-1 mt-1">
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

  // 📡 GET API
  const getHotels = async () => {
    try {
      const res = await axios.get(
        "https://bilkhidmah-api.vercel.app/api/v1/hotels"
      );

      const data = res.data?.data?.hotels;

      setHotels(Array.isArray(data) ? data : Object.values(data || {}));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHotels();
  }, []);

  //  فلترة
  const filteredHotels = hotels.filter((hotel) => {
    return (
      (!rating || (hotel.stars || 0) >= Number(rating)) &&
      (!city ||
        hotel.address?.toLowerCase().includes(city.toLowerCase()))
    );
  });

  return (
    <>
      <ProfileNav locale={locale} />

      <div
        className="p-4 space-y-4 mb-5"
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        {/*  الفلتر */}
        <div className="flex flex-wrap justify-center gap-2">
          <input
            type="number"
            placeholder={t("rating")}
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="border border-emerald-200 rounded-md p-2 w-32 outline-none"
          />

          <input
            type="text"
            placeholder={t("city")}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border border-emerald-200 rounded-md p-2 w-32 outline-none"
          />
        </div>

        {/*  الهوتيلز */}
        <div className="flex flex-col items-center gap-4">
          {loading ? (
            <p>{t("loading")}</p>
          ) : filteredHotels.length > 0 ? (
            filteredHotels.map((hotel) => (
              <div
                key={hotel.id}
                onClick={() => router.push(`/hotels/${hotel.id}`)}
                className="w-full md:w-1/2 border border-emerald-200 rounded-md p-3 shadow-sm hover:shadow-md transition cursor-pointer"
              >
                <div className="flex gap-5 ">
                <div>
                <img
                  src={hotel.thumbnail}
                  alt={hotel.name}
                  className="w-60 h-60 object-cover rounded-md mb-2"
                  />
</div>
                  <div className="flex flex-col justify-center gap-1">  
                <h2 className="text-2xl font-bold text-gray-800">
                  {hotel.name}
                </h2>

                <p className="text-lg text-gray-500">
                  {hotel.address}
                </p>

                <p className="text-lg text-gray-600 mt-1">
                  {hotel.description}
                </p>

                <div className="flex items-center gap-1 mt-2">
                  {renderStars(hotel.stars || 0)}
                  <span className="text-sm font-semibold">
                    {hotel.stars || 0}
                  </span>
                </div>
                </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-lg">
              {t("noHotelsYet")}
            </p>
          )}
        </div>
      </div>
    </>
  );
}