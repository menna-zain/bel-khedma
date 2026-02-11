"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslations, useLocale } from "next-intl";

type FormValues = {
  email: string;
  password: string;
};

export default function Login() {
  const t = useTranslations("loginPage");
  const locale = useLocale(); // ar | en
  const router = useRouter();
  const pathname = usePathname();

  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const direction = locale === "ar" ? "rtl" : "ltr";

  const initialValues: FormValues = {
    email: "",
    password: "",
  };

  // 🔁 Language Switch
  const changeLanguage = () => {
    const newLocale = locale === "ar" ? "en" : "ar";
    const newPath = pathname.replace(`/${locale}`, "");
    router.push(`/${newLocale}${newPath}`);
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setErrMsg("");

    try {
      const res = await axios.post(
        "",
        values,
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.data.user.name);

      router.push(`/${locale}`);
    } catch (err: any) {
      const apiErrors = err.response?.data?.errors;

      if (apiErrors && apiErrors.length > 0) {
        setErrMsg(apiErrors[0].msg);
      } else {
        setErrMsg(err.response?.data?.status || "Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string().email(t("emailInvalid")).required(t("emailRequired")),
    password: Yup.string()
  .required(t("passwordRequired"))
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{10,15}$/,
    t("passwordPattern")
  ),

  });

  const { handleSubmit, handleChange, handleBlur, touched, values, errors } =
    useFormik<FormValues>({
      initialValues,
      onSubmit,
      validationSchema,
    });

  return (
    <div
      dir={direction}
      className="flex items-center justify-center min-h-screen bg-emerald-50"
    >
      <div className="flex flex-col justify-center w-full sm:w-3/4 md:w-1/2 lg:w-1/3 p-8 bg-white shadow-xl rounded-2xl border border-emerald-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-emerald-800">
          {t("title")}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="flex items-center border border-emerald-200 rounded-md p-3 focus-within:border-emerald-600">
            <MdEmail
              className={`${
                direction === "rtl" ? "ml-2" : "mr-2"
              } text-emerald-600`}
            />
            <input
              type="email"
              name="email"
              placeholder={t("email")}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              className="w-full outline-none bg-transparent text-gray-700"
            />
          </div>
          {touched.email && errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}

          {/* Password */}
          <div className="flex items-center border border-emerald-200 rounded-md p-3 focus-within:border-emerald-600">
            <FaLock
              className={`${
                direction === "rtl" ? "ml-2" : "mr-2"
              } text-emerald-600`}
            />
            <input
              type="password"
              name="password"
              placeholder={t("password")}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              className="w-full outline-none bg-transparent text-gray-700"
            />
          </div>
          {touched.password && errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}

          {/* Forgot password */}
          <div
            className={`${direction === "rtl" ? "text-left" : "text-right"} text-sm`}
          >
            <a className="text-emerald-700 hover:underline cursor-pointer">
              {t("forgotPassword")}
            </a>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition font-medium shadow-md"
          >
            {isLoading ? "Loading..." : t("login")}
          </button>

          {errMsg && (
            <p className="text-red-600 text-sm text-center mt-2">{errMsg}</p>
          )}
        </form>

        {/* Register link */}
        <p className="mt-6 text-center text-gray-600">
          {t("noAccount")}{" "}
          <span
            onClick={() => router.push(`/${locale}/register`)}
            className="text-yellow-600 font-semibold cursor-pointer hover:underline"
          >
            {t("register")}
          </span>
        </p>

        {/* Language Switch Button */}
        <div
          className={`mt-4 flex ${direction === "rtl" ? "justify-end" : "justify-end"}`}
        >
          <button
            type="button"
            onClick={changeLanguage}
            className="text-sm text-emerald-700 hover:text-emerald-900 underline underline-offset-4 transition"
          >
            {locale === "ar" ? "For English" : "للعربية"}
          </button>
        </div>
      </div>
    </div>
  );
}
