"use client";

import { useParams } from "next/navigation";
import { Star } from "lucide-react";
import ProfileNav from "@/components/ProfileNav";
import { useLocale } from "next-intl";



const hotels = [
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
];

export default function HotelDetails() {
  const { id } = useParams();
  const locale = useLocale() as "en" | "ar";

  const hotel = hotels.find((h) => h.id === Number(id));

  

  if (!hotel) return <p>Hotel not found</p>;

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

      <div className="flex justify-center"> 

      <div className="p-4 space-y-4 rtl w-1/2">

        {/* 🖼 صورة */}
        <img
          src={hotel.image}
          className="w-full h-60 object-cover rounded-md"
        />

        {/*  بيانات */}
        <h1 className="text-xl font-bold">{hotel.name}</h1>

        <p className="text-gray-500"> {hotel.location}</p>

        <p className="text-gray-600">{hotel.description}</p>

        <div className="flex items-center gap-2">
          {renderStars(Math.floor(hotel.rating))}
          <span>{hotel.rating}</span>
        </div>

        <p className="text-emerald-700 font-bold">
          {hotel.price} SAR / night
        </p>

        {/*  زر الحجز */}
        <button className="bg-emerald-700 text-white px-4 py-2 rounded w-full">
          Book Now
        </button>
      </div>
      </div>

    </>
  );
}