import { createContext, useCallback, useContext, useEffect, useState } from "react";
import te from "./te.json";
import en from "./en.json";

const dictionaries = { te, en };
const STORAGE_KEY = "neta360-lang";
const LanguageContext = createContext(null);

function initialLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "en" || saved === "te" ? saved : "te";
  } catch {
    return "te";
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(initialLanguage);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* storage unavailable – ignore */
    }
  }, [lang]);

  // t("key") returns a string or array from the active language, falling back to Telugu.
  const t = useCallback((key) => dictionaries[lang][key] ?? dictionaries.te[key] ?? key, [lang]);

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside <LanguageProvider>");
  return ctx;
}
