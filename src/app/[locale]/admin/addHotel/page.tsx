"use client";

import { useState } from "react";
import axios from "axios";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function AddHotelPage() {
  const router = useRouter();
  const locale = useLocale();

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

      // 🔥 اطبع البيانات قبل الإرسال
      console.log("PAYLOAD SENT TO BACKEND:");
      console.log(payload);

      const res = await axios.post(
        "https://bilkhidmah-api.vercel.app/api/v1/hotels",
        payload
      );

      console.log("✅ RESPONSE:");
      console.log(res.data);

      router.push(`/${locale}/admin/hotels`);
    } catch (err: any) {
      console.log(" ERROR:");
      console.log(err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6">
        <Header title="Add Hotel" />

        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow space-y-4"
        >
          <input
            name="name"
            placeholder="Hotel Name"
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />

          <input
            name="stars"
            type="number"
            min="1"
            max="5"
            placeholder="Stars (1-5)"
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />

          <input
            name="summary"
            placeholder="Short Summary"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            className="w-full border p-3 rounded h-28"
          />

          <input
            name="thumbnail"
            placeholder="Thumbnail URL"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <input
            name="address"
            placeholder="Address"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 text-white py-3 rounded"
          >
            {loading ? "Saving..." : "Add Hotel"}
          </button>
        </form>
      </div>
    </div>
  );
}