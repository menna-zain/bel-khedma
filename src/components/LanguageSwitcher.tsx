"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { FiCheck, FiGlobe } from "react-icons/fi";
import { RiArrowDropDownLine } from "react-icons/ri";


export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const changeLanguage = (newLocale: "en" | "ar") => {
    let pathWithoutLocale = pathname.replace(/^\/(en|ar)/, "");
    if (!pathWithoutLocale) pathWithoutLocale = "/";

    router.push(`/${newLocale}${pathWithoutLocale}`);
    setOpen(false);
  };

  return (
    <div className="relative ">
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-200 transition"
      >
        <FiGlobe size={18} />
        <span className="">
          {locale === "en" ? "Language" : "اللغة"}
        </span>
        <RiArrowDropDownLine size={30}  />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute mt-2 w-28 bg-white shadow-lg rounded-xl border border-gray-300 z-50 p-2">
          <button
            onClick={() => changeLanguage("en")}
            className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 transition text-sm"
          >
            English
            {locale === "en" && <FiCheck size={16} />}
          </button>

          <button
            onClick={() => changeLanguage("ar")}
            className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 transition text-sm"
          >
            عربي
            {locale === "ar" && <FiCheck size={16} />}
          </button>
        </div>
      )}
    </div>
  );
}


