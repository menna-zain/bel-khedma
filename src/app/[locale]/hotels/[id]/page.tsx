"use client";

import { useParams } from "next/navigation";
import { Star } from "lucide-react";
import { useState } from "react";
import ProfileNav from "@/components/ProfileNav";
import { useLocale } from "next-intl";

type Review = {
  name: string;
  comment: string;
  rating: number;
};

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

  const [reviews, setReviews] = useState<Review[]>([
    { name: "Ali", comment: "Very clean and nice", rating: 5 },
    { name: "Sara", comment: "Good but expensive", rating: 4 },
  ]);

  const [comment, setComment] = useState("");
  const [rate, setRate] = useState(5);

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

  const addReview = () => {
    if (!comment) return;

    setReviews([
      ...reviews,
      { name: "User", comment, rating: rate },
    ]);

    setComment("");
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

        {/*  إضافة ريفيو */}
        <div className="mt-4">
          <h2 className="font-bold mb-2">Add Review</h2>

          <input
            type="text"
            placeholder="Write comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border w-full p-2 rounded mb-2"
          />

          <select
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="border p-2 rounded mb-2"
          >
            <option value={5}>5</option>
            <option value={4}>4</option>
            <option value={3}>3</option>
          </select>

          <button
            onClick={addReview}
            className="bg-emerald-600 text-white px-3 py-1 rounded ms-3"
          >
            Submit
          </button>
        </div>

        {/*  عرض الريفيوهات */}
        <div>
          <h2 className="font-bold mt-4">Reviews</h2>

          {reviews.map((r, i) => (
            <div key={i} className="border p-2 rounded mt-2">
              <p className="font-semibold">{r.name}</p>
              {renderStars(r.rating)}
              <p className="text-sm">{r.comment}</p>
            </div>
          ))}
        </div>

      </div>
      </div>

    </>
  );
}