import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { useLang } from "../../i18n/LanguageContext.jsx";
import { CONTACT } from "../../config/contact.js";
import { submitContactMessage } from "../../services/api.js";
import { Ico, Sent, digits10, nameOk, phoneOk } from "./shared.jsx";

// Callback slots sent in the email, in English whatever the page language.
const SLOT_NAMES = ["Right now", "Morning 10–12", "Afternoon 2–5", "Evening 5–8"];

// "Skip the form, WhatsApp us": chat link + QR code, callback request and a phone chat mockup.
export default function WhatsAppSection() {
  const { t, lang } = useLang();
  const [qrSvg, setQrSvg] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", slot: 0 });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const nameRef = useRef(null);
  const phoneRef = useRef(null);

  const chatHref = `${CONTACT.whatsappHref}?text=${encodeURIComponent(t("w_prefill"))}`;

  // The QR code holds just the chat link (no pre-typed text) so it stays simple enough to scan.
  useEffect(() => {
    let cancelled = false;
    QRCode.toString(CONTACT.whatsappHref, { type: "svg", margin: 0, color: { dark: "#1d5e30", light: "#ffffff" } })
      .then((svg) => !cancelled && setQrSvg(svg))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const bad = { name: !nameOk(form.name), phone: !phoneOk(form.phone) };
    setErrors(bad);
    if (bad.name) return nameRef.current.focus();
    if (bad.phone) return phoneRef.current.focus();

    setStatus("sending");
    try {
      await submitContactMessage({
        desk: "Callback",
        name: form.name.trim(),
        phone: form.phone,
        time: SLOT_NAMES[form.slot],
        language: lang,
      });
      setForm({ name: "", phone: "", slot: 0 });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  const [l1, hl, l2, l3] = t("w_title");
  const chat = t("chat");

  return (
    <section className="ws">
      <div className="ws-blob" aria-hidden="true" />
      <div className="ws-wrap">
        <div className="ws-left">
          <span className="ws-brand">
            Neta<b>360</b>
          </span>
          <h2 className="ws-title">
            {l1}
            <br />
            <em>{hl}</em>
            {l2}
            <br />
            {l3}
          </h2>
          <p className="ws-lead">{t("w_lead")}</p>

          <div className="ws-actions">
            <a className="ws-chat-btn" href={chatHref} target="_blank" rel="noopener noreferrer">
              <Ico name="chat" />
              {t("w_btn")}
            </a>
            <div className="ws-qr" aria-label="WhatsApp QR code" dangerouslySetInnerHTML={{ __html: qrSvg }} />
            <small className="ws-scan">{t("w_scan")}</small>
          </div>

          <div className="ws-card">
            {status === "done" ? (
              <Sent title={t("cb_done")} text={t("cb_done_sub")} again={t("c_again")} onAgain={() => setStatus("idle")} />
            ) : (
              <form onSubmit={submit} noValidate>
                <div className="ws-card-head">
                  <h3>{t("cb_title")}</h3>
                  <small>{t("cb_alt")}</small>
                </div>
                <div className="ws-row">
                  <div className={`cs-field${errors.name ? " bad" : ""}`}>
                    <label htmlFor="ws-name">{t("m_name")}</label>
                    <input id="ws-name" ref={nameRef} autoComplete="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                    <div className="err">{t("e_name")}</div>
                  </div>
                  <div className={`cs-field${errors.phone ? " bad" : ""}`}>
                    <label htmlFor="ws-phone">{t("cb_phone")}</label>
                    <div className="ct-phone">
                      <span>+91</span>
                      <input id="ws-phone" ref={phoneRef} inputMode="numeric" autoComplete="tel-national" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: digits10(e.target.value) }))} />
                    </div>
                    <div className="err">{t("e_phone")}</div>
                  </div>
                </div>
                <p className="ws-when">{t("cb_when")}</p>
                <div className="ws-slots" role="group" aria-label={t("cb_when")}>
                  {t("cb_slots").map((slot, i) => (
                    <button key={i} type="button" className="ct-tab" aria-pressed={form.slot === i} onClick={() => setForm((f) => ({ ...f, slot: i }))}>
                      {slot}
                    </button>
                  ))}
                </div>
                {status === "error" && <p className="ct-submit-err">{t("e_submit")}</p>}
                <button type="submit" className="cs-send" disabled={status === "sending"}>
                  {status === "sending" ? t("sending") : t("cb_send")}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="ws-phone-area" aria-hidden="true">
          <div className="ws-circle" />
          <div className="ws-phone">
            <div className="ws-screen">
              <div className="ws-chat-head">
                <span className="ws-avatar">360</span>
                <span>
                  <b>{chat.team}</b>
                  <small>{chat.online}</small>
                </span>
              </div>
              <div className="ws-msgs">
                <p className="in">{chat.bot1}</p>
                <p className="out">{chat.user}</p>
                <p className="in">{chat.bot2}</p>
                <div className="ws-replies">
                  {chat.replies.map((r) => (
                    <span key={r}>{r}</span>
                  ))}
                </div>
              </div>
              <div className="ws-input">
                <span>{chat.input}</span>
                <i>
                  <Ico name="send" />
                </i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
