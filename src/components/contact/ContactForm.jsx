import { useRef, useState } from "react";
import { useLang } from "../../i18n/LanguageContext.jsx";
import { submitContactMessage } from "../../services/api.js";

// Desk names sent with the message, so the email subject is English whatever the page language.
const DESK_NAMES = ["Book a demo", "Support", "Partnership", "Media"];
const EMPTY = { name: "", role: 0, phone: "", email: "", state: 0, constituency: "", message: "", consent: false };

export default function ContactForm({ desk, onDesk }) {
  const { t, lang } = useLang();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const refs = { name: useRef(null), phone: useRef(null), email: useRef(null), consent: useRef(null) };

  const update = (field) => (e) => {
    let value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    if (field === "phone") value = value.replace(/\D/g, "").slice(0, 10);
    if (field === "role" || field === "state") value = Number(value);
    setForm((f) => ({ ...f, [field]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const bad = {
      name: form.name.trim().length < 2,
      phone: !/^[6-9]\d{9}$/.test(form.phone),
      email: form.email.trim() !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()),
      consent: !form.consent,
    };
    setErrors(bad);
    const firstBad = Object.keys(bad).find((k) => bad[k]);
    if (firstBad) return refs[firstBad].current.focus();

    setStatus("sending");
    try {
      await submitContactMessage({
        desk: DESK_NAMES[desk],
        name: form.name.trim(),
        phone: form.phone,
        email: form.email.trim(),
        role: t("c_roles")[form.role],
        state: t("c_states")[form.state],
        constituency: form.constituency.trim(),
        message: form.message.trim(),
        language: lang,
      });
      setForm(EMPTY);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="ct-done">
        <div className="ic">
          <svg className="i" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" />
            <path d="M8 12.5l2.5 2.5L16 9.5" />
          </svg>
        </div>
        <h2 className="ct-serif">{t("c_done")}</h2>
        <p>{t("c_done_sub")}</p>
        <button className="ct-tab" onClick={() => setStatus("idle")}>
          {t("c_again")}
        </button>
      </div>
    );
  }

  const field = (name, label, input, error) => (
    <div className={`ct-field${errors[name] ? " bad" : ""}`}>
      <label htmlFor={`ct-${name}`}>{label}</label>
      {input}
      {error && <div className="err">{error}</div>}
    </div>
  );

  return (
    <form className="ct-form" onSubmit={submit} noValidate>
      <h2 className="ct-serif">{t("c_form_title")}</h2>
      <p className="ct-form-sub">{t("c_form_sub")}</p>

      <div className="ct-tabs" role="group" aria-label={t("c_form_title")}>
        {t("c_desks").map((label, i) => (
          <button key={i} type="button" className="ct-tab" aria-pressed={desk === i} onClick={() => onDesk(i)}>
            {label}
          </button>
        ))}
      </div>

      <div className="ct-grid">
        {field(
          "name",
          t("c_name"),
          <input id="ct-name" ref={refs.name} autoComplete="name" placeholder={t("c_name_ph")} value={form.name} onChange={update("name")} />,
          t("e_name")
        )}
        {field(
          "role",
          t("c_role"),
          <select id="ct-role" value={form.role} onChange={update("role")}>
            {t("c_roles").map((r, i) => (
              <option key={i} value={i}>
                {r}
              </option>
            ))}
          </select>
        )}
        {field(
          "phone",
          t("c_phone"),
          <div className="ct-phone">
            <span>+91</span>
            <input id="ct-phone" ref={refs.phone} inputMode="numeric" autoComplete="tel-national" placeholder="98XXXXXXXX" value={form.phone} onChange={update("phone")} />
          </div>,
          t("e_phone")
        )}
        {field(
          "email",
          t("c_mail"),
          <input id="ct-email" ref={refs.email} type="email" autoComplete="email" placeholder="name@office.in" value={form.email} onChange={update("email")} />,
          t("e_email")
        )}
        {field(
          "state",
          t("c_state"),
          <select id="ct-state" value={form.state} onChange={update("state")}>
            {t("c_states").map((s, i) => (
              <option key={i} value={i}>
                {s}
              </option>
            ))}
          </select>
        )}
        {field(
          "constituency",
          t("c_cons"),
          <input id="ct-constituency" placeholder={t("c_cons_ph")} value={form.constituency} onChange={update("constituency")} />
        )}
      </div>

      {field(
        "message",
        t("c_msg"),
        <textarea id="ct-message" rows={3} placeholder={t("c_msg_ph")} value={form.message} onChange={update("message")} />
      )}

      <div className={`ct-consent${errors.consent ? " bad" : ""}`}>
        <label>
          <input type="checkbox" ref={refs.consent} checked={form.consent} onChange={update("consent")} />
          <span>{t("c_consent")}</span>
        </label>
        <div className="err">{t("e_consent")}</div>
      </div>

      {status === "error" && <p className="ct-submit-err">{t("e_submit")}</p>}

      <button type="submit" className="ct-send" disabled={status === "sending"}>
        {status === "sending" ? t("sending") : t("c_send")}
      </button>
    </form>
  );
}
