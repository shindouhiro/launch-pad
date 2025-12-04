"use client";

import { Button } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";

export default function LanguageSwitcher() {
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    // Get current locale from cookie
    const currentLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("locale="))
      ?.split("=")[1] || "en";
    setLocale(currentLocale);
  }, []);

  const toggleLanguage = () => {
    const newLocale = locale === "en" ? "zh" : "en";
    // Set cookie
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;
    setLocale(newLocale);
    // Reload page to apply new locale
    window.location.reload();
  };

  return (
    <Button
      icon={<GlobalOutlined />}
      onClick={toggleLanguage}
      style={{ marginLeft: "8px" }}
    >
      {locale === "en" ? "中文" : "English"}
    </Button>
  );
}
