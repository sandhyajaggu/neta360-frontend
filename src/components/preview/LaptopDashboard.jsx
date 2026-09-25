import { useLang } from "../../i18n/LanguageContext.jsx";
import { Icon, LineIcon } from "../Icon.jsx";
import markImg from "../../assets/logo-mark.png";

// Sample figures shown in the marketing mockup.
const SIDEBAR_ICONS = ["home", "people", "vote", "booth", "people", "issue", "event", "dev", "scheme", "report", "bell", "settings"];
const KPI_VALUES = [
  ["226,765", "5.6%"],
  ["118,245", "4.1%"],
  ["2,487", "3.2%"],
  ["18,752", "7.3%"],
];
const CATEGORY = [
  { color: "#2f5bd3", value: "118,710 (52.4%)" },
  { color: "#a36be0", value: "100,450 (44.3%)" },
  { color: "#c9b89a", value: "7,605 (3.3%)" },
];
const BOOTHS = [
  { color: "#16a34a", value: "1,790 (72%)" },
  { color: "#2563eb", value: "447 (18%)" },
  { color: "#f97316", value: "200 (8%)" },
  { color: "#e11d48", value: "50 (2%)" },
];
const WORKS = [
  { value: "188", bg: "#ecf8f0", color: "#15803d" },
  { value: "96", bg: "#eaf1ff", color: "#1d4ed8" },
  { value: "42", bg: "#fff3e8", color: "#ea580c" },
  { value: "326", bg: "#f3edff", color: "#6d28d9" },
];

export default function LaptopDashboard() {
  const { t } = useLang();

  return (
    <div className="laptop" aria-hidden="true">
      <div className="lid">
        <div className="dash">
          <aside className="dside">
            <div className="dl">
              <img src={markImg} alt="" />
              <span>
                Neta<b>360</b>
              </span>
              <i>☰</i>
            </div>
            {t("side").map((label, i) => (
              <div key={i} className={`it${i === 0 ? " on" : ""}`}>
                <LineIcon name={SIDEBAR_ICONS[i]} />
                {label}
              </div>
            ))}
          </aside>

          <div className="dmain">
            <div className="dtop">
              <span>▦</span>
              <span>‹</span>
            </div>

            <div className="kpis">
              {t("kpis").map((label, i) => (
                <div className="card kpi" key={i}>
                  <small>{label}</small>
                  <b>{KPI_VALUES[i][0]}</b>
                  <em>▲ {KPI_VALUES[i][1]}</em>
                  <i>{t("vs")}</i>
                </div>
              ))}
            </div>

            <div className="drow">
              <div className="card">
                <h4>{t("d_cat")}</h4>
                <div className="donut-box">
                  <div className="donut">
                    <span>
                      226,765<i>{t("d_total")}</i>
                    </span>
                  </div>
                  <div className="lgd">
                    {t("lgd").map((label, i) => (
                      <div key={i}>
                        <i style={{ background: CATEGORY[i].color }} />
                        <span>
                          {label}
                          <small>{CATEGORY[i].value}</small>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card">
                <h4>{t("d_booth")}</h4>
                <div className="booth">
                  <div className="ring">
                    <span>
                      72%<i>{t("d_strong")}</i>
                    </span>
                  </div>
                  <div className="bl">
                    {t("bl").map((label, i) => (
                      <div key={i}>
                        <span style={{ color: BOOTHS[i].color }}>
                          <Icon name="people" />
                        </span>
                        {label}
                        <b>{BOOTHS[i].value}</b>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="drow2">
              <div className="card newv">
                <h4>{t("d_new")}</h4>
                <b>3,432</b>
              </div>
              <div className="card">
                <h4>{t("d_dev")}</h4>
                <div className="dev">
                  {t("dev").map((label, i) => (
                    <div key={i} style={{ background: WORKS[i].bg }}>
                      <b style={{ color: WORKS[i].color }}>{WORKS[i].value}</b>
                      <small>{label}</small>
                    </div>
                  ))}
                </div>
                <div className="prog">
                  <span>{t("d_prog")}</span>
                  <span>60%</span>
                </div>
                <div className="bar">
                  <i />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="base" />
    </div>
  );
}
