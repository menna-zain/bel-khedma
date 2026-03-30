"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaUser, FaLock } from "react-icons/fa";
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
  age: number;
  mobile: string;
  VGoal: number;
  VCarColor: string;
  VCarPlate: string;
  language: string[];
};

export default function vRegister() {
  const t = useTranslations("registerPage");
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
    ssn: "",
    age: 0,
    mobile: "",
    VGoal: 0,
    VCarColor: "",
    VCarPlate: "",
    language: [],
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
      console.log(res);
      router.push(`/${locale}/login`);
    } catch (err: any) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors && apiErrors.length > 0) {
        setErrMsg(apiErrors[0].msg);
      } else {
        setErrMsg(err.response?.data?.status || t("somethingWentWrong"));
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
                <FaUser
                  className={`${direction === "rtl" ? "ml-2" : "mr-2"} text-emerald-700`}
                />
                <input
                  type="number"
                  name="mobile"
                  placeholder="Mobile"
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
                  type="number"
                  name="ssn"
                  placeholder="SSN"
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
                  placeholder="Age"
                  value={values.age}
                  onChange={handleChange}
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
            <div className="p-3 border rounded-lg ">
              <h3 className="text-lg font-semibold mb-2 text-emerald-800">
                Volunteer Info
              </h3>

              {/*  */}
              <div className="flex items-center border border-emerald-200 rounded-md p-3 focus-within:border-emerald-700 mb-3">
                <FaUser
                  className={`${direction === "rtl" ? "ml-2" : "mr-2"} text-emerald-700`}
                />

                <input
                  type="text"
                  name="VGoal"
                  placeholder="Goal"
                  value={values.VGoal}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full outline-none bg-transparent text-gray-700"
                />
              </div>
              {/*  */}
              {/*  */}
              <div className="flex items-center border border-emerald-200 rounded-md p-3 focus-within:border-emerald-700">
                <FaUser
                  className={`${direction === "rtl" ? "ml-2" : "mr-2"} text-emerald-700`}
                />

                <input
                  type="text"
                  name="VCarColor"
                  placeholder="Car Color"
                  value={values.VCarColor}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full outline-none bg-transparent text-gray-700"
                />
              </div>
              {/*  */}
              {/*  */}
              <div className="flex items-center border border-emerald-200 rounded-md p-3 focus-within:border-emerald-700 my-3">
                <FaUser
                  className={`${direction === "rtl" ? "ml-2" : "mr-2"} text-emerald-700`}
                />

                <input
                  type="text"
                  name="VCarPlate"
                  placeholder="Car Plate"
                  value={values.VGoal}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full outline-none bg-transparent text-gray-700"
                />
              </div>
              {/*  */}

            </div>
          )}

          {/* Languages */}
          <div className="flex gap-2 flex-wrap">
            {["Arabic", "English", "French"].map((lang) => (
              <label key={lang} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={values.language.includes(lang)}
                  onChange={() => {
                    if (values.language.includes(lang)) {
                      setFieldValue(
                        "language",
                        values.language.filter((l) => l !== lang),
                      );
                    } else {
                      setFieldValue("language", [...values.language, lang]);
                    }
                  }}
                />
                {lang}
              </label>
            ))}
          </div>

          <button className="w-full py-3 bg-emerald-700 text-white rounded-md">
            {isLoading ? "Loading..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
