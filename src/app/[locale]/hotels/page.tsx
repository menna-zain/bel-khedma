"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import ProfileNav from "@/components/ProfileNav";
import { useLocale } from "next-intl";

import { useRouter } from "next/navigation";



type Hotel = {
  id: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  description: string;
};

const hotels: Hotel[] = [
  {
    id: 1,
    name: "Hilton Hotel",
    location: "Riyadh",
    price: 450,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    description: "Luxury hotel with amazing city view",
  },
  {
    id: 2,
    name: "Marriott Hotel",
    location: "Jeddah",
    price: 520,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
    description: "Modern hotel near the sea",
  },
  {
    id: 3,
    name: "Four Seasons",
    location: "Cairo",
    price: 600,
    rating: 5,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
    description: "Luxury Nile view hotel",
  },
];

export default function HotelsPage() {
  const locale = useLocale() as "en" | "ar";
  const router = useRouter();

  //  states الفلترة
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("");
  const [city, setCity] = useState("");

  //  النجوم
  const renderStars = (rating: number) => {
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

  //  الفلترة
  const filteredHotels = hotels.filter((hotel) => {
    return (
      (!minPrice || hotel.price >= Number(minPrice)) &&
      (!maxPrice || hotel.price <= Number(maxPrice)) &&
      (!rating || hotel.rating >= Number(rating)) &&
      (!city || hotel.location.toLowerCase().includes(city.toLowerCase()))
    );
  });

  return (
    <>
      <ProfileNav locale={locale} />

      <div className="p-4 space-y-4 rtl mb-5">

        {/* 🔍 الفلتر */}
        <div className="flex flex-wrap justify-center gap-2">

          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border border-emerald-200 rounded-md p-2 w-32 outline-none"
          />

          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border border-emerald-200 rounded-md p-2 w-32 outline-none"
          />

          <input
            type="number"
            placeholder="Rating (e.g 4)"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="border border-emerald-200 rounded-md p-2 w-32 outline-none"
          />

          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border border-emerald-200 rounded-md p-2 w-32 outline-none"
          />
        </div>

        {/*  قائمة الفنادق */}
        <div className="flex flex-col items-center gap-4">

          {filteredHotels.length > 0 ? (
            filteredHotels.map((hotel) => (
              
              <div
                key={hotel.id}
                  onClick={() => router.push(`/hotels/${hotel.id}`)}
                className="w-1/2 border border-emerald-200 rounded-md p-3 shadow-sm hover:shadow-md transition"
              >
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />

                <h2 className="text-lg font-bold text-gray-800">
                  {hotel.name}
                </h2>

                <p className="text-sm text-gray-500">
                 {hotel.location}
                </p>

                <p className="text-sm text-gray-600 mt-1">
                  {hotel.description}
                </p>

                <div className="flex items-center justify-between mt-2">
                  {renderStars(hotel.rating)}
                  <span className="text-sm font-semibold">
                    {hotel.rating}
                  </span>
                </div>

                <p className="text-emerald-700 font-bold mt-2">
                  {hotel.price} SAR / night
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No hotels found</p>
          )}

        </div>
      </div>
    </>
  );
}