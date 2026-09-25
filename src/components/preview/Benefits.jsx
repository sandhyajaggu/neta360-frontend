import { useLang } from "../../i18n/LanguageContext.jsx";
import { LineIcon } from "../Icon.jsx";
import Brand from "../Brand.jsx";

const BENEFIT_ICONS = [
  ["check", "#0f766e"],
  ["decide", "#4f46e5"],
  ["comm", "#15803d"],
  ["growth", "#146b34"],
  ["trans", "#0e7490"],
];

export default function Benefits() {
  const { t } = useLang();

  return (
    <div className="ben-wrap">
      <h3 className="ben-title">
        <Brand /> {t("ben_title")}
      </h3>
      <div className="panel ben-card">
        {t("bens").map(([title, desc], i) => (
          <div className="ben" key={i}>
            <span className="bi" style={{ background: BENEFIT_ICONS[i][1] }}>
              <LineIcon name={BENEFIT_ICONS[i][0]} />
            </span>
            <div>
              <strong>{title}</strong>
              <small>{desc}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
