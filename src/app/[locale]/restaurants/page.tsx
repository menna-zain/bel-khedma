"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProfileNav from "@/components/ProfileNav";
import { Star } from "lucide-react";
import { useLocale } from "next-intl";

type Restaurant = {
  id: number;
  name: string;
  description: string;
  rating: number;
  price: string;
  image: string;
};

const restaurants: Restaurant[] = [
  {
    id: 1,
    name: "Al Malaz Restaurant",
    description: "Traditional Saudi cuisine",
    rating: 4,
    price: "SAR 50-150",
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
  },
  {
    id: 2,
    name: "Seafood Palace",
    description: "Fresh seafood with ocean view",
    rating: 5,
    price: "SAR 120-300",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
  },
  {
    id: 3,
    name: "Seafood Palace",
    description: "Fresh seafood with ocean view",
    rating: 5,
    price: "SAR 120-300",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
  },
  {
    id: 4,
    name: "Seafood Palace",
    description: "Fresh seafood with ocean view",
    rating: 5,
    price: "SAR 120-300",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
  },
];

export default function RestaurantsPage() {
  const router = useRouter();
  const locale = useLocale() as "en" | "ar";

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

  return (
    <>
      <ProfileNav locale={locale} />
      <div className="p-4 space-y-4 rtl">
        <h1 className="text-xl font-bold text-center text-emerald-700 mx-10">Book your fave Restaurants</h1>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          {restaurants.map((r) => (
            <div
              key={r.id}
              onClick={() => router.push(`/restaurants/${r.id}`)}
              className="border border-emerald-200 rounded-md p-3 shadow-sm hover:shadow-md cursor-pointer transition"
            >
              <img
                src={r.image}
                className="w-full h-42 object-cover rounded-md"
              />
              <h2 className="text-lg font-bold mt-2">{r.name}</h2>
              <p className="text-gray-600">{r.description}</p>
              {renderStars(r.rating)}
              <p className="text-emerald-700 font-bold">{r.price}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}