"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Card from "@/components/Card";

import { useTranslations } from "next-intl";

type Hotel = {
  _id: string;
  name: string;
  city?: string;
  price?: number;
  images?: string[];
};

export default function HotelsPage() {
  const t = useTranslations("dashboard");

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  //  GET ALL HOTELS
  const getHotels = async () => {
  try {
    const res = await axios.get(
      "https://bilkhidmah-api.vercel.app/api/v1/hotels"
    );

    const hotelsData = res.data?.data?.hotels;

    if (Array.isArray(hotelsData)) {
      setHotels(hotelsData);
    } else {
      setHotels(Object.values(hotelsData || {}));
    }
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

  //  DELETE HOTEL
  const deleteHotel = async (id: string) => {
    try {
      await axios.delete(
        `https://bilkhidmah-api.vercel.app/api/v1/hotels/${id}`
      );

      // تحديث الليست بعد الحذف
      setHotels((prev) => prev.filter((hotel) => hotel._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getHotels();
  }, []);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6">
        <Header title={t("hotels")} />

        {loading ? (
          <p>Loading...</p>
        ) : hotels.length === 0 ? (
          <p>No Hotels Found</p>
        ) 
        : (
          hotels.map((hotel) => (
            <Card
              key={hotel._id}
              title={hotel.name}
              subtitle={hotel.city}
              price={hotel.price}
              image={hotel.images?.[0]}
              onDelete={() => deleteHotel(hotel._id)}
            />
          ))
        )
        }
      </div>
    </div>
  );
}