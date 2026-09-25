import { useLang } from "../i18n/LanguageContext.jsx";
import { Icon } from "./Icon.jsx";
import Html from "./Html.jsx";
import heroImg from "../assets/hero-leader.jpg";
import wordImg from "../assets/logo-word.png";

const CHIP_ICONS = [
  ["people", "#16a34a"],
  ["store", "#f97316"],
  ["group", "#7c3aed"],
  ["mega", "#e11d48"],
];

export default function Hero({ onDemo, onWatchVideo }) {
  const { t } = useLang();

  return (
    <section className="hero" id="home">
      <div className="hero-photo">
        <img src={heroImg} alt="" />
        <div className="chips">
          {t("chips").map(([title, sub], i) => (
            <div className="chip" key={i}>
              <span className="ci">
                <Icon name={CHIP_ICONS[i][0]} color={CHIP_ICONS[i][1]} />
              </span>
              <div>
                <strong>{title}</strong>
                <small>{sub}</small>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="wrap">
        <div className="hero-text">
          <img className="hero-word" src={wordImg} alt="Neta360" />
          <Html as="h1" html={t("hero_title")} />
          <div className="tags">
            {t("tags").map((tag, i) => (
              <span key={i} className={`t${i}`}>
                {tag}
              </span>
            ))}
          </div>
          <div className="divider" />
          <Html as="p" className="lead" html={t("hero_desc")} />
          <div className="hero-cta">
            <button className="btn pill pill-dark" onClick={onDemo}>
              <span>{t("free_demo")}</span>
              <span aria-hidden="true">→</span>
            </button>
            <button className="btn pill pill-line" onClick={onWatchVideo}>
              <span className="play">▶</span>
              <span>{t("watch")}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
