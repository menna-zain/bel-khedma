"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Card from "@/components/Card";

import { useTranslations, useLocale } from "next-intl";

type Restaurant = {
  id: string;
  name: string;
  stars?: number;
  address?: string;
  thumbnail?: string;
};

export default function RestaurantsPage() {
  const t = useTranslations("dashboard");
  const locale = useLocale();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  const getRestaurants = async () => {
    try {
      const res = await axios.get(
        "https://bilkhidmah-api.vercel.app/api/v1/restaurants"
      );

      const data = res.data?.data?.rests;
      setRestaurants(Array.isArray(data) ? data : Object.values(data || {}));
    } catch (err: any) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteRestaurant = async (id: string) => {
    try {
      await axios.delete(
        `https://bilkhidmah-api.vercel.app/api/v1/restaurants/${id}`
      );

      setRestaurants((prev) =>
        prev.filter((restaurant) => restaurant.id !== id)
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getRestaurants();
  }, []);

  return (
    <div
      className="flex min-h-screen"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <Sidebar />

      <div className="flex-1 p-6 flex flex-col">
        <Header title={t("rest")} />

        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-lg">{t("loading")}</p>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-2xl md:text-3xl font-bold text-gray-500 text-center">
              {t("noRestaurantsYet")}
            </p>
          </div>
        ) : (
          restaurants.map((restaurant) => (
            <Card
              key={restaurant.id}
              title={restaurant.name}
              stars={restaurant.stars}
              address={restaurant.address}
              image={restaurant.thumbnail}
              onDelete={() => deleteRestaurant(restaurant.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}