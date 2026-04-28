"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Card from "@/components/Card";

import { useTranslations, useLocale } from "next-intl";

type Landmark = {
  id: string;
  name: string;
  address?: string;
  thumbnail?: string;
};

export default function LandmarksPage() {
  const t = useTranslations("dashboard");
  const locale = useLocale();

  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [loading, setLoading] = useState(true);

  const getLandmarks = async () => {
    try {
      const res = await axios.get(
        "https://bilkhidmah-api.vercel.app/api/v1/landmarks"
      );

      const landmarksData = res.data?.data;
      console.log(landmarksData)

      if (Array.isArray(landmarksData)) {
        setLandmarks(landmarksData);
      } else {
        setLandmarks(Object.values(landmarksData || {}));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteLandmark = async (name: string) => {

    const token = localStorage.getItem("token");
    try {
     const res = await axios.delete(
        `https://bilkhidmah-api.vercel.app/api/v1/landmarks/${encodeURIComponent(name)}`,
        {
    headers: {
      Authorization: `Bearer ${token}`,
    },
}
      );

      console.log("delete res ",res)
      setLandmarks((prev) =>
        prev.filter((landmark) => landmark.name !== name)
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getLandmarks();
  }, []);

  return (
    <div className="flex min-h-screen" dir={locale === "ar" ? "rtl" : "ltr"}>
      <Sidebar />

      <div className="flex-1 p-6 flex flex-col">
        <Header title={t("land")} />

        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-lg">{t("loading")}</p>
          </div>
        ) : landmarks.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-2xl md:text-3xl font-bold text-gray-500 text-center">
              {t("noLandmarksYet")}
            </p>
          </div>
        ) : (
          landmarks.map((landmark) => (
            <Card
              key={landmark.id}
              title={landmark.name}
              address={landmark.address}
              image={landmark.thumbnail}
              type="landmark"
              onDelete={() => deleteLandmark(landmark.name)}
            />
          ))
        )}
      </div>
    </div>
  );
}