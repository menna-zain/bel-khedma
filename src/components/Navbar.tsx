"use client";

import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations } from "next-intl";
import { FaHandsHelping } from "react-icons/fa";

type NavbarProps = {
  locale: "en" | "ar";
};

export default function Navbar({ locale }: NavbarProps) {
  const t = useTranslations("Navbar");

  // تحديد اتجاه النصوص تلقائي حسب اللغة
  const direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <nav
      className={`flex items-center justify-between p-4 bg-gray-100 border-b border-gray-300`}
      dir={direction}
    >
      {/* اللوجو واسم الخدمة */}
      <div className="flex items-center gap-2">
        {/* <img src="/logo.png" alt="Logo" className="w-10 h-10" /> */}
        <FaHandsHelping size={30} 
        className="text-emerald-600"/>
        <span className="font-bold text-2xl text-black">{t("serviceName")}</span>
      </div>

      {/* أزرار اللغة وتسجيل الدخول */}
      <div className="flex items-center gap-4">
        <LanguageSwitcher locale={locale} />
        <Link href="/login">
          <button className="px-4 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition">
            {t("login")}
          </button>
        </Link>
      </div>
    </nav>
  );
}















// import LanguageSwitcher from './LanguageSwitcher';

// type NavbarProps = {
//   locale: 'en' | 'ar';
// };

// export default function Navbar({locale}: NavbarProps) {
//   return (
//     <nav className="flex items-center justify-between p-4">
//       {/* باقي عناصر الناف بار */}
//       <LanguageSwitcher locale={locale} />
//     </nav>
//   );
// }
//   // components/Navbar.tsx
// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { useLocale, useTranslations } from "next-intl";
// import { useRouter } from "next/navigation";

// const Navbar = () => {
//   const t = useTranslations(); // للحصول على النصوص حسب اللغة
//   const locale = useLocale();  // اللغة الحالية
//   const router = useRouter();

//   // لتغيير اللغة
//   const toggleLanguage = () => {
//     const newLocale = locale === "en" ? "ar" : "en";
//     router.push(router.pathname, { locale: newLocale });
//   };

//   return (
//     <nav style={styles.navbar}>
//       {/* اللوجو واسم الخدمة */}
//       <div style={styles.logoContainer}>
//         <img
//           src="/logo.png"
//           alt="Logo"
//           style={styles.logo}
//         />
//         <span style={styles.serviceName}>{t("serviceName")}</span>
//       </div>

//       {/* أزرار اللغة وتسجيل الدخول */}
//       <div style={styles.buttonsContainer}>
//         <button onClick={toggleLanguage} style={styles.button}>
//           {t("language")}
//         </button>
//         <Link href="/login">
//           <button style={styles.button}>{t("login")}</button>
//         </Link>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

// const styles: { [key: string]: React.CSSProperties } = {
//   navbar: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "0.5rem 2rem",
//     backgroundColor: "#f8f8f8",
//     borderBottom: "1px solid #ddd",
//   },
//   logoContainer: {
//     display: "flex",
//     alignItems: "center",
//     gap: "0.5rem",
//   },
//   logo: {
//     width: "40px",
//     height: "40px",
//   },
//   serviceName: {
//     fontWeight: "bold",
//     fontSize: "1.2rem",
//   },
//   buttonsContainer: {
//     display: "flex",
//     gap: "1rem",
//   },
//   button: {
//     padding: "0.4rem 0.8rem",
//     border: "none",
//     borderRadius: "4px",
//     cursor: "pointer",
//     backgroundColor: "#0070f3",
//     color: "#fff",
//   },
// };
