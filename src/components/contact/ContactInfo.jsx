import { useLang } from "../../i18n/LanguageContext.jsx";
import { CONTACT, mapsHref } from "../../config/contact.js";
import { Ico } from "./shared.jsx";
import indiaGate from "../../assets/contact/india-gate.jpg";
import charminar from "../../assets/contact/charminar.jpg";
import officeBuilding from "../../assets/contact/office-building.jpg";

// Photos from Wikimedia Commons; the CC BY-SA ones need this credit shown on the page.
const OFFICE_PHOTOS = [
  { src: indiaGate, alt: "India Gate, New Delhi", credit: "Nikhilb239, CC BY-SA 4.0" },
  { src: charminar, alt: "Charminar, Hyderabad", credit: "Ravi Dwivedi, CC BY-SA 4.0" },
];
const OFFICE_TONES = ["delhi", "hyd"];
const CHANNEL_TONES = ["call", "wa", "mail"];

// Mon–Sat 9:30–18:30 in India time, matching CONTACT.hoursTime.
function officeOpenNow() {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const minutes = now.getHours() * 60 + now.getMinutes();
  return now.getDay() !== 0 && minutes >= 570 && minutes < 1110;
}

// Left side of the Contact page: heading, call/WhatsApp/email, both offices and office timings.
export default function ContactInfo() {
  const { t, lang } = useLang();
  const open = officeOpenNow();

  const channels = [
    ["phone", CONTACT.phone, CONTACT.phoneHref],
    ["chat", CONTACT.phone, CONTACT.whatsappHref],
    ["mail", CONTACT.email, `mailto:${CONTACT.email}`],
  ];

  return (
    <div className="ci">
      <div>
        <p className="ct-eyebrow">{t("c_eyebrow")}</p>
        <h1 className="ct-serif">{t("c_title")}</h1>
        <p className="ci-lead">{t("c_lead")}</p>
      </div>

      <div className="ci-quick">
        {channels.map(([icon, value, href], i) => {
          const [title, sub] = t("r_channels")[i];
          const external = href.startsWith("http");
          return (
            <a key={icon} className={`ci-qc ci-${CHANNEL_TONES[i]}`} href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
              <span className="ci-qc-ic">
                <Ico name={icon} />
              </span>
              <small>
                {title} · {sub}
              </small>
              <b className="num">{value}</b>
            </a>
          );
        })}
      </div>

      <div className="ci-offices">
        <img className="ci-building" src={officeBuilding} alt="" />
        <div className="ci-offices-head">
          <span className="ci-pin">
            <Ico name="pin" />
          </span>
          <div>
            <h3>{t("r_offices_title")}</h3>
            <p>{t("r_offices_sub")}</p>
          </div>
        </div>

        <div className="ci-office-list">
          {CONTACT.offices.map((address, i) => (
            <a key={address} className={`ci-office ci-${OFFICE_TONES[i]}`} href={mapsHref(address)} target="_blank" rel="noopener noreferrer">
              <img src={OFFICE_PHOTOS[i].src} alt={OFFICE_PHOTOS[i].alt} />
              <div className="ci-office-name">
                <h4>{t("office_names")[i]}</h4>
                <small>{t("office_subs")[i]}</small>
              </div>
              <span className="ci-city">{CONTACT.officeCities[i]}</span>
              <p className="ci-address">
                <Ico name="pin" />
                {/* Telugu page shows the Telugu address; the Maps link always uses the English one. */}
                <span>{lang === "te" ? t("office_addresses")[i] : address}</span>
              </p>
            </a>
          ))}
        </div>

        <div className="ci-hours">
          <span className="ci-clock">
            <Ico name="clock" />
          </span>
          <div>
            <small>{t("ci_timings")}</small>
            <b>
              {t("ci_days")} · <span className="num">{CONTACT.hoursTime}</span>
            </b>
            <em>{t("ci_sunday")}</em>
          </div>
          <span className={`ci-live ${open ? "open" : "closed"}`}>{open ? t("ci_open") : t("ci_closed")}</span>
        </div>
        <p className="ci-credit">Photos: {OFFICE_PHOTOS.map((p) => p.credit).join(" · ")} · Syced, CC0 · Wikimedia Commons</p>
      </div>
    </div>
  );
}
