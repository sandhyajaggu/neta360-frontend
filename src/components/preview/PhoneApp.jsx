import { useLang } from "../../i18n/LanguageContext.jsx";
import { Icon } from "../Icon.jsx";

const TILES = [
  ["people", "#15803d"],
  ["store", "#2563eb"],
  ["group", "#7c3aed"],
  ["mega", "#e11d48"],
  ["cal", "#f26a0f"],
  ["chart", "#0f5132"],
];
const QUICK = [
  { value: "226,765", delta: "+5.6%", color: "#15803d", icon: "people" },
  { value: "118,245", delta: "+4.2%", color: "#2563eb", icon: "home" },
  { value: "63", delta: "+2.6%", color: "#f26a0f", icon: "mega", down: true },
  { value: "24", delta: "+14.3%", color: "#0e7490", icon: "cal" },
];

export default function PhoneApp() {
  const { t } = useLang();

  return (
    <div className="phone-wrap" aria-hidden="true">
      <div className="phone">
        <div className="scr">
          <div className="sbar">
            <span>9:41</span>
            <span>▮▮▮ ◔</span>
          </div>
          <div className="phd">
            <span>☰</span>
            <span className="t">
              Neta<b>360</b>
            </span>
            <span className="bell">🔔</span>
            <span className="av" />
          </div>

          <div className="tiles">
            {t("tiles").map((label, i) => (
              <div key={i}>
                <span className="ti">
                  <Icon name={TILES[i][0]} color={TILES[i][1]} />
                </span>
                {label}
              </div>
            ))}
          </div>

          <h5>{t("p_quick")}</h5>
          <div className="ql">
            {t("ql").map((label, i) => (
              <div key={i}>
                <span className="qi" style={{ background: QUICK[i].color }}>
                  <Icon name={QUICK[i].icon} />
                </span>
                <span className="lb">
                  {label}
                  <b>{QUICK[i].value}</b>
                </span>
                <em className={QUICK[i].down ? "dn" : undefined}>{QUICK[i].delta}</em>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
