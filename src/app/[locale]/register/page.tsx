"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaUser, FaLock, FaHandsHelping } from "react-icons/fa";
import { ImAddressBook } from "react-icons/im";

import { RiCommunityFill } from "react-icons/ri";
import { GiCrossroad } from "react-icons/gi";
import { MdEmail } from "react-icons/md";
import { BiSolidCity } from "react-icons/bi";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslations, useLocale } from "next-intl";

type FormValues = {
  email: string;
  password: string;
  role: string;
  FName: string;
  LName: string;
  UStreet: string;
  UUnitNum: string;
  UCity: string;
  USAdd: string;
  language: string;
};

export default function Register() {
  const t = useTranslations("registerPage");
  const locale = useLocale(); // ar | en
  const router = useRouter();
  const pathname = usePathname();

  const direction = locale === "ar" ? "rtl" : "ltr";

  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const initialValues: FormValues = {
    email: "",
    password: "",
    role: "customer",
    FName: "",
    LName: "",
    language: "",
    UStreet: "",
    UUnitNum: "",
    UCity: "",
    USAdd: "",
  };

  //  Language Switch
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
        "https://bilkhidmah-api.vercel.app/api/v1/auth/signup",
        values,
      );
      router.push(`/${locale}/login`);
    } catch (err: any) {
      const apiErrors = err.response?.data?.errors;

      if (apiErrors && apiErrors.length > 0) {
        setErrMsg(apiErrors[0].msg);
      } else {
        setErrMsg(err.response?.data?.message || t("somethingWentWrong"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validationSchema = Yup.object({
    FName: Yup.string()
      .required(t("nameRequired"))
      .min(3, t("nameMin"))
      .max(40, t("nameMax")),

    LName: Yup.string()
      .required(t("nameRequired"))
      .min(3, t("nameMin"))
      .max(40, t("nameMax")),

    email: Yup.string().email(t("emailInvalid")).required(t("emailRequired")),

    password: Yup.string()
      .required(t("passwordRequired"))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{10,15}$/,
        t("passwordPattern"),
      ),
  });

  const { handleSubmit, handleChange, handleBlur, touched, values, errors } =
    useFormik<FormValues>({
      initialValues,
      onSubmit,
      validationSchema,
    });

  return (
    <>
      <nav
        className={`flex items-center justify-between p-4 bg-white border-b border-gray-300 sticky top-0 left-0 w-full  shadow-md z-50`}
        dir={direction}
      >
        {/* اللوجو واسم الخدمة */}
        <div className="flex items-center gap-2">
          <FaHandsHelping size={30} className="text-emerald-700" />
          <span className="font-bold text-2xl text-black">
            {t("serviceName")}
          </span>
        </div>
      </nav>
      <div
        dir={direction}
        className="flex items-center justify-center min-h-screen bg-emerald-50 p-4 "
      >
        <div className="flex flex-col w-full mt-8 sm:w-3/4 md:w-3/4 lg:w-2/3 p-8 bg-white shadow-xl rounded-2xl border border-emerald-100">
          <h2 className="text-3xl font-bold  text-emerald-800">{t("title")}</h2>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Container for Personal + Address Details */}
            <div className="flex flex-col md:flex-row gap-2 p-3 mt-2">
              {/* ---------------- Personal Details ---------------- */}
              <div className="flex-1 flex flex-col w-1/2 gap-2 p-3 ">
                <h3 className="text-xl font-semibold mb-1 text-emerald-800">
                  {t("personaltyDetails")}
                </h3>

                {/* FName */}

                <div className="flex items-center border border-emerald-200 rounded-md p-3 focus-within:border-emerald-700">
                  <FaUser
                    className={`${direction === "rtl" ? "ml-2" : "mr-2"} text-emerald-700`}
                  />
                  <input
                    type="text"
                    name="FName"
                    placeholder={t("fname")}
                    value={values.FName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full outline-none bg-transparent text-gray-700"
                  />
                </div>
                {touched.FName && errors.FName && (
                  <p className="text-red-500 text-sm">{errors.FName}</p>
                )}

                {/* LName */}
                <div className="flex items-center border border-emerald-200 rounded-md p-3 focus-within:border-emerald-700">
                  <FaUser
                    className={`${direction === "rtl" ? "ml-2" : "mr-2"} text-emerald-700`}
                  />
                  <input
                    type="text"
                    name="LName"
                    placeholder={t("lname")}
                    value={values.LName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full outline-none bg-transparent text-gray-700"
                  />
                </div>
                {touched.LName && errors.LName && (
                  <p className="text-red-500 text-sm">{errors.LName}</p>
                )}

                {/* Email */}
                <div className="flex items-center border border-emerald-200 rounded-md p-3 focus-within:border-emerald-700">
                  <MdEmail
                    className={`${direction === "rtl" ? "ml-2" : "mr-2"} text-emerald-700`}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder={t("email")}
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full outline-none bg-transparent text-gray-700"
                  />
                </div>
                {touched.email && errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}

                {/* Password */}
                <div className="flex items-center border border-emerald-200 rounded-md p-3 focus-within:border-emerald-700">
                  <FaLock
                    className={`${direction === "rtl" ? "ml-2" : "mr-2"} text-emerald-700`}
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder={t("password")}
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full outline-none bg-transparent text-gray-700"
                  />
                </div>
                {touched.password && errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              {/* ---------------- Address Details ---------------- */}
              <div className="flex-1 flex flex-col w-1/2 gap-2 p-3">
                <h3 className="text-xl font-semibold mb-1 text-emerald-800">
                  {t("addressDetails")}
                </h3>

                {/* Street */}
                <div className="flex items-center border border-emerald-200 rounded-md p-3 focus-within:border-emerald-700 ">
                  <GiCrossroad
                    className={`${direction === "rtl" ? "ml-2" : "mr-2"} text-emerald-700`}
                  />
                  <input
                    type="text"
                    name="UStreet"
                    placeholder={t("street")}
                    value={values.UStreet}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full outline-none bg-transparent text-gray-700"
                  />
                </div>
                {touched.UStreet && errors.UStreet && (
                  <p className="text-red-500 text-sm">{errors.UStreet}</p>
                )}

                {/* Unit Number */}
                <div className="flex items-center border border-emerald-200 rounded-md p-3 focus-within:border-emerald-700 ">
                  <RiCommunityFill
                    className={`${direction === "rtl" ? "ml-2" : "mr-2"} text-emerald-700`}
                  />
                  <input
                    type="text"
                    name="UUnitNum"
                    placeholder={t("unitNum")}
                    value={values.UUnitNum}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full outline-none bg-transparent text-gray-700"
                  />
                </div>

                {/* City */}
                <div className="flex items-center border border-emerald-200 rounded-md p-3 focus-within:border-emerald-700">
                  <BiSolidCity
                    className={`${direction === "rtl" ? "ml-2" : "mr-2"} text-emerald-700`}
                  />

                  <input
                    type="text"
                    name="UCity"
                    placeholder={t("city")}
                    value={values.UCity}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full outline-none bg-transparent text-gray-700"
                  />
                </div>

                {/* Additional Address */}
                <div className="flex items-center border border-emerald-200 rounded-md p-3 focus-within:border-emerald-700">
                  <ImAddressBook
                    className={`${direction === "rtl" ? "ml-2" : "mr-2"} text-emerald-700`}
                  />

                  <input
                    type="text"
                    name="USAdd"
                    placeholder={t("additionalAddress")}
                    value={values.USAdd}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full outline-none bg-transparent text-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* ---------------- Languages ---------------- */}
            <h3 className="text-xl font-semibold  mb-4 text-emerald-800">
              {t("languages")}
            </h3>
            {/* check box */}
            <div className="flex gap-2 flex-wrap">
              {["Arabic", "English", "French", "Spanish", "German"].map(
                (lang) => (
                  <label key={lang} className="flex items-center gap-2">
                    <input
                      className="accent-emerald-600"
                      type="radio"
                      name="language"
                      value={lang}
                      checked={values.language === lang}
                      onChange={handleChange}
                    />
                    <span className="text-gray-700">
                      {t(lang.toLowerCase())}
                    </span>
                  </label>
                ),
              )}
            </div>

            {/* Role */}
            <div className="flex gap-1 mt-4">
              <p className="text-lg text-gray-600 font-medium">
                {t("chooseRole")}
              </p>
              <span
                onClick={() => router.push(`/${locale}/vRegister`)}
                className="text-yellow-600 font-semibold cursor-pointer hover:underline"
              >
                {t("volunteer")}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition font-medium shadow-md "
            >
              {isLoading ? t("loading") : t("register")}
            </button>

            {errMsg && (
              <p className="text-red-700 text-sm text-center mt-2">{errMsg}</p>
            )}

            {/* Login Link */}
            <p className="text-center text-gray-600">
              {t("haveAccount")}{" "}
              <span
                onClick={() => router.push(`/${locale}/login`)}
                className="text-yellow-600 font-semibold cursor-pointer hover:underline"
              >
                {t("login")}
              </span>
            </p>

            {/* Language Switch */}
            <div
              className={`mt-4 flex ${direction === "rtl" ? "justify-end" : "justify-end"}`}
            >
              <button
                type="button"
                onClick={changeLanguage}
                className="text-sm text-emerald-700 hover:text-emerald-800 underline underline-offset-4 transition"
              >
                {locale === "ar" ? "For English" : "للعربية"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
