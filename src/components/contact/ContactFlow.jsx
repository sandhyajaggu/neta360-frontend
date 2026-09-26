import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { useLang } from "../../i18n/LanguageContext.jsx";
import en from "../../i18n/en.json";
import { CONTACT } from "../../config/contact.js";
import { CONSTITUENCIES, DISTRICTS, POPULAR_STATES, STATES, UNION_TERRITORIES } from "../../data/india.js";
import { submitContactMessage } from "../../services/api.js";
import { Ico, digits10, nameOk, phoneOk } from "./shared.jsx";

const TIMES = ["10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"];
const OTHER = "__other";
const OPTIONS = [
  ["callback", "phone"],
  ["wa", "chat"],
  ["demo", "video"],
  ["msg", "mail"],
];
const EMPTY = { name: "", phone: "", role: "", state: "", district: "", districtText: "", cons: "", consText: "", consent: false };

// The next 6 working days (the office is closed on Sunday), starting tomorrow.
function workingDays() {
  const days = [];
  const d = new Date();
  while (days.length < 6) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) days.push(new Date(d));
  }
  return days;
}

// A dropdown for the state's list with an "Other" choice that reveals a text box,
// or just the text box when there is no list for that state.
function ListOrText({ id, list, value, text, onValue, onText, placeholder, typePlaceholder, disabledText, disabled, t }) {
  if (!disabled && !list) {
    return <input id={id} placeholder={typePlaceholder} value={text} onChange={onText} />;
  }
  return (
    <>
      <select id={id} value={value} onChange={onValue} disabled={disabled}>
        <option value="">{disabled ? disabledText : placeholder}</option>
        {list?.map((item) => (
          <option key={item}>{item}</option>
        ))}
        {list && <option value={OTHER}>{t("cf_other")}</option>}
      </select>
      {value === OTHER && <input className="cf-other" placeholder={typePlaceholder} value={text} onChange={onText} autoFocus />}
    </>
  );
}

// Right side of the Contact page: details → how to reach you → callback / WhatsApp / demo / message.
export default function ContactFlow() {
  const { t, lang } = useLang();
  const [step, setStep] = useState("details"); // details | choose | callback | demo | wa | msg | done
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [day, setDay] = useState(null);
  const [time, setTime] = useState(null);
  const [mode, setMode] = useState(0);
  const [topic, setTopic] = useState(0);
  const [message, setMessage] = useState({ email: "", text: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | error
  const [done, setDone] = useState(null);
  const [qrSvg, setQrSvg] = useState("");
  const cardRef = useRef(null);

  const days = useMemo(workingDays, []);
  const locale = lang === "te" ? "te-IN" : "en-IN";
  const district = form.district === OTHER || !DISTRICTS[form.state] ? form.districtText.trim() : form.district;
  const constituency = form.cons === OTHER || !CONSTITUENCIES[form.state] ? form.consText.trim() : form.cons;
  const place = [constituency, district, form.state].filter(Boolean).join(", ");

  const waText = [
    t("cf_wa_intro"),
    `${t("c_name")}: ${form.name.trim()}`,
    form.role !== "" && `${t("c_role")}: ${t("c_roles")[form.role]}`,
    `${t("c_cons")}: ${place}`,
  ]
    .filter(Boolean)
    .join("\n");

  // The QR code holds just the chat link so it stays easy to scan.
  useEffect(() => {
    let cancelled = false;
    QRCode.toString(CONTACT.whatsappHref, { type: "svg", margin: 0, color: { dark: "#1d5e30", light: "#ffffff" } })
      .then((svg) => !cancelled && setQrSvg(svg))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const go = (next) => {
    setStep(next);
    setStatus("idle");
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const update = (field) => (e) => {
    let value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    if (field === "phone") value = digits10(value);
    setForm((f) => {
      const next = { ...f, [field]: value };
      // A new state means new district and constituency lists.
      if (field === "state") Object.assign(next, { district: "", districtText: "", cons: "", consText: "" });
      return next;
    });
  };

  const submitDetails = (e) => {
    e.preventDefault();
    const bad = {
      name: !nameOk(form.name),
      phone: !phoneOk(form.phone),
      role: form.role === "",
      state: !form.state,
      district: !district,
      cons: !constituency,
      consent: !form.consent,
    };
    setErrors(bad);
    const firstBad = Object.keys(bad).find((k) => bad[k]);
    if (firstBad) return document.getElementById(`cf-${firstBad}`)?.focus();
    go("choose");
  };

  const pickOption = (option) => {
    setDay(null);
    setTime(null);
    go(option);
  };

  // Everything is sent in English so the team's emails read the same whatever the page language.
  const base = () => ({
    name: form.name.trim(),
    phone: form.phone,
    role: en.c_roles[form.role],
    state: form.state,
    district,
    constituency,
    language: lang,
  });
  const summary = () => [
    [t("c_name"), form.name.trim()],
    [t("c_phone"), `+91 ${form.phone}`],
    [t("c_cons"), `${constituency}, ${district}`],
    [t("cf_state"), form.state],
  ];

  const send = async (payload, result) => {
    setStatus("sending");
    try {
      await submitContactMessage({ ...base(), ...payload });
      setDone(result);
      go("done");
    } catch {
      setStatus("error");
    }
  };

  const confirmSlot = () => {
    const whenShown = `${days[day].toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" })}, ${TIMES[time]}`;
    const date = days[day].toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
    if (step === "demo") {
      send(
        { desk: "Demo booking", mode: en.cf_modes[mode], date, time: TIMES[time] },
        { title: t("cf_done_demo"), sub: t("cf_done_demo_sub"), rows: [...summary(), [t("cf_demo_type"), t("cf_modes")[mode]], [t("cf_when"), whenShown]] }
      );
    } else {
      send(
        { desk: "Callback", date, time: TIMES[time] },
        { title: t("cf_done_cb"), sub: t("cf_done_cb_sub").replace("{when}", whenShown), rows: [...summary(), [t("cf_when"), whenShown]] }
      );
    }
  };

  const sendMessage = () => {
    const bad = {
      msg: message.text.trim().length < 4,
      email: message.email.trim() !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(message.email.trim()),
    };
    setErrors(bad);
    if (bad.email || bad.msg) return document.getElementById(bad.email ? "cf-email" : "cf-msg")?.focus();
    send(
      { desk: en.cf_topics[topic], email: message.email.trim(), message: message.text.trim() },
      { title: t("cf_done_msg"), sub: t("cf_msg_sub"), rows: [...summary(), [t("cf_topic"), t("cf_topics")[topic]]] }
    );
  };

  const restart = () => {
    setForm(EMPTY);
    setMessage({ email: "", text: "" });
    setErrors({});
    go("details");
  };

  const stepNo = { details: 1, choose: 2 }[step] ?? 3;
  const chips = (
    <div className="cf-chips">
      <span>👤 {form.name.trim()}</span>
      <span className="num">📱 +91 {form.phone}</span>
      <span>📍 {place}</span>
    </div>
  );
  const back = (to) => (
    <button type="button" className="cf-btn ghost" onClick={() => go(to)}>
      {t("cf_back")}
    </button>
  );
  const sendError = status === "error" && <p className="cf-send-err">{t("e_submit")}</p>;
  const field = (name, label, input, full = false) => (
    <div className={`cf-field${full ? " full" : ""}${errors[name] ? " bad" : ""}`}>
      <label htmlFor={`cf-${name}`}>{label}</label>
      {input}
      <p className="err">{t(`e_${name}`)}</p>
    </div>
  );

  return (
    <div className="cf" ref={cardRef}>
      <ol className="cf-steps">
        {t("cf_steps").map((label, i) => (
          <li key={label} className={i < stepNo ? "on" : undefined}>
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      {step === "details" && (
        <form onSubmit={submitDetails} noValidate>
          <h2 className="ct-serif">{t("cf_title1")}</h2>
          <p className="cf-sub">{t("cf_sub1")}</p>
          <div className="cf-grid">
            {field("name", t("c_name"), <input id="cf-name" autoComplete="name" placeholder={t("c_name_ph")} value={form.name} onChange={update("name")} />)}
            {field(
              "phone",
              t("c_phone"),
              <div className="cf-phone">
                <span>+91</span>
                <input id="cf-phone" inputMode="numeric" autoComplete="tel-national" placeholder="98XXXXXXXX" value={form.phone} onChange={update("phone")} />
              </div>
            )}
            {field(
              "role",
              t("c_role"),
              <select id="cf-role" value={form.role} onChange={update("role")}>
                <option value="">{t("cf_select")}</option>
                {t("c_roles").map((role, i) => (
                  <option key={role} value={i}>
                    {role}
                  </option>
                ))}
              </select>,
              true
            )}
            {field(
              "state",
              t("cf_state"),
              <select id="cf-state" value={form.state} onChange={update("state")}>
                <option value="">{t("cf_state_ph")}</option>
                <optgroup label={t("cf_popular")}>
                  {POPULAR_STATES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </optgroup>
                <optgroup label={t("cf_states")}>
                  {STATES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </optgroup>
                <optgroup label={t("cf_uts")}>
                  {UNION_TERRITORIES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </optgroup>
              </select>
            )}
            {field(
              "district",
              t("cf_district"),
              <ListOrText
                id="cf-district"
                list={DISTRICTS[form.state]}
                value={form.district}
                text={form.districtText}
                onValue={update("district")}
                onText={update("districtText")}
                placeholder={t("cf_district_ph")}
                typePlaceholder={t("cf_district_type")}
                disabledText={t("cf_state_first")}
                disabled={!form.state}
                t={t}
              />
            )}
            {field(
              "cons",
              t("cf_cons"),
              <ListOrText
                id="cf-cons"
                list={CONSTITUENCIES[form.state]}
                value={form.cons}
                text={form.consText}
                onValue={update("cons")}
                onText={update("consText")}
                placeholder={t("cf_cons_ph")}
                typePlaceholder={t("cf_cons_type")}
                disabledText={t("cf_state_first")}
                disabled={!form.state}
                t={t}
              />,
              true
            )}
          </div>
          <div className={`cf-consent${errors.consent ? " bad" : ""}`}>
            <label>
              <input id="cf-consent" type="checkbox" checked={form.consent} onChange={update("consent")} />
              <span>{t("c_consent")}</span>
            </label>
            <p className="err">{t("e_consent")}</p>
          </div>
          <div className="cf-actions">
            <span />
            <button type="submit" className="cf-btn primary">
              {t("cf_next")}
            </button>
          </div>
        </form>
      )}

      {step === "choose" && (
        <>
          <h2 className="ct-serif">{t("cf_title2")}</h2>
          <p className="cf-sub">{t("cf_sub2")}</p>
          {chips}
          <div className="cf-options">
            {OPTIONS.map(([option, icon], i) => {
              const [title, text] = t("cf_options")[i];
              return (
                <button key={option} type="button" className={`cf-opt cf-opt-${option}`} onClick={() => pickOption(option)}>
                  <span className="cf-opt-ic">
                    <Ico name={icon} />
                  </span>
                  <b>{title}</b>
                  <span>{text}</span>
                </button>
              );
            })}
          </div>
          <div className="cf-actions">{back("details")}</div>
        </>
      )}

      {(step === "callback" || step === "demo") && (
        <>
          <h2 className="ct-serif">{step === "demo" ? t("cf_demo_title") : t("cf_cb_title")}</h2>
          <p className="cf-sub">{step === "demo" ? t("cf_demo_sub") : t("cf_cb_sub").replace("{phone}", form.phone)}</p>
          {chips}
          {step === "demo" && (
            <>
              <p className="cf-label">{t("cf_demo_type")}</p>
              <div className="cf-modes">
                {t("cf_modes").map((label, i) => (
                  <button key={label} type="button" className="cf-chip" aria-pressed={mode === i} onClick={() => setMode(i)}>
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}
          <p className="cf-label">{t("cf_date")}</p>
          <div className="cf-days">
            {days.map((d, i) => (
              <button key={d.toISOString()} type="button" className="cf-day" aria-pressed={day === i} onClick={() => setDay(i)}>
                <small>{d.toLocaleDateString(locale, { weekday: "short" })}</small>
                <b className="num">{d.getDate()}</b>
                <small>{d.toLocaleDateString(locale, { month: "short" })}</small>
              </button>
            ))}
          </div>
          <p className="cf-label">{t("cf_time")}</p>
          <div className="cf-times">
            {TIMES.map((slot, i) => (
              <button key={slot} type="button" className="cf-chip num" aria-pressed={time === i} onClick={() => setTime(i)}>
                {slot}
              </button>
            ))}
          </div>
          {sendError}
          <div className="cf-actions">
            {back("choose")}
            <button type="button" className="cf-btn primary" disabled={day === null || time === null || status === "sending"} onClick={confirmSlot}>
              {status === "sending" ? t("sending") : step === "demo" ? t("cf_confirm_demo") : t("cf_confirm_cb")}
            </button>
          </div>
        </>
      )}

      {step === "wa" && (
        <>
          <h2 className="ct-serif">{t("cf_wa_title")}</h2>
          <p className="cf-sub">{t("cf_wa_sub")}</p>
          <div className="cf-wa">
            <div className="cf-wa-top">
              <span className="cf-wa-av">N360</span>
              <div>
                <b>Neta360</b>
                <small>{t("cf_wa_status")}</small>
              </div>
            </div>
            <div className="cf-wa-chat">
              <div className="cf-bubble">{t("cf_wa_hello")}</div>
              <div className="cf-bubble me">{waText}</div>
            </div>
          </div>
          <div className="cf-wa-foot">
            <div className="cf-qr" aria-label="WhatsApp QR code" dangerouslySetInnerHTML={{ __html: qrSvg }} />
            <p>{t("cf_wa_qr")}</p>
          </div>
          <div className="cf-actions">
            {back("choose")}
            <a className="cf-btn wa" href={`${CONTACT.whatsappHref}?text=${encodeURIComponent(waText)}`} target="_blank" rel="noopener noreferrer">
              <Ico name="chat" />
              {t("cf_wa_open")}
            </a>
          </div>
        </>
      )}

      {step === "msg" && (
        <>
          <h2 className="ct-serif">{t("cf_msg_title")}</h2>
          <p className="cf-sub">{t("cf_msg_sub")}</p>
          {chips}
          <p className="cf-label">{t("cf_topic")}</p>
          <div className="cf-modes">
            {t("cf_topics").map((label, i) => (
              <button key={label} type="button" className="cf-chip" aria-pressed={topic === i} onClick={() => setTopic(i)}>
                {label}
              </button>
            ))}
          </div>
          <div className="cf-grid">
            {field(
              "email",
              t("cf_email_opt"),
              <input id="cf-email" type="email" autoComplete="email" placeholder="name@office.in" value={message.email} onChange={(e) => setMessage((m) => ({ ...m, email: e.target.value }))} />,
              true
            )}
            {field(
              "msg",
              t("c_msg"),
              <textarea id="cf-msg" rows={3} placeholder={t("c_msg_ph")} value={message.text} onChange={(e) => setMessage((m) => ({ ...m, text: e.target.value }))} />,
              true
            )}
          </div>
          {sendError}
          <div className="cf-actions">
            {back("choose")}
            <button type="button" className="cf-btn primary" disabled={status === "sending"} onClick={sendMessage}>
              {status === "sending" ? t("sending") : t("cf_send")}
            </button>
          </div>
        </>
      )}

      {step === "done" && done && (
        <div className="cf-done" role="status">
          <span className="cf-tick">
            <Ico name="check" />
          </span>
          <h2 className="ct-serif">{done.title}</h2>
          <p className="cf-sub">{done.sub}</p>
          <ul>
            {done.rows.map(([label, value]) => (
              <li key={label}>
                <span>{label}</span>
                <b>{value}</b>
              </li>
            ))}
          </ul>
          <button type="button" className="cf-btn ghost" onClick={restart}>
            {t("cf_restart")}
          </button>
        </div>
      )}
    </div>
  );
}
