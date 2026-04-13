"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Card from "@/components/Card";

import { useTranslations } from "next-intl";

type Restaurant = {
  _id: string;
  name: string;
  city?: string;
  price?: number;
  images?: string[];
};

export default function RestaurantsPage() {
  const t = useTranslations("dashboard");

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  //  GET ALL RESTAURANTS
  const getRestaurants = async () => {
    try {
      const res = await axios.get(
        "https://bilkhidmah-api.vercel.app/api/v1/restaurants"
      );

      const data = res.data?.data?.restaurants;

      if (Array.isArray(data)) {
        setRestaurants(data);
      } else {
        setRestaurants(Object.values(data || {}));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  //  DELETE RESTAURANT
  const deleteRestaurant = async (id: string) => {
    try {
      await axios.delete(
        `https://bilkhidmah-api.vercel.app/api/v1/restaurants/${id}`
      );

      setRestaurants((prev) =>
        prev.filter((restaurant) => restaurant._id !== id)
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getRestaurants();
  }, []);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6">
        <Header title={t("rest")} />

        {loading ? (
          <p>Loading...</p>
        ) : restaurants.length === 0 ? (
          <p>No Restaurants Found</p>
        ) : (
          restaurants.map((restaurant) => (
            <Card
              key={restaurant._id}
              title={restaurant.name}
              subtitle={restaurant.city}
              price={restaurant.price}
              image={restaurant.images?.[0]}
              onDelete={() => deleteRestaurant(restaurant._id)}
            />
          ))
        )}
      </div>
    </div>
  );
}