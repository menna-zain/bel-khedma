"use client";
import Navbar from "@/components/Navbar";
import { FiUsers, FiLayers, FiCreditCard } from "react-icons/fi";
import { MdCardGiftcard } from "react-icons/md";
import Image from "next/image";
import aboutIllustration from "@/../public/imgs/aboutPic.jpg";
import whyIllustration from "@/../public/imgs/why-us.jpg";
import { useLocale, useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("LandingPage");
  const locale = useLocale() as "en" | "ar";

  const isRTL = locale === "ar";

  const benefits = [
    {
      icon: <FiUsers className="text-emerald-700 text-4xl mb-4" />,
      title: t("benefits.item1_title"),
      description: t("benefits.item1_description"),
    },
    {
      icon: <MdCardGiftcard className="text-emerald-700 text-4xl mb-4" />,
      title: t("benefits.item2_title"),
      description: t("benefits.item2_description"),
    },
    {
      icon: <FiLayers className="text-emerald-700 text-4xl mb-4" />,
      title: t("benefits.item3_title"),
      description: t("benefits.item3_description"),
    },
    {
      icon: <FiCreditCard className="text-emerald-700 text-4xl mb-4" />,
      title: t("benefits.item4_title"),
      description: t("benefits.item4_description"),
    },
  ];

  return (
    <>
      <Navbar locale={locale} />

      {/* Hero */}
      <main
        className="relative flex flex-col items-center justify-center min-h-screen p-4 bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: `url('/imgs/bg.jpeg')` }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center text-white">
          <h1
            className="text-6xl font-bold mb-4 "
            style={{ fontFamily: "Cairo, sans-serif" }}
          >
            {t("title")}
          </h1>
          <p className="text-4xl mb-6">{t("description")}</p>
          <button className="px-6 py-2 text-xl bg-emerald-700 rounded hover:bg-emerald-800 transition">
            {t("btn")}
          </button>
        </div>
      </main>

      {/* About */}
      <section className="py-16 px-6 md:px-20 bg-gray-50 ">
        <div
          className={`flex flex-col md:items-center gap-10 p-8 
    ${isRTL ? "md:flex-row" : "md:flex-row-reverse"}`}
        >
          {/* imgs */}
          <div
            className={`md:w-1/2 flex 
      ${isRTL ? "justify-start" : "justify-end"}`}
          >
            <div className="relative w-60 h-60 md:w-96 md:h-96 rounded-lg shadow-2xl overflow-hidden">
              <Image
                src={aboutIllustration}
                alt={t("about.title")}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* text */}
          <div className="md:w-1/2 px-5">
            <h2
              className={`text-3xl md:text-4xl font-bold text-gray-900  mb-4
        ${isRTL ? "text-end" : "text-start"}`}
            >
              {t("about.title")}
            </h2>

            <p
              className={`text-gray-700  text-2xl leading-relaxed
        ${isRTL ? "text-end" : "text-start"}`}
            >
              {t("about.description")}
            </p>
          </div>
        </div>
      </section>

      {/* why us section */}
      <section className="py-16 px-6 md:px-20 bg-white ">
        <div
          className={`flex flex-col  gap-10 p-8 
    ${isRTL ? "md:flex-row" : "md:flex-row-reverse"}`}
        >
          {/* text  */}
          <div className={`md:w-1/2 
      ${isRTL ? "text-end" : "text-start"}
        `}>
            {benefits.map((item, index) => (
              <div
                key={index}
                className="flex flex-col   p-6 bg-gray-50  rounded-xl shadow hover:shadow-lg transition mb-10"
              >
                <div className={`  flex
                  ${isRTL ? "justify-end" : "justify-start"}
              `}> {item.icon}</div>
               
                <h3 className="text-xl font-semibold mb-2 text-gray-900 ">
                  {item.title}
                </h3>
                <p className="text-gray-700 ">{item.description}</p>
              </div>
            ))}
          </div>
          {/* ------------------ */}

          {/* img */}
          <div
            className={`md:w-1/2 
      ${isRTL ? "text-end" : "text-start"}
        `}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900  mb-5 ">
              {t("benefits.title")}
            </h2>
            <p className={`text-gray-700  text-2xl  mb-5`}>
              {t("benefits.description")}
            </p>
            {/* img */}
            
            <div
              className={`  flex
                  ${isRTL ? "justify-end" : "justify-start"}
              `}
            >
              <div className="w-60 md:w-xl relative rounded-md shadow-2xl overflow-hidden">
                <Image
                  src={whyIllustration}
                  alt={t("about.title")}
                  className={`w-full
                  `}
                />
              </div>
            </div>
          </div>
          {/* ------------- */}
        </div>
      </section>

      {/* Join Us */}
      <section
        className={`py-16 px-6 md:px-20 bg-emerald-700 text-white flex flex-col items-center text-center ${
          locale === "ar" ? "rtl" : "ltr"
        }`}
      >
        <div className="my-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {t("join.title")}
          </h2>
          <p className="text-lg md:text-xl mb-6 max-w-2xl">
            {t("join.description")}
          </p>
          <button className="px-6 py-3 bg-white text-emerald-600 font-semibold rounded hover:bg-gray-00 transition">
            {t("join.btn")}
          </button>
        </div>
      </section>
    </>
  );
}
