import { useState } from "react";
import { useLang } from "../../i18n/LanguageContext.jsx";
import { CONTACT, mapsHref } from "../../config/contact.js";
import ContactForm from "./ContactForm.jsx";
import CallSection from "./CallSection.jsx";
import WhatsAppSection from "./WhatsAppSection.jsx";
import BookingSection from "./BookingSection.jsx";
import { Ico } from "./shared.jsx";

const DESK_CARDS = [
  ["monitor", CONTACT.desks.demo],
  ["lifebuoy", CONTACT.desks.support],
  ["handshake", CONTACT.desks.partnership],
  ["news", CONTACT.desks.media],
];

export default function ContactPage() {
  const { t } = useLang();
  const [desk, setDesk] = useState(0);

  // Desk card links pick the matching tab in the form above and scroll back up to it.
  const pickDesk = (i) => (e) => {
    e.preventDefault();
    setDesk(i);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const details = [
    ["phone", t("c_call"), CONTACT.phone, CONTACT.phoneHref],
    ["chat", t("c_whatsapp"), CONTACT.phone, CONTACT.whatsappHref],
    ["mail", t("c_email"), CONTACT.email, `mailto:${CONTACT.email}`],
  ];

  return (
    <div className="ct">
      <section className="ct-hero">
        <div className="ct-info">
          <p className="ct-eyebrow">{t("c_eyebrow")}</p>
          <h1 className="ct-serif">{t("c_title")}</h1>
          <p className="ct-alt">{t("c_title_alt")}</p>
          <p className="ct-lead">{t("c_lead")}</p>

          <ul className="ct-details">
            {details.map(([icon, label, value, href]) => (
              <li key={icon}>
                <span className="ct-ic">
                  <Ico name={icon} />
                </span>
                <div>
                  <small>{label}</small>
                  <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                    {value}
                  </a>
                </div>
              </li>
            ))}
            <li>
              <span className="ct-ic">
                <Ico name="pin" />
              </span>
              <div>
                {CONTACT.offices.map((address, i) => (
                  <div key={address} className="ct-office">
                    <small>{t("office_names")[i]}</small>
                    <a href={mapsHref(address)} target="_blank" rel="noopener noreferrer">
                      {address}
                    </a>
                  </div>
                ))}
                <em>{CONTACT.hours}</em>
              </div>
            </li>
          </ul>
        </div>

        <div className="ct-form-side">
          <ContactForm desk={desk} onDesk={setDesk} />
        </div>
      </section>

      <section className="ct-desks">
        <p className="ct-eyebrow">{t("c2_eyebrow")}</p>
        <h2 className="ct-serif">{t("c2_title")}</h2>
        <p className="ct-desks-sub">{t("c2_sub")}</p>

        <div className="ct-cards">
          {t("c2_desks").map(([title, text, link], i) => (
            <article key={title} className="ct-card">
              <span className="ct-card-ic">
                <Ico name={DESK_CARDS[i][0]} />
              </span>
              <h3 className="ct-serif">{title}</h3>
              <p>{text}</p>
              <a className="ct-card-mail" href={`mailto:${DESK_CARDS[i][1]}`}>
                {DESK_CARDS[i][1]}
              </a>
              <a className="ct-card-link" href="#/contact" onClick={pickDesk(i)}>
                {link} →
              </a>
            </article>
          ))}
        </div>
      </section>

      <CallSection />
      <WhatsAppSection />
      <BookingSection />
    </div>
  );
}
