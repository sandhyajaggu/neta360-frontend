import { useMemo, useRef, useState } from "react";
import { useLang } from "../../i18n/LanguageContext.jsx";
import { CONTACT } from "../../config/contact.js";
import { submitContactMessage } from "../../services/api.js";
import { Ico, Sent, digits10, nameOk, phoneOk } from "./shared.jsx";

const TIMES = ["10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"];
const EMPTY = { name: "", phone: "", constituency: "" };

// The next 7 days, starting tomorrow.
function nextWeek() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1 + i));
}

// "Pick a time that suits you": date + time picker with a live booking summary.
export default function BookingSection() {
  const { t, lang } = useLang();
  const days = useMemo(nextWeek, []);
  const [day, setDay] = useState(0);
  const [time, setTime] = useState(3);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const nameRef = useRef(null);
  const phoneRef = useRef(null);

  const locale = lang === "te" ? "te-IN" : "en-IN";
  const fmt = (date, options) => date.toLocaleDateString(locale, options);
  const monthOf = (date) => fmt(date, { month: "long", year: "numeric" });
  const first = monthOf(days[0]);
  const last = monthOf(days[6]);
  const monthLabel = first === last ? first : `${fmt(days[0], { month: "long" })} – ${last}`;
  const picked = days[day];

  const submit = async () => {
    const bad = { name: !nameOk(form.name), phone: !phoneOk(form.phone) };
    setErrors(bad);
    if (bad.name) return nameRef.current.focus();
    if (bad.phone) return phoneRef.current.focus();

    setStatus("sending");
    try {
      await submitContactMessage({
        desk: "Demo booking",
        name: form.name.trim(),
        phone: form.phone,
        constituency: form.constituency.trim(),
        date: picked.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }),
        time: TIMES[time],
        language: lang,
      });
      setForm(EMPTY);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  const [s1, s2, s3] = t("bk_steps");
  const [help1, help2] = t("bk_help");

  return (
    <section className="bk">
      <div className="bk-head">
        <div>
          <p className="bk-eyebrow">{t("bk_eyebrow")}</p>
          <h2 className="bk-title">{t("bk_title")}</h2>
        </div>
        <span className="ws-brand">
          Neta<b>360</b>
        </span>
      </div>

      <div className="bk-grid">
        <div className="bk-picker">
          <div className="bk-step-head">
            <h3>{s1}</h3>
            <small>{monthLabel}</small>
          </div>
          <div className="bk-days" role="group" aria-label={s1}>
            {days.map((d, i) => (
              <button key={i} type="button" className="bk-day" aria-pressed={day === i} onClick={() => setDay(i)}>
                <small>{fmt(d, { weekday: "short" })}</small>
                <b>{d.getDate()}</b>
              </button>
            ))}
          </div>

          <h3 className="bk-step">{s2}</h3>
          <div className="bk-times" role="group" aria-label={s2}>
            {TIMES.map((slot, i) => (
              <button key={slot} type="button" className="bk-time" aria-pressed={time === i} onClick={() => setTime(i)}>
                {slot}
              </button>
            ))}
          </div>

          <h3 className="bk-step">{s3}</h3>
          <div className="bk-details">
            <div className={`cs-field${errors.name ? " bad" : ""}`}>
              <label htmlFor="bk-name">{t("m_name")}</label>
              <input id="bk-name" ref={nameRef} autoComplete="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              <div className="err">{t("e_name")}</div>
            </div>
            <div className={`cs-field${errors.phone ? " bad" : ""}`}>
              <label htmlFor="bk-phone">{t("cb_phone")}</label>
              <div className="ct-phone">
                <span>+91</span>
                <input id="bk-phone" ref={phoneRef} inputMode="numeric" autoComplete="tel-national" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: digits10(e.target.value) }))} />
              </div>
              <div className="err">{t("e_phone")}</div>
            </div>
            <div className="cs-field">
              <label htmlFor="bk-cons">{t("m_cons")}</label>
              <input id="bk-cons" value={form.constituency} onChange={(e) => setForm((f) => ({ ...f, constituency: e.target.value }))} />
            </div>
          </div>
        </div>

        <aside className="bk-side">
          <div className="bk-summary">
            {status === "done" ? (
              <Sent dark title={t("bk_done")} text={t("bk_done_sub")} again={t("bk_again")} onAgain={() => setStatus("idle")} />
            ) : (
              <>
                <p className="bk-eyebrow">{t("bk_your")}</p>
                <p className="bk-when">
                  {fmt(picked, { weekday: "long" })}, {picked.getDate()}
                  <br />
                  {TIMES[time]}
                </p>
                <ul>
                  <li>
                    <Ico name="clock" />
                    {t("demo_duration")}
                  </li>
                  <li>
                    <Ico name="video" />
                    {t("bk_mode")}
                  </li>
                  <li>
                    <Ico name="translate" />
                    {t("bk_lang")}
                  </li>
                </ul>
                {status === "error" && <p className="bk-err">{t("e_submit")}</p>}
                <button type="button" className="cs-send" onClick={submit} disabled={status === "sending"}>
                  {status === "sending" ? t("sending") : t("bk_confirm")}
                </button>
              </>
            )}
          </div>

          <div className="bk-help">
            <h3>{t("bk_help_title")}</h3>
            <p>
              {help1} <a href={CONTACT.phoneHref}>{CONTACT.phone}</a> {help2} <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
