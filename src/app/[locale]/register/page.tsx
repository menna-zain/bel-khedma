"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslations, useLocale } from "next-intl";

type FormValues = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  role: "volunteer" | "beneficiary"; // جديد
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
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    role: "beneficiary", // القيمة الافتراضية
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
      const res = await axios.post("", values);

      console.log(res.data);
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
    name: Yup.string()
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
    passwordConfirm: Yup.string()
      .required(t("passwordConfirmRequired"))
      .oneOf([Yup.ref("password")], t("passwordsMustMatch")),
    role: Yup.string().required("اختر نوع الحساب"), // يمكن بعدين تعمله ترجمة
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
        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="flex items-center border border-emerald-200 rounded-md p-3 focus-within:border-emerald-600">
            <FaUser
              className={`${direction === "rtl" ? "ml-2" : "mr-2"}
                 text-emerald-600`}
            />
            <input
              type="text"
              name="name"
              placeholder={t("name")}
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full outline-none bg-transparent text-gray-700"
            />
          </div>
          {touched.name && errors.name && (
            <p className="text-red-500 text-sm">{errors.name}</p>
          )}

          {/* Email */}
          <div className="flex items-center border border-emerald-200 rounded-md p-3 focus-within:border-emerald-600">
            <MdEmail
              className={`${direction === "rtl" ? "ml-2" : "mr-2"} text-emerald-600`}
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
          <div className="flex items-center border border-emerald-200 rounded-md p-3 focus-within:border-emerald-600">
            <FaLock
              className={`${direction === "rtl" ? "ml-2" : "mr-2"} text-emerald-600`}
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

          {/* Password Confirm */}
          <div className="flex items-center border border-emerald-200 rounded-md p-3 focus-within:border-emerald-600">
            <FaLock
              className={`${direction === "rtl" ? "ml-2" : "mr-2"} text-emerald-600`}
            />
            <input
              type="password"
              name="passwordConfirm"
              placeholder={t("passwordConfirm")}
              value={values.passwordConfirm}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full outline-none bg-transparent text-gray-700"
            />
          </div>
          {touched.passwordConfirm && errors.passwordConfirm && (
            <p className="text-red-500 text-sm">{errors.passwordConfirm}</p>
          )}

          {/* Role */}
          <div className="">
            <p className="mb-2 text-gray-600 font-medium">{t("chooseRole")}</p>

            <div className="flex gap-6">
              {/* Beneficiary */}
              <label className="flex items-center gap-2 cursor-pointer text-gray-500">
                <input
                  type="radio"
                  name="role"
                  value="beneficiary"
                  checked={values.role === "beneficiary"}
                  onChange={handleChange}
                  className="accent-emerald-700"
                />
                <span>{t("beneficiary")}</span>
              </label>

              {/* Volunteer */}
              <label className="flex items-center gap-2 cursor-pointer text-gray-500">
                <input
                  type="radio"
                  name="role"
                  value="volunteer"
                  checked={values.role === "volunteer"}
                  onChange={handleChange}
                  className="accent-emerald-700"
                />
                <span>{t("volunteer")}</span>
              </label>
            </div>
          </div>

          {touched.role && errors.role && (
            <p className="text-red-500 text-sm">{errors.role}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition font-medium shadow-md"
          >
            {isLoading ? t("loading") : t("register")}
          </button>

          {errMsg && (
            <p className="text-red-600 text-sm text-center mt-2">{errMsg}</p>
          )}
        </form>

        {/* Login Link & Language Switch */}
        <p className="mt-6 text-center text-gray-600">
          {t("haveAccount")}{" "}
          <span
            onClick={() => router.push(`/${locale}/login`)}
            className="text-yellow-600 font-semibold cursor-pointer hover:underline"
          >
            {t("login")}
          </span>
        </p>

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
