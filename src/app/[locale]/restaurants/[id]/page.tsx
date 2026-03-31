"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import ProfileNav from "@/components/ProfileNav";
import { Star } from "lucide-react";
import { useLocale } from "next-intl";

type Review = {
  name: string;
  comment: string;
  rating: number;
};

const restaurants = [
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
];

export default function RestaurantDetails() {
  const { id } = useParams();
  const locale = useLocale() as "en" | "ar";

  const restaurant = restaurants.find((r) => r.id === Number(id));
  const [reviews, setReviews] = useState<Review[]>([
    { name: "Ali", comment: "Excellent food!", rating: 5 },
    { name: "Sara", comment: "Good, but pricey", rating: 4 },
  ]);

  const [comment, setComment] = useState("");
  const [rate, setRate] = useState(5);

  if (!restaurant) return <p>Restaurant not found</p>;

  const renderStars = (rating: number) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
        />
      ))}
    </div>
  );

  const addReview = () => {
    if (!comment) return;
    setReviews([...reviews, { name: "User", comment, rating: rate }]);
    setComment("");
  };

  return (
    <>
      <ProfileNav locale={locale} />
<div className="flex justify-center"> 
      <div className="p-4 space-y-4 rtl w-1/2">
        <img
          src={restaurant.image}
          className="w-full object-cover rounded-md"
        />

        <h1 className="text-xl font-bold">{restaurant.name}</h1>
        <p className="text-gray-600">{restaurant.description}</p>
        {renderStars(Math.floor(restaurant.rating))}
        <p className="text-emerald-700 font-bold">{restaurant.price}</p>

        <button className="bg-emerald-700 text-white px-4 py-2 rounded w-full">
          Book Table
        </button>

        {/* Add review */}
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

        {/* Reviews */}
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