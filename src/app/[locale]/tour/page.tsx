"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ProfileNav from "@/components/ProfileNav";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

type Landmark = {
  id: string;
  name: string;
  address?: string;
  thumbnail?: string;
  description?: string;
  lat?: number;
  long?: number;
};

export default function LandmarksPage() {
  const locale = useLocale() as "en" | "ar";
  const t = useTranslations("user");
  const router = useRouter();

  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [loading, setLoading] = useState(true);

  // فلترة
  const [city, setCity] = useState("");

  // 📡 GET API
  const getLandmarks = async () => {
    try {
      const res = await axios.get(
        "https://bilkhidmah-api.vercel.app/api/v1/landmarks"
      );

      console.log(res)
      const data = res.data?.data;

      setLandmarks(Array.isArray(data) ? data : Object.values(data || {}));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLandmarks();
  }, []);

  // فلترة
  const filteredLandmarks = landmarks.filter((place) => {
    return (
      !city ||
      place.address?.toLowerCase().includes(city.toLowerCase())
    );
  });

  return (
    <>
      <ProfileNav locale={locale} />

      <div
        className="p-4 space-y-4 mb-5"
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        {/* الفلتر */}
        {/* <div className="flex justify-center">
          <input
            type="text"
            placeholder={t("city")}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border border-emerald-200 rounded-md p-2 w-40 outline-none"
          />
        </div> */}

        {/* الأماكن */}
        <div className="flex flex-col items-center gap-4">
          {loading ? (
            <p>{t("loading")}</p>
          ) : filteredLandmarks.length > 0 ? (
            filteredLandmarks.map((place) => (
              <div
                key={place.id}
                onClick={() => router.push(`/landmarks/${place.id}`)}
                className="w-full md:w-1/2 border border-emerald-200 rounded-md p-3 shadow-sm hover:shadow-md transition cursor-pointer"
              >
                <div className="flex gap-5">
                  <div>
                    <img
                      src={place.thumbnail}
                      alt={place.name}
                      className="w-60 h-60 object-cover rounded-md mb-2"
                    />
                  </div>

                  <div className="flex flex-col justify-center gap-1">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {place.name}
                    </h2>

                    <p className="text-lg text-gray-500">
                      {place.address}
                    </p>

                    <p className="text-lg text-gray-600 mt-1">
                      {place.description}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-lg">
              {t("noLandmarksYet")}
            </p>
          )}
        </div>
      </div>
    </>
  );
}