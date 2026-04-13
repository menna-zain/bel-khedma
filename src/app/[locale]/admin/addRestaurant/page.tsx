"use client";

import { useState } from "react";
import axios from "axios";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function AddRestaurant() {
  const router = useRouter();
  const locale = useLocale();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    stars: "",
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
        name: formData.name || "Test Restaurant",
        stars: Number(formData.stars) || 3,
        address: formData.address || "Madinah, Saudi Arabia",
        thumbnail:
          formData.thumbnail ||
          "https://images.unsplash.com/photo-1555992336-cbf7d0c0d6e2",
      };

      console.log("RESTAURANT PAYLOAD:");
      console.log(payload);

      const res = await axios.post(
        "https://bilkhidmah-api.vercel.app/api/v1/restaurants",
        payload
      );

      console.log("RESPONSE:");
      console.log(res.data);

      router.push(`/${locale}/admin/restaurants`);
    } catch (err: any) {
      console.log("ERROR:");
      console.log(err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6">
        <Header title="Add Restaurant" />

        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow space-y-4"
        >
          <input
            name="name"
            placeholder="Restaurant Name"
            onChange={handleChange}
            className="w-full border border-gray-300 focus:border-purple-700 outline-none p-3 rounded transition"
            required
          />

          <input
            name="stars"
            type="number"
            min="1"
            max="5"
            placeholder="Stars (1-5)"
            onChange={handleChange}
            className="w-full border border-gray-300 focus:border-purple-700 outline-none p-3 rounded transition"
            required
          />

          <input
            name="address"
            placeholder="Address"
            onChange={handleChange}
            className="w-full border border-gray-300 focus:border-purple-700 outline-none p-3 rounded transition"
          />

          <input
            name="thumbnail"
            placeholder="Thumbnail URL"
            onChange={handleChange}
            className="w-full border border-gray-300 focus:border-purple-700 outline-none p-3 rounded transition"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-900 hover:bg-purple-950 text-white py-3 rounded transition"
          >
            {loading ? "Saving..." : "Add Restaurant"}
          </button>
        </form>
      </div>
    </div>
  );
}