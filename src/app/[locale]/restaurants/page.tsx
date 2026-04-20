"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileNav from "@/components/ProfileNav";
import { Star } from "lucide-react";
import { useLocale } from "next-intl";
import axios from "axios";

type Restaurant = {
  id: string;
  name: string;
  address: string;
  stars: number;
  thumbnail: string;
};

export default function RestaurantsPage() {
  const router = useRouter();
  const locale = useLocale() as "en" | "ar";

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRestaurants = async () => {
      try {
        const res = await axios.get(
          "https://bilkhidmah-api.vercel.app/api/v1/restaurants"
        );

        console.log("API Response:", res.data);

        // ✅ الصح حسب الداتا بتاعتك
        setRestaurants(res.data.data.rests);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    getRestaurants();
  }, []);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <>
      <ProfileNav locale={locale} />
      <div className="p-4 space-y-4 rtl">
        <h1 className="text-xl font-bold text-center text-emerald-700 mx-10">
          Book your fave Restaurants
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          {restaurants.map((r) => (
            <div
              key={r.id}
              onClick={() => router.push(`/restaurants/${r.id}`)}
              className="border border-emerald-200 rounded-md p-3 shadow-sm hover:shadow-md cursor-pointer transition"
            >
              <img
                src={r.thumbnail}
                className="w-full h-42 object-cover rounded-md"
              />

              <h2 className="text-lg font-bold mt-2">{r.name}</h2>

              {/* بدل description */}
              <p className="text-gray-600">{r.address}</p>

              {renderStars(Number(r.stars))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}