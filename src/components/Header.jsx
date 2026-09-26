import { useEffect, useState } from "react";
import { useLang } from "../i18n/LanguageContext.jsx";
import markImg from "../assets/logo-mark.png";
import wordImg from "../assets/logo-word.png";

const LINKS = [
  ["home", "nav_home"],
  ["modules", "nav_features"],
  ["preview", "nav_modules"],
  ["who", "nav_who"],
];
const LANGS = [
  ["te", "తెలుగు"],
  ["en", "EN"],
];

export default function Header({ page, onDemo, onToast }) {
  const { lang, setLang, t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      let current = "home";
      for (const [id] of LINKS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 140) current = id;
      }
      setActive(current);
      setMenuOpen(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header>
      <div className="wrap nav">
        <a href="#home" className="logo" aria-label="Neta360 home">
          <img className="mk" src={markImg} alt="" />
          <div>
            <img className="wd" src={wordImg} alt="Neta360" />
            <small>Political CRM &amp; Constituency Intelligence</small>
          </div>
        </a>

        <nav className={`menu${menuOpen ? " open" : ""}`}>
          {LINKS.map(([id, key]) => (
            <a key={id} href={`#${id}`} className={page === "home" && active === id ? "active" : undefined}>
              {t(key)}
            </a>
          ))}
          <a href="#/pricing" className={page === "pricing" ? "active" : undefined}>
            {t("nav_pricing")}
          </a>
          <a href="#/contact" className={page === "contact" ? "active" : undefined}>
            {t("nav_contact")}
          </a>
        </nav>

        <div className="actions">
          <div className="lang" role="group" aria-label="Language">
            {LANGS.map(([code, label]) => (
              <button key={code} aria-pressed={lang === code} onClick={() => setLang(code)}>
                {label}
              </button>
            ))}
          </div>
          <button className="btn btn-line" onClick={() => onToast(t("login_toast"))}>
            {t("login")}
          </button>
          <button className="btn btn-dark" onClick={onDemo}>
            {t("demo")}
          </button>
          <button className="burger" aria-label="Menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((o) => !o)}>
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}
