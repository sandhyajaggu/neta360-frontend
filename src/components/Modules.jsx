import { useLang } from "../i18n/LanguageContext.jsx";
import { Icon } from "./Icon.jsx";
import Brand from "./Brand.jsx";

const MODULE_STYLE = [
  { icon: "people", color: "#15803d", title: "#15803d" },
  { icon: "ballot", color: "#146b34", title: "#146b34" },
  { icon: "store", color: "#2563eb", title: "#1e40af" },
  { icon: "group", color: "#7c3aed", title: "#6d28d9" },
  { icon: "mega", color: "#e11d48", title: "#e11d48" },
  { icon: "cal", color: "#f26a0f", title: "#ea580c" },
  { icon: "chart", color: "#0f5132", title: "#0f5132" },
];

export default function Modules() {
  const { t } = useLang();

  return (
    <div className="wrap" id="modules">
      <section className="panel modules-panel">
        <h2 className="sec-title">
          <span>
            <Brand /> {t("modules_title")}
          </span>
        </h2>
        <div className="modules">
          {t("mods").map(([title, desc], i) => (
            <article className="mod" key={i}>
              <div className="mi">
                <Icon name={MODULE_STYLE[i].icon} color={MODULE_STYLE[i].color} />
              </div>
              <h3 style={{ color: MODULE_STYLE[i].title }}>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
