"use client";

import { useTranslations } from "next-intl";

export default function Header({ title }: { title: string }) {
  const t = useTranslations("dashboard");

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">{title}</h1>

      <div className="flex items-center gap-4">
        {/* <input
          placeholder={t("search")}
          className="border px-4 py-2 rounded-lg"
        /> */}

        <div className="flex gap-2">
          {/* <div className="w-8 h-8 bg-gray-200 rounded-full" />
          <div className="w-8 h-8 bg-gray-200 rounded-full" /> */}
        </div>
      </div>
    </div>
  );
}