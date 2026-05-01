"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaUser, FaLock, FaHandsHelping, FaMobileAlt } from "react-icons/fa";
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
  UCity: string;
  UUnitNum: string;
  USAdd: string;
  ssn: string;
  age: string;
  mobile: string;
  VGoal: string;
  VCarColor: string;
  VCarPlate: string;
  languages: string[];
};

export default function vRegister() {
  const t = useTranslations("vRegisterPage");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const direction = locale === "ar" ? "rtl" : "ltr";

  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const initialValues: FormValues = {
    email: "",
    password: "",
    role: "volunteer",
    FName: "",
    LName: "",
    UStreet: "",
    UCity: "",
    UUnitNum: "",
    USAdd: "",
    ssn: "", // بدل 0
    age: "", // بدل 0
    mobile: "",
    VGoal: "", // بدل 0
    VCarColor: "",
    VCarPlate: "",
    languages: [],
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

    // تحويل الحقول الرقمية قبل الإرسال
    const payload = {
      ...values,
      age: Number(values.age),
      VGoal: Number(values.VGoal),
    };

    try {
      const res = await axios.post(
        "https://bilkhidmah-api.vercel.app/api/v1/auth/signup",
        payload,
      );
      console.log(res);
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

  const {
    handleChange,
    handleSubmit,
    handleBlur,
    setFieldValue,
    touched,
    values,
    errors,
  } = useFormik<FormValues>({
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
        className="flex items-center justify-center min-h-screen bg-emerald-50 p-4"
      >
        <div className="flex flex-col w-full md:w-3/4 lg:w-2/3 p-8 bg-white shadow-xl rounded-2xl border border-emerald-100">
          <h2 className="text-3xl font-bold text-emerald-800">{t("title")}</h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-2 p-3">
              {/* PERSONAL */}
              <div className="flex-1 flex flex-col gap-2 p-3">
                <h3 className="text-xl font-semibold mb-4 text-emerald-800">
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

                {/* MOBILE */}
                <div className="flex items-center border border-emerald-200 rounded-md p-3 focus-within:border-emerald-700">
                  <FaMobileAlt
                    className={`${direction === "rtl" ? "ml-2" : "mr-2"} text-emerald-700`}
                  />
                  <input
                    type="text"
                    name="mobile"
                    placeholder={t("mobile")}
                    value={values.mobile}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full outline-none bg-transparent text-gray-700"
                  />
                </div>

                {/* SSN */}
                <div className="flex items-center border border-emerald-200 rounded-md p-3 focus-within:border-emerald-700">
                  <FaUser
                    className={`${direction === "rtl" ? "ml-2" : "mr-2"} text-emerald-700`}
                  />
                  <input
                    type="text"
                    name="ssn"
                    placeholder={t("ssn")}
                    value={values.ssn}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full outline-none bg-transparent text-gray-700"
                  />
                </div>

                {/* AGE */}
                <div className="flex items-center border border-emerald-200 rounded-md p-3 focus-within:border-emerald-700">
                  <FaUser
                    className={`${direction === "rtl" ? "ml-2" : "mr-2"} text-emerald-700`}
                  />
                  <input
                    type="number"
                    name="age"
                    placeholder={t("age")}
                    value={values.age}
                    onChange={(e) => setFieldValue("age", e.target.value)}
                    onBlur={handleBlur}
                    className="w-full outline-none bg-transparent text-gray-700"
                  />
                </div>
              </div>
              {/* ---------------- Address Details ---------------- */}
              <div className="flex-1 flex flex-col w-1/2 gap-2 p-3">
                <h3 className="text-xl font-semibold mb-4 text-emerald-800">
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

            {/* Volunteer */}
            {values.role === "volunteer" && (
              <div className="p-3  rounded-lg ">
                <h3 className="text-lg font-semibold mb-2 text-emerald-800">
                  {t("volunteer info")}
                </h3>

                {/*  */}
                <div className="flex items-center border border-emerald-200 rounded-md p-3 focus-within:border-emerald-700 mb-3">
                  <input
                    type="text"
                    name="VGoal"
                    placeholder={t("Goal")}
                    value={values.VGoal}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full outline-none bg-transparent text-gray-700"
                  />
                </div>
                {/*  */}
                {/*  */}
                <div className="flex items-center border border-emerald-200 rounded-md p-3 focus-within:border-emerald-700">
                  <input
                    type="text"
                    name="VCarColor"
                    placeholder={t("car color")}
                    value={values.VCarColor}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full outline-none bg-transparent text-gray-700"
                  />
                </div>
                {/*  */}
                {/*  */}
                <div className="flex items-center border border-emerald-200 rounded-md p-3 focus-within:border-emerald-700 my-3">
                  <input
                    type="text"
                    name="VCarPlate"
                    placeholder={t("car plate")}
                    value={values.VCarPlate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full outline-none bg-transparent text-gray-700"
                  />
                </div>
                {/*  */}
              </div>
            )}

            {/* Languages */}
            <h3 className="text-xl font-semibold  mb-4 text-emerald-800">
              {t("languages")}
            </h3>
            {/* check box */}
            <div className="flex gap-2 flex-wrap">
              {["Arabic", "English", "French", "Spanish", "German"].map(
                (lang) => (
                  <label key={lang} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="accent-emerald-600"
                      checked={values.languages.includes(lang)}
                      onChange={() => {
                        if (values.languages.includes(lang)) {
                          setFieldValue(
                            "languages",
                            values.languages.filter((l) => l !== lang),
                          );
                        } else {
                          setFieldValue("languages", [...values.languages, lang]);
                        }
                      }}
                    />
                    <span className="text-gray-700">
                      {t(lang.toLowerCase())}
                    </span>
                  </label>
                ),
              )}
            </div>
            {/* ---------------- Languages ---------------- */}

            {/* Role */}
            <div className="flex gap-1 mt-4">
              <span
                onClick={() => router.push(`/${locale}/register`)}
                className="text-yellow-600 font-semibold cursor-pointer hover:underline"
              >
                {t("user")}
              </span>
            </div>
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

            <button className="w-full py-3 bg-emerald-700 text-white rounded-md">
              {isLoading ? t("loading") : t("register")}
            </button>
            {errMsg && (
  <p className="mt-2 text-sm text-red-500 text-center">
    {errMsg}
  </p>
)}
 {/* Login Link */}
            <p className=" text-center text-gray-600">
              {t("haveAccount")}{" "}
              <span
                onClick={() => router.push(`/${locale}/login`)}
                className="text-yellow-600 font-semibold cursor-pointer hover:underline"
              >
                {t("login")}
              </span>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
