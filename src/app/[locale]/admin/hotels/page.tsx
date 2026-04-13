"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Card from "@/components/Card";

import { useTranslations } from "next-intl";

type Hotel = {
  id: string;
  name: string;
  stars?: number;
  summary?: string;
  description?: string;
  address?: string;
  thumbnail?: string;
};

export default function HotelsPage() {
  const t = useTranslations("dashboard");

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  const getHotels = async () => {
    try {
      const res = await axios.get(
        "https://bilkhidmah-api.vercel.app/api/v1/hotels"
      );

      console.log("hotels response:", res.data);

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

  const deleteHotel = async (id: string) => {
    try {
      await axios.delete(
        `https://bilkhidmah-api.vercel.app/api/v1/hotels/${id}`
      );

      setHotels((prev) => prev.filter((hotel) => hotel.id !== id));
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
        ) : (
          hotels.map((hotel) => (
            <Card
              key={hotel.id}
              title={hotel.name}
              subtitle={hotel.summary}
              description={hotel.description}
              address={hotel.address}
              stars={hotel.stars}
              image={hotel.thumbnail}
              onDelete={() => deleteHotel(hotel.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}