"use client";

import { useRouter, usePathname } from "next/navigation";

type LanguageSwitcherProps = {
  locale: "en" | "ar";
};

export default function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const newLocale = locale === "en" ? "ar" : "en";

    // لو المسار يبدأ بدون لغة (مثلاً /landing) نعتبره عربي افتراضي
    let pathWithoutLocale = pathname.replace(/^\/(en|ar)/, "");
    if (!pathWithoutLocale) pathWithoutLocale = "/";

    // نضيف اللغة الجديدة في البداية
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1 rounded bg-gray-600 hover:bg-gray-800 transition"
    >
      {locale === "en" ? "عربي" : "English"}
    </button>
  );
}








// "use client";

// import { useRouter, usePathname } from "next/navigation";

// type LanguageSwitcherProps = {
//   locale: "en" | "ar";
// };

// export default function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
//   const router = useRouter();
//   const pathname = usePathname(); // المسار الحالي بدون الـ locale

//   const toggleLanguage = () => {
//     const newLocale = locale === "en" ? "ar" : "en";

//     // نعيد توجيه للصفحة نفسها مع الـ locale الجديد
//     router.push(`/${newLocale}${pathname}`);
//   };

//   return (
//     <button
//       onClick={toggleLanguage}
//       className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 transition"
//     >
//       {locale === "en" ? "عربي" : "English"}
//     </button>
//   );
// }





















// 'use client';

// import Link from 'next/link';
// import {usePathname} from 'next/navigation';

// type LanguageSwitcherProps = {
//   locale: 'en' | 'ar';
// };

// export default function LanguageSwitcher({locale}: LanguageSwitcherProps) {
//   const pathname = usePathname();

//   const newLocale: 'en' | 'ar' = locale === 'ar' ? 'en' : 'ar';

//   const newPath = `/${newLocale}${pathname.slice(3)}`;

//   return (
//     <Link href={newPath}>
//       {newLocale === 'ar' ? 'عربي' : 'English'}
//     </Link>
//   );
// }
