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

export default function Register() {
  const t = useTranslations("registerPage");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const direction = locale === "ar" ? "rtl" : "ltr";

  const [isLoading, setIsLoading] = useState(false);

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

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      await axios.post(
        "https://bilkhidmah-api.vercel.app/api/v1/auth/signup",
        values
      );
      router.push(`/${locale}/login`);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik<FormValues>({
    initialValues,
    onSubmit,
  });

  const { values, handleChange, handleSubmit, setFieldValue } = formik;

  return (
    <div
      dir={direction}
      className="flex items-center justify-center min-h-screen bg-emerald-50 p-4"
    >
      <div className="flex flex-col w-full md:w-3/4 lg:w-2/3 p-8 bg-white shadow-xl rounded-2xl">
        <h2 className="text-3xl font-bold text-emerald-800">
          {t("title")}
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Personal + Address */}
          <div className="flex flex-col md:flex-row gap-2 p-3">
            
            {/* PERSONAL */}
            <div className="flex-1 flex flex-col gap-2 p-3">
              <h3 className="text-xl font-semibold text-emerald-800">
                {t("personaltyDetails")}
              </h3>

              <input name="FName" placeholder="First Name" onChange={handleChange} className="input" />
              <input name="LName" placeholder="Last Name" onChange={handleChange} className="input" />
              <input name="email" placeholder="Email" onChange={handleChange} className="input" />
              <input name="password" placeholder="Password" onChange={handleChange} className="input" />

              <input name="mobile" placeholder="Mobile" onChange={handleChange} className="input" />
              <input name="ssn" placeholder="SSN" onChange={handleChange} className="input" />
              <input type="number" name="age" placeholder="Age" onChange={handleChange} className="input" />
            </div>

            {/* ADDRESS */}
            <div className="flex-1 flex flex-col gap-2 p-3">
              <h3 className="text-xl font-semibold text-emerald-800">
                {t("addressDetails")}
              </h3>

              <input name="UStreet" placeholder="Street" onChange={handleChange} className="input" />
              <input name="UUnitNum" placeholder="Unit Number" onChange={handleChange} className="input" />
              <input name="UCity" placeholder="City" onChange={handleChange} className="input" />
              <input name="USAdd" placeholder="Additional Address" onChange={handleChange} className="input" />
            </div>
          </div>

          {/* Volunteer Fields */}
          {values.role === "volunteer" && (
            <div className="p-3 border rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-emerald-800">
                Volunteer Info
              </h3>

              <input name="VGoal" placeholder="Goal" onChange={handleChange} className="input" />
              <input name="VCarColor" placeholder="Car Color" onChange={handleChange} className="input" />
              <input name="VCarPlate" placeholder="Car Plate" onChange={handleChange} className="input" />
            </div>
          )}

          {/* Languages */}
          <div className="flex gap-2 flex-wrap">
            {["Arabic", "English", "French"].map((lang) => (
              <label key={lang}>
                <input
                  type="checkbox"
                  checked={values.language.includes(lang)}
                  onChange={() => {
                    if (values.language.includes(lang)) {
                      setFieldValue(
                        "language",
                        values.language.filter((l) => l !== lang)
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

