import { useEffect, useRef, useState } from "react";
import { useLang } from "../i18n/LanguageContext.jsx";
import { submitDemoRequest, whatsappDemoLink } from "../services/api.js";

const EMPTY = { name: "", phone: "", constituency: "", role: 0 };

export default function DemoModal({ open, onClose }) {
  const { t, lang } = useLang();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [waLink, setWaLink] = useState(null);
  const nameRef = useRef(null);
  const phoneRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement;
    setStatus("idle");
    setErrors({});
    const focusTimer = setTimeout(() => nameRef.current?.focus(), 30);
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const update = (field) => (e) => {
    const value = field === "phone" ? e.target.value.replace(/\D/g, "").slice(0, 10) : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const submit = async () => {
    const nameOk = form.name.trim().length > 1;
    const phoneOk = /^[6-9]\d{9}$/.test(form.phone);
    setErrors({ name: !nameOk, phone: !phoneOk });
    if (!nameOk) return nameRef.current.focus();
    if (!phoneOk) return phoneRef.current.focus();

    setStatus("sending");
    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone,
        constituency: form.constituency.trim(),
        role: t("roles")[form.role],
        language: lang,
      };
      await submitDemoRequest(payload);
      setWaLink(whatsappDemoLink(payload));
      setForm(EMPTY);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="modal open" role="dialog" aria-modal="true" aria-labelledby="demo-title" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dialog">
        <button className="close" onClick={onClose} aria-label="Close">
          ×
        </button>

        {status === "done" ? (
          <div className="done">
            <div className="ic">
              <svg className="i" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path d="M8 12.5l2.5 2.5L16 9.5" />
              </svg>
            </div>
            <h3>{t("m_done")}</h3>
            <p style={{ color: "var(--muted)", margin: "6px 0 16px" }}>{t("m_done_sub")}</p>
            {waLink && (
              <a className="btn btn-dark" href={waLink} target="_blank" rel="noopener noreferrer" style={{ marginRight: 8 }}>
                {t("m_whatsapp")}
              </a>
            )}
            <button className="btn btn-line" onClick={onClose}>
              {t("m_close")}
            </button>
          </div>
        ) : (
          <div>
            <h3 id="demo-title">{t("m_title")}</h3>
            <p>{t("m_sub")}</p>

            <div className={`field${errors.name ? " bad" : ""}`}>
              <label htmlFor="demo-name">{t("m_name")}</label>
              <input id="demo-name" ref={nameRef} autoComplete="name" value={form.name} onChange={update("name")} />
              <div className="err">{t("e_name")}</div>
            </div>

            <div className={`field${errors.phone ? " bad" : ""}`}>
              <label htmlFor="demo-phone">{t("m_phone")}</label>
              <input id="demo-phone" ref={phoneRef} inputMode="numeric" placeholder="98XXXXXXXX" value={form.phone} onChange={update("phone")} />
              <div className="err">{t("e_phone")}</div>
            </div>

            <div className="field">
              <label htmlFor="demo-cons">{t("m_cons")}</label>
              <input id="demo-cons" value={form.constituency} onChange={update("constituency")} />
            </div>

            <div className="field">
              <label htmlFor="demo-role">{t("m_role")}</label>
              <select id="demo-role" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: Number(e.target.value) }))}>
                {t("roles").map((role, i) => (
                  <option key={i} value={i}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {status === "error" && <p style={{ color: "#c0362c", fontSize: 13.5, margin: "0 0 10px" }}>{t("e_submit")}</p>}

            <button className="btn btn-dark" style={{ width: "100%", marginTop: 4 }} onClick={submit} disabled={status === "sending"}>
              {status === "sending" ? t("sending") : t("m_send")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
