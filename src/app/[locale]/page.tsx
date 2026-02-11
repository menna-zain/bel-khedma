"use client";

import { useSelector } from "react-redux";
import { GlobalState } from "@/redux/store";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Navbar from "@/components/Navbar";
import { FiUsers, FiLayers, FiCreditCard } from "react-icons/fi";
import { MdCardGiftcard } from "react-icons/md";
import Image from "next/image";
import aboutIllustration from "@/../public/imgs/volenteer.jpg.jpeg"; 

export default function Home() {
  const t = useTranslations("LandingPage");
  const locale = useLocale() as "en" | "ar";
  const token = useSelector((store: GlobalState) => store.user.token);

  const benefits = [
    {
      icon: <FiUsers className="text-emerald-500 text-4xl mb-4" />,
      title: t("benefits.item1_title"),
      description: t("benefits.item1_description"),
    },
    {
      icon: <MdCardGiftcard className="text-emerald-500 text-4xl mb-4" />,
      title: t("benefits.item2_title"),
      description: t("benefits.item2_description"),
    },
    {
      icon: <FiLayers className="text-emerald-500 text-4xl mb-4" />,
      title: t("benefits.item3_title"),
      description: t("benefits.item3_description"),
    },
    {
      icon: <FiCreditCard className="text-emerald-500 text-4xl mb-4" />,
      title: t("benefits.item4_title"),
      description: t("benefits.item4_description"),
    },
  ];

  return (
    <>
      <Navbar locale={locale} />

      {/* Hero */}
      <main
        className="relative flex flex-col items-center justify-center min-h-screen p-4 bg-cover bg-center"
        style={{ backgroundImage: `url('/imgs/background3.jpg')` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-6xl font-bold mb-4">{t("title")}</h1>
          <p className="text-2xl mb-6">{t("description")}</p>
          <button className="px-6 py-2 bg-emerald-600 rounded hover:bg-emerald-700 transition">
            {t("btn")}
          </button>
        </div>
      </main>

      {/* About */}

      <section className="py-16 px-6 md:px-20 bg-gray-50 dark:bg-gray-900 ">

<div className=" flex flex-col md:flex-row items-center gap-10 p-8 my-16 shadow-xl rounded-2xl border border-emerald-600">
        <div className="md:w-1/2 flex justify-start ">
          <div className="relative w-60 h-60 md:w-96 md:h-96 rounded-lg shadow-2xl overflow-hidden">
            <Image
              src={aboutIllustration}
              alt={t("about.title")}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 text-end">
            {t("about.title")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed text-end">
            {t("about.description")}
          </p>
        </div>
</div>
      </section>

      {/* Benefits */}
      <section className="py-24  md:px-20 bg-white dark:bg-gray-900">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-16 text-center">
          {t("benefits.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-24">
          {benefits.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition"
            >
              {item.icon}
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Join Us */}
      <section
        className={`py-16 px-6 md:px-20 bg-emerald-600 text-white flex flex-col items-center text-center ${
          locale === "ar" ? "rtl" : "ltr"
        }`}
      >
        <div className="my-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("join.title")}
          </h2>
          <p className="text-lg md:text-xl mb-6 max-w-2xl">
            {t("join.description")}
          </p>
          <button className="px-6 py-3 bg-white text-emerald-600 font-semibold rounded hover:bg-gray-100 transition">
            {t("join.btn")}
          </button>
        </div>
      </section>
    </>
  );
}
