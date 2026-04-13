"use client";

import { useState } from "react";
import axios from "axios";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

export default function AddRestaurant() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("dashboard");

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    stars: "",
    address: "",
    thumbnail: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name || "Test Restaurant",
        stars: Number(formData.stars) || 3,
        address: formData.address || "Madinah, Saudi Arabia",
        thumbnail:
          formData.thumbnail ||
          "https://images.unsplash.com/photo-1555992336-cbf7d0c0d6e2",
      };

      await axios.post(
        "https://bilkhidmah-api.vercel.app/api/v1/restaurants",
        payload
      );

      router.push(`/${locale}/admin/restaurants`);
    } catch (err: any) {
      console.log(err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <Sidebar />

      {/* Center Container */}
      <div className="flex-1 flex flex-col p-6">
        <Header title={t("addRestaurant")} />

        <div className="flex flex-1 items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl bg-white p-6 rounded-xl shadow space-y-4"
          >
            <input
              name="name"
              placeholder={t("restaurantName")}
              onChange={handleChange}
              className="w-full border border-gray-300 focus:border-emerald-700 outline-none p-3 rounded transition text-start"
              required
            />

            <input
              name="stars"
              type="number"
              min="1"
              max="5"
              placeholder={t("stars")}
              onChange={handleChange}
              className="w-full border border-gray-300 focus:border-emerald-700 outline-none p-3 rounded transition text-start"
              required
            />

            <input
              name="address"
              placeholder={t("address")}
              onChange={handleChange}
              className="w-full border border-gray-300 focus:border-emerald-700 outline-none p-3 rounded transition text-start"
            />

            <input
              name="thumbnail"
              placeholder={t("thumbnail")}
              onChange={handleChange}
              className="w-full border border-gray-300 focus:border-emerald-700 outline-none p-3 rounded transition text-start"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3 rounded transition"
            >
              {loading ? t("saving") : t("addRestaurant")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}