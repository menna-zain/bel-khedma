"use client";

import { X, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

type Props = {
  title?: string;
  subtitle?: string;
  description?: string;
  address?: string;
  stars?: number;
  image?: string;
  onDelete?: () => void;

  type?: "restaurant" | "hotel" | "landmark";
};

export default function Card({
  title,
  subtitle,
  description,
  address,
  stars = 0,
  image,
  onDelete,
  type,
}: Props) {
  const locale = useLocale();
  const t = useTranslations("dashboard");

  const isRTL = locale === "ar";

  const renderStars = (rating: number) => {
    const starsArray = [];

    for (let i = 1; i <= 5; i++) {
      starsArray.push(
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
          }`}
        />
      );
    }

    return starsArray;
  };

  const showStars = type === "restaurant" || type === "hotel";

  return (
    <div className="relative border p-4 rounded-xl mb-4 hover:shadow-md transition">

      {/* Delete Button */}
      <button
        onClick={onDelete}
        className={`absolute top-2 group w-9 h-9 flex items-center justify-center rounded-full transition
          ${isRTL ? "left-2" : "right-2"}
        `}
      >
        <X className="w-5 h-5 text-gray-500 group-hover:text-red-500" />

        <span
          className={`absolute -bottom-7 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition
            ${isRTL ? "left-0" : "right-0"}
          `}
        >
          {t("delete")}
        </span>
      </button>

      <div className="flex gap-5">

        {/* Image */}
        {image && (
          <img
            src={image}
            className="w-44 h-44 object-cover rounded-lg"
          />
        )}

        <div className="flex flex-col justify-center">

          <h2 className="text-xl font-bold">{title}</h2>

          {/* Stars - only for restaurant & hotel */}
          {showStars && (
            <div className="flex gap-1 mt-1">
              {renderStars(stars)}
            </div>
          )}

          <p className="text-gray-600 mt-1">{subtitle}</p>

          <p className="text-sm text-gray-500">{description}</p>

          <p className="text-sm font-medium">{address}</p>
        </div>
      </div>
    </div>
  );
}