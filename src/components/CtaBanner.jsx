import { useLang } from "../i18n/LanguageContext.jsx";
import Crowd from "./Crowd.jsx";
import Html from "./Html.jsx";

export default function CtaBanner({ onDemo }) {
  const { t } = useLang();

  return (
    <div className="cta">
      <Crowd side="left" />
      <Crowd side="right" />
      <div className="cta-box">
        <div>
          <Html as="h2" html={t("cta_title")} />
          <p>{t("cta_sub")}</p>
        </div>
        <button className="btn btn-or" onClick={onDemo}>
          <span>{t("demo")}</span>
          <span aria-hidden="true" style={{ fontSize: 20, lineHeight: 1 }}>
            →
          </span>
        </button>
      </div>
    </div>
  );
}
