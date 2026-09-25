import { useLang } from "../i18n/LanguageContext.jsx";
import { Icon } from "./Icon.jsx";

const WHO_ICONS = ["mla", "party", "cand", "office", "camp"];
const STAT_VALUES = ["10K+", "100%", "24/7", "99.9%"];

export default function WhoAndStats() {
  const { t } = useLang();

  return (
    <div className="wrap duo" id="who">
      <section className="panel">
        <h3>{t("who_title")}</h3>
        <div className="who">
          {t("who").map((label, i) => (
            <div key={i}>
              <span className="wi">
                <Icon name={WHO_ICONS[i]} />
              </span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel" id="stats">
        <h3>{t("stats_title")}</h3>
        <div className="stats">
          {t("stats").map((label, i) => (
            <div className="stat" key={i}>
              <b>{STAT_VALUES[i]}</b>
              <small>{label}</small>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
