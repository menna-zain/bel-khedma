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
    city: "",
    price: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // handle text inputs
  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // handle image
  const handleImageChange = (e: any) => {
    const file = e.target.files[0];

    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // remove image
  const handleRemoveImage = () => {
    setImageFile(null);
    setPreview(null);
  };

  // submit
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("city", formData.city);
      data.append("price", formData.price);

      if (imageFile) {
        data.append("images", imageFile);
      }

     const res = await axios.post(
        "https://bilkhidmah-api.vercel.app/api/v1/hotels",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
 

      console.log( "result",res)
      router.push(`/${locale}/admin/hotels`);
    } catch (err) {
      console.log(err);
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
          className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow space-y-4"
        >
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Hotel Name"
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />

          {/* City */}
          <input
            type="text"
            name="city"
            placeholder="City"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          {/* Price */}
          <input
            type="number"
            name="price"
            placeholder="Price"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          {/* Image Upload + Preview */}
          <div className="space-y-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border p-3 rounded"
            />

            {preview && (
              <div className="relative w-full h-60">
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover rounded-lg border"
                />

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 text-white py-3 rounded"
          >
            {loading ? "Uploading..." : "Add Hotel"}
          </button>
        </form>
      </div>
    </div>
  );
}