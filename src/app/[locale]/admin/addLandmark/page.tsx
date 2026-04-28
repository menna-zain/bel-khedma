"use client";

import { useState } from "react";
import axios from "axios";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

export default function AddLandmarkPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("dashboard");

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    lat: "",
    long: "",
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
        name: formData.name || "Pyramids",
        lat: Number(formData.lat) || 29.9792,
        long: Number(formData.long) || 31.1342,
        address: formData.address || "Giza, Egypt",
        thumbnail:
          formData.thumbnail ||
          "https://picsum.photos/seed/pyramids/400/300",
      };

      const token = localStorage.getItem("token");
     const res = await axios.post(
        "https://bilkhidmah-api.vercel.app/api/v1/landmarks",
        payload,
        {
    headers: {
      Authorization: `Bearer ${token}`,
    },
}
      );

      console.log(res);

      router.push(`/${locale}/admin/landmarks`);
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
        <Header title={t("addLandmark")} />

        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow space-y-4"
        >
          <input
            name="name"
            placeholder={t("landmarkName")}
            onChange={handleChange}
            className="w-full border border-gray-300 focus:border-emerald-700 outline-none p-3 rounded transition text-start"
            required
          />

          <input
            name="lat"
            type="text"
            step="any"
            placeholder="Latitude"
            onChange={handleChange}
            className="w-full border border-gray-300 focus:border-emerald-700 outline-none p-3 rounded transition text-start"
            required
          />

          <input
            name="long"
            type="text"
            step="any"
            placeholder="Longitude"
            onChange={handleChange}
            className="w-full border border-gray-300 focus:border-emerald-700 outline-none p-3 rounded transition text-start"
            required
          />

          <input
            name="address"
            placeholder={t("address")}
            onChange={handleChange}
            className="w-full border border-gray-300 focus:border-emerald-700 outline-none p-3 rounded transition text-start"
            required
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
            className="w-full bg-emerald-700 text-white py-3 rounded"
          >
            {loading ? t("saving") : t("addLandmark")}
          </button>
        </form>
      </div>
    </div>
  );
}