"use client";

import { useState } from "react";
import axios from "axios";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

export default function AddHotelPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("dashboard");

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    stars: "",
    summary: "",
    description: "",
    address: "",
    thumbnail: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
        name: formData.name || "Test Hotel",
        stars: Number(formData.stars) || 3,
        summary: formData.summary || "Test summary",
        description: formData.description || "Test description",
        address: formData.address || "Madinah, Saudi Arabia",
        thumbnail:
          formData.thumbnail ||
          "https://picsum.photos/seed/test/400/300",
      };

      await axios.post(
        "https://bilkhidmah-api.vercel.app/api/v1/hotels",
        payload
      );

      router.push(`/${locale}/admin/hotels`);
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

      <div className="flex-1 p-6">
        <Header title={t("addHotel")} />

        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow space-y-4"
        >
          <input
            name="name"
            placeholder={t("hotelName")}
            onChange={handleChange}
            className="w-full border border-gray-300 focus:border-purple-700 outline-none p-3 rounded transition text-start"
            required
          />

          <input
            name="stars"
            type="number"
            min="1"
            max="5"
            placeholder={t("stars")}
            onChange={handleChange}
            className="w-full border border-gray-300 focus:border-purple-700 outline-none p-3 rounded transition text-start"
            required
          />

          <input
            name="summary"
            placeholder={t("summary")}
            onChange={handleChange}
            className="w-full border border-gray-300 focus:border-purple-700 outline-none p-3 rounded transition text-start"
          />

          <textarea
            name="description"
            placeholder={t("description")}
            onChange={handleChange}
            className="w-full border border-gray-300 focus:border-purple-700 outline-none p-3 rounded h-28 transition text-start"
          />

          <input
            name="thumbnail"
            placeholder={t("thumbnail")}
            onChange={handleChange}
            className="w-full border border-gray-300 focus:border-purple-700 outline-none p-3 rounded transition text-start"
          />

          <input
            name="address"
            placeholder={t("address")}
            onChange={handleChange}
            className="w-full border border-gray-300 focus:border-purple-700 outline-none p-3 rounded transition text-start"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3 rounded transition"
          >
            {loading ? t("saving") : t("addHotel")}
          </button>
        </form>
      </div>
    </div>
  );
}