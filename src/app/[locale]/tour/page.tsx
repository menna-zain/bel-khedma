"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ProfileNav from "@/components/ProfileNav";
import { useLocale, useTranslations } from "next-intl";


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
  const t = useTranslations("landmarks");

  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [loading, setLoading] = useState(true);

  // البيانات المرسلة
  const [selectedLandmarks, setSelectedLandmarks] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");

  const [location, setLocation] = useState("");

  const [loadingSubmit, setLoadingSubmit] = useState(false);



  // اختيار المكان
  const toggleSelect = (name: string) => {
    setSelectedLandmarks((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name],
    );
  };


  // 📡 GET API
  const getLandmarks = async () => {
    try {
      const res = await axios.get(
        "https://bilkhidmah-api.vercel.app/api/v1/landmarks",
      );

      console.log(res);
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

  // تحديد مكان الالتقاء
  const getCoordinates = async (address: string) => {
    try {
      const res = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: address,
            format: "json",
            limit: 1,
          },
          headers: {
            "Accept-Language": "en",
          }
        },
      );

      console.log("location",res)
      if (!res.data.length) return null;

      return {
        lat: Number(res.data[0].lat),
        lng: Number(res.data[0].lon),
      };
    } catch (err) {
      console.log(err);
      return null;
    }
  };

 

  // ارسال بيانات الرحلة
  const handleSubmit = async () => {
    if (
      !date ||
      !startAt ||
      !endAt ||
      selectedLandmarks.length === 0 ||
      !location
    ) {
      alert(t("success"));
      return;
    }
const coords = await getCoordinates(location);

       console.log(date);
      console.log(startAt);
      console.log(endAt);
      console.log(selectedLandmarks);
      console.log(location);

    try {
      setLoadingSubmit(true);

      const coords = await getCoordinates(location);

      if (!coords) {
        alert("Invalid location");
        return;
      }
      const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found");
          setLoading(false);
          return;
        }
      

      const res = await axios.post("https://bilkhidmah-api.vercel.app/api/v1/tours", {
        MLat: coords.lat,
        MLong: coords.lng,
        MTime: date,
        startAt,
        endAt,
        landmarks: selectedLandmarks,
      },{
            headers: { Authorization: `Bearer ${token}` },
          },);

          console.log("res of create tour:",res)
      alert("Tour created successfully ✅");

      setSelectedLandmarks([]);
      setDate("");
      setStartAt("");
      setEndAt("");
      setLocation("");
    } catch (err) {
      console.log(err);
      alert("Error creating tour ");
    } finally {
      setLoadingSubmit(false);
    }
  };
  return (
    <>
      <ProfileNav locale={locale} />

      {/* form  */}
      <div className="mt-10 px-4" dir={locale === "ar" ? "rtl" : "ltr"}>
        <div className="max-w-5xl  p-6 flex flex-col gap-6 ">
          {/* Title */}
          <h2 className="text-2xl font-bold text-emerald-800">
            {t("title")}
          </h2>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Date */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600 font-bold">{t("date")}</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 p-2 rounded-xl outline-none"
              />
            </div>

            {/* Start Time */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600 font-bold">{t("startTime")}</label>
              <input
                type="time"
                lang="en-GB"
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
                className="border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 p-2 rounded-xl outline-none"
              />
            </div>

            {/* End Time */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600 font-bold">{t("endTime")}</label>
              <input
                type="time"
                lang="en-GB"
                value={endAt}
                onChange={(e) => setEndAt(e.target.value)}
                className="border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 p-2 rounded-xl outline-none"
              />
            </div>

            {/* Location */}
            <div className="flex flex-col gap-1">
              <input
                type="text"
                placeholder={t("location")}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 p-2 rounded-xl outline-none"
              />
            </div>

            {/* Selected Count */}
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-bold">{t("selected")}:</span>
              <span className="text-xl font-bold text-emerald-600">
                {selectedLandmarks.length}
              </span>
            </div>

            {/* Button */}
          <button
            onClick={handleSubmit}
            disabled={loadingSubmit}
            className="w-full bg-emerald-600 hover:bg-emerald-700 transition text-white p-2 rounded-xl font-semibold text-lg"
          >
            {loadingSubmit ? t("creating") : t("create")}
          </button>
          </div>

          {/* Selected Chips */}
          {selectedLandmarks.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedLandmarks.map((item) => (
                <span
                  key={item}
                  className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          )}

          
        </div>
      </div>

      {/* ------------------------------- */}

      <div className="p-4 mb-5" dir={locale === "ar" ? "rtl" : "ltr"}>
        {/* الأماكن */}
        <h2 className="text-2xl font-bold text-emerald-800 ms-5 mb-5">
          {t("choosePlaces")}
          </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            <p>{t("loading")}</p>
          ) : landmarks.length > 0 ? (
            landmarks.map((place) => (
              <div
                key={place.id}
                onClick={() => toggleSelect(place.name)}
                className={`border border-emerald-200 p-3 cursor-pointer rounded-2xl shadow-md transition duration-300 flex flex-col h-full
    ${
      selectedLandmarks.includes(place.name)
        ? "bg-emerald-100 border-emerald-500"
        : "bg-white hover:shadow-xl"
    }
  `}
              >
                <div className="flex flex-col gap-5">
                  <div>
                    <img
                      src={place.thumbnail}
                      alt={place.name}
                      className="  rounded-md mb-2 w-full h-48 object-cover "
                    />
                  </div>

                  <div className="flex flex-col justify-center gap-1">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {place.name}
                    </h2>

                    <p className="text-lg text-gray-500">{place.address}</p>

                    <p className="text-lg text-gray-600 mt-1">
                      {place.description}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-lg">{t("noLandmarksYet")}</p>
          )}
        </div>
      </div>
    </>
  );
}
