import { useRef, useState } from "react";
import { useLang } from "../../i18n/LanguageContext.jsx";
import { CONTACT, mapsHref } from "../../config/contact.js";
import { submitDemoRequest } from "../../services/api.js";
import { Ico, Sent, digits10, nameOk, phoneOk } from "./shared.jsx";

const EMPTY = { name: "", phone: "", role: 0, constituency: "", message: "" };

// "Your constituency is one call away": dark hero, demo request card, contact cards and FAQ.
export default function CallSection() {
  const { t, lang } = useLang();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [openFaq, setOpenFaq] = useState(0);
  const nameRef = useRef(null);
  const phoneRef = useRef(null);

  const update = (field) => (e) => {
    const value = field === "phone" ? digits10(e.target.value) : field === "role" ? Number(e.target.value) : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const bad = { name: !nameOk(form.name), phone: !phoneOk(form.phone) };
    setErrors(bad);
    if (bad.name) return nameRef.current.focus();
    if (bad.phone) return phoneRef.current.focus();

    setStatus("sending");
    try {
      await submitDemoRequest({
        name: form.name.trim(),
        phone: form.phone,
        role: t("roles")[form.role],
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

  const cards = [
    ["phone", "or", CONTACT.phone, CONTACT.phoneHref],
    ["chat", "gr", CONTACT.phone, CONTACT.whatsappHref],
    ["mail", "gr", CONTACT.email, `mailto:${CONTACT.email}`],
  ];
  const [line1, line2] = t("cs_title");

  return (
    <section className="cs">
      <div className="cs-band" aria-hidden="true" />
      <div className="cs-wrap">
        <div className="cs-left">
          <div className="cs-intro">
            <span className="cs-chip">{t("cs_chip")}</span>
            <h2 className="cs-title">
              {line1}
              <em>{line2}</em>
            </h2>
            <p className="cs-lead">{t("cs_lead")}</p>
            <ul className="cs-points">
              {t("cs_points").map((p) => (
                <li key={p}>
                  <Ico name="check" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="cs-cards">
            {cards.map(([icon, tone, value, href], i) => (
              <a key={icon} className="cs-card" href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                <span className={`cs-card-ic ${tone}`}>
                  <Ico name={icon} />
                </span>
                <span>
                  <b>{t("cs_cards")[i]}</b>
                  <small>{value}</small>
                </span>
              </a>
            ))}
            <div className="cs-card cs-office">
              <span className="cs-card-ic or">
                <Ico name="pin" />
              </span>
              <span>
                <b>{t("cs_cards")[3]}</b>
                {CONTACT.offices.map((address, i) => (
                  <span key={address} className="cs-office-item">
                    <em>{t("office_names")[i]}</em>
                    <a href={mapsHref(address)} target="_blank" rel="noopener noreferrer">
                      {address}
                    </a>
                  </span>
                ))}
              </span>
            </div>
          </div>

          <h2 className="cs-faq-title">{t("faq_title")}</h2>
          <div className="cs-faq">
            {t("faq").map(([q, a], i) => {
              const open = openFaq === i;
              return (
                <div key={q} className={`cs-q${open ? " open" : ""}`}>
                  <button type="button" aria-expanded={open} onClick={() => setOpenFaq(open ? -1 : i)}>
                    {q}
                    <span aria-hidden="true">{open ? "−" : "+"}</span>
                  </button>
                  {open && <p>{a}</p>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="cs-form-card">
          {status === "done" ? (
            <Sent title={t("m_done")} text={t("m_done_sub")} again={t("c_again")} onAgain={() => setStatus("idle")} />
          ) : (
            <form onSubmit={submit} noValidate>
              <h3 className="cs-form-title">{t("m_title")}</h3>
              <p className="cs-form-sub">{t("m_sub")}</p>

              <div className={`cs-field${errors.name ? " bad" : ""}`}>
                <label htmlFor="cs-name">{t("m_name")}</label>
                <input id="cs-name" ref={nameRef} autoComplete="name" placeholder={t("cs_name_ph")} value={form.name} onChange={update("name")} />
                <div className="err">{t("e_name")}</div>
              </div>
              <div className={`cs-field${errors.phone ? " bad" : ""}`}>
                <label htmlFor="cs-phone">{t("m_phone")}</label>
                <div className="ct-phone">
                  <span>+91</span>
                  <input id="cs-phone" ref={phoneRef} inputMode="numeric" autoComplete="tel-national" value={form.phone} onChange={update("phone")} />
                </div>
                <div className="err">{t("e_phone")}</div>
              </div>
              <div className="cs-field">
                <label htmlFor="cs-role">{t("m_role")}</label>
                <select id="cs-role" value={form.role} onChange={update("role")}>
                  {t("roles").map((r, i) => (
                    <option key={i} value={i}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div className="cs-field">
                <label htmlFor="cs-cons">{t("m_cons")}</label>
                <input id="cs-cons" placeholder={t("cs_cons_ph")} value={form.constituency} onChange={update("constituency")} />
              </div>
              <div className="cs-field">
                <label htmlFor="cs-msg">{t("cs_msg")}</label>
                <textarea id="cs-msg" rows={3} value={form.message} onChange={update("message")} />
              </div>

              {status === "error" && <p className="ct-submit-err">{t("e_submit")}</p>}
              <button type="submit" className="cs-send" disabled={status === "sending"}>
                {status === "sending" ? t("sending") : t("cs_submit")}
                <Ico name="arrow" />
              </button>
              <p className="cs-note">{t("cs_note")}</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
