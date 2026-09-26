import { Fragment, useEffect, useState } from "react";
import QRCode from "qrcode";
import { useLang } from "../../i18n/LanguageContext.jsx";
import { CONTACT } from "../../config/contact.js";
import { AMC_FEES, COMPARISON, IMPLEMENTATION_FEES, PLANS } from "../../data/pricing.js";
import markImg from "../../assets/logo-mark.png";
import wordImg from "../../assets/logo-word.png";
import markLight from "../../assets/logo-mark-light.png";
import wordLight from "../../assets/logo-word-light.png";

const ICONS = {
  check: (
    <>
      <circle cx="12" cy="12" r="9" fill="currentColor" stroke="none" />
      <path d="M8 12.5l2.7 2.7L16.5 9.5" stroke="#fff" strokeWidth="2.4" />
    </>
  ),
  tag: (
    <>
      <path d="M3 12V4h8l10 10-8 8z" />
      <circle cx="7.5" cy="8.5" r="1.5" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" />
    </>
  ),
  cal: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4M8 14h2M12 14h2M8 17h2" />
    </>
  ),
  head: (
    <>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <rect x="3" y="14" width="4" height="6" rx="1.5" />
      <rect x="17" y="14" width="4" height="6" rx="1.5" />
    </>
  ),
  layers: <path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5" />,
  bulb: <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z" />,
  doc: <path d="M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2 20a7 7 0 0 1 14 0M16 4.5a3.5 3.5 0 0 1 0 7M18 13.5a7 7 0 0 1 4 6.5" />
    </>
  ),
  building: <path d="M4 21V8l8-5 8 5v13M9 21v-6h6v6M8 11h1M15 11h1M3 21h18" />,
  star: <path d="M12 3l2.8 5.8 6.2.9-4.5 4.4 1 6.3L12 17.5 6.5 20.4l1-6.3L3 9.7l6.2-.9z" fill="currentColor" />,
  crown: <path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" fill="currentColor" />,
  flag: <path d="M5 21V4M5 4h11l-2 4 2 4H5" />,
  id: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="12" r="2.5" />
      <path d="M14 10h4M14 14h4" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  chat: <path d="M20 12a8 8 0 0 1-11.8 7L4 20l1.1-4A8 8 0 1 1 20 12z" />,
  sms: <path d="M3 4h18v13H8l-4 4V4zM7 9h10M7 12h6" />,
  gift: <path d="M3 8h18v4H3zM5 12v9h14v-9M12 8v13M12 8S9 3 7 5s5 3 5 3 3-5 5-3-5 3-5 3" />,
  mega: <path d="M3 10v4h4l6 5V5L7 10zM17 8a5 5 0 0 1 0 8" />,
  ai: (
    <>
      <rect x="5" y="5" width="14" height="14" rx="3" />
      <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3M9.5 15l1.5-6h2l1.5 6M10 13h4" />
    </>
  ),
  brain: <path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 0V4.5A2.5 2.5 0 0 0 9 4zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 0" />,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
  mail: <path d="M3 5h18v14H3zM3.5 6.5 12 13l8.5-6.5" />,
  spark: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" />
    </>
  ),
  shield: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4" />,
  bars: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
};

function Ico({ name, className = "i" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

const Check = () => <Ico name="check" className="i pr-ck" />;

// "**₹0.35 – ₹0.60** / msg" → the part between ** in bold.
function Rich({ text }) {
  return text.split("**").map((part, i) => (i % 2 ? <b key={i}>{part}</b> : <Fragment key={i}>{part}</Fragment>));
}

function SectionHead({ icon, title, children }) {
  return (
    <div className="pr-sh">
      <span className="pr-sh-ic">
        <Ico name={icon} />
      </span>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

const STAT_ICONS = [
  ["user", "#f26a0f"],
  ["id", "#1d7a3e"],
  ["pin", "#7c3aed"],
  ["users", "#0f8f7e"],
  ["chat", "#ff9a3d"],
  ["gift", "#2ea55a"],
  ["mega", "#e11d48"],
  ["ai", "#2563eb"],
];
const ADDONS = [
  ["wa", "chat"],
  ["sms", "sms"],
  ["gis", "pin"],
  ["ai", "brain"],
];
const TABLE_TONES = ["b", "p", "m", "e", "s"];
const PILLAR_ICONS = ["spark", "shield", "bars"];

export default function PricingPage({ onDemo }) {
  const { t } = useLang();
  const p = t("pricing");
  const [qrSvg, setQrSvg] = useState("");
  const site = `https://${CONTACT.website}`;

  useEffect(() => {
    let cancelled = false;
    QRCode.toString(site, { type: "svg", margin: 0, color: { dark: "#0d4a23", light: "#ffffff" } })
      .then((svg) => !cancelled && setQrSvg(svg))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [site]);

  const cell = (value) => {
    if (value === true) return <Ico name="check" className="i pr-yes" />;
    if (value === false) return <span className="pr-dash">–</span>;
    return <span className={`pr-lvl${value === "adv" || value === "unlimited" ? " adv" : ""}`}>{p.levels[value]}</span>;
  };

  const feeTable = (fees, feeLabel) => (
    <table className="pr-mini">
      <thead>
        <tr>
          <th>{p.package}</th>
          <th>{feeLabel}</th>
        </tr>
      </thead>
      <tbody>
        {fees.map((fee, i) => (
          <tr key={i}>
            <td>{p.plans[i].name}</td>
            <td className="num">{fee}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="pr">
      {/* 1. banner */}
      <div className="pr-hero">
        <div className="wrap pr-hero-in">
          <div className="pr-hero-logo">
            <img className="mk" src={markLight} alt="" />
            <div>
              <img className="wd" src={wordLight} alt="Neta360" />
              <small>{p.tagline}</small>
            </div>
          </div>
          <div>
            <h1>
              {p.title[0]}
              <br />
              <span>{p.title[1]}</span> {p.title[2]}
            </h1>
            <p className="pr-tag">
              {p.tag.map((word, i) => (
                <Fragment key={word}>
                  {i > 0 && <b> • </b>}
                  {word}
                </Fragment>
              ))}
            </p>
          </div>
          <div className="pr-phone" aria-hidden="true">
            <div>
              <img src={wordImg} alt="" />
              <small>{p.phone}</small>
            </div>
          </div>
        </div>
        <div className="pr-stats">
          <div className="wrap pr-stats-in">
            {p.stats.map(([title, sub], i) => (
              <div key={i} className="pr-stat">
                <span style={{ background: STAT_ICONS[i][1] }}>
                  <Ico name={STAT_ICONS[i][0]} />
                </span>
                <div>
                  <b>{title}</b>
                  <small>{sub}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="wrap pr-body">
        {/* 2. packages */}
        <section className="pr-sec">
          <SectionHead icon="tag" title={p.plans_title}>
            <p>{p.plans_sub}</p>
          </SectionHead>
          <div className="pr-plans">
            {PLANS.map((plan, i) => {
              const text = p.plans[i];
              return (
                <article key={plan.tone} className={`pr-plan ${plan.tone}${plan.highlight ? " hl" : ""}`}>
                  {plan.highlight && <span className="pr-ribbon">{p.best_value}</span>}
                  <div className="pr-plan-top">
                    <Ico name={plan.icon} className="i pr-plan-ic" />
                    <h3>{text.name}</h3>
                    <small>{text.sub}</small>
                  </div>
                  <div className="pr-price">
                    <b className="num">{plan.price}</b> <span>{p.per_year}</span>
                  </div>
                  <ul>
                    {text.feats.map((feat) => (
                      <li key={feat}>
                        <Check />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <div className="pr-plan-foot">{text.foot}</div>
                  <a className="pr-quote" href="#/contact">
                    {p.quote_btn}
                  </a>
                </article>
              );
            })}
          </div>
        </section>

        {/* 3. comparison + charges */}
        <section className="pr-sec pr-two">
          <div>
            <SectionHead icon="grid" title={p.cmp_title} />
            <div className="pr-card pr-cmp">
              <table>
                <thead>
                  <tr>
                    <th>{p.cmp_features}</th>
                    {p.plans.map((plan, i) => (
                      <th key={i} className={TABLE_TONES[i]}>
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((values, r) => (
                    <tr key={r}>
                      <td>{p.cmp_rows[r]}</td>
                      {values.map((value, i) => (
                        <td key={i} className={i === 2 ? "m" : undefined}>
                          {cell(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pr-side">
            <div>
              <SectionHead icon="gear" title={p.impl_title} />
              <div className="pr-card">
                {feeTable(IMPLEMENTATION_FEES, p.impl_fee)}
                <p className="pr-note">{p.impl_note}</p>
              </div>
            </div>
            <div>
              <SectionHead icon="cal" title={p.inc_title} />
              <ul className="pr-card pr-inc">
                {p.inc.map((item) => (
                  <li key={item}>
                    <Check />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <SectionHead icon="head" title={p.amc_title}>
                <span className="pr-after">{p.amc_after}</span>
              </SectionHead>
              <div className="pr-card">{feeTable(AMC_FEES, p.amc_fee)}</div>
            </div>
          </div>
        </section>

        {/* 4. add-ons + why */}
        <section className="pr-sec pr-two">
          <div>
            <SectionHead icon="layers" title={p.addons_title} />
            <div className="pr-addons">
              {p.addons.map(([title, items], i) => (
                <div key={ADDONS[i][0]} className={`pr-addon ${ADDONS[i][0]}`}>
                  <h4>
                    <Ico name={ADDONS[i][1]} />
                    {title}
                  </h4>
                  <ul>
                    {items.map((item) => (
                      <li key={item}>
                        <Rich text={item} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div>
            <SectionHead icon="bulb" title={p.why_title} />
            <div className="pr-card pr-why">
              <ul>
                {p.why.map((item) => (
                  <li key={item}>
                    <Check />
                    {item}
                  </li>
                ))}
              </ul>
              <blockquote>{p.why_quote}</blockquote>
            </div>
          </div>
        </section>

        {/* 5. terms row */}
        <section className="pr-sec pr-terms">
          <div>
            <SectionHead icon="doc" title={p.terms_title} />
            <ol className="pr-card">
              {p.terms.map((term) => (
                <li key={term}>{term}</li>
              ))}
            </ol>
          </div>
          <div className="pr-slogan">
            <p>
              “{p.slogan[0]}
              <br />
              {p.slogan[1]}”
            </p>
            <button type="button" onClick={onDemo}>
              {p.slogan_btn}
            </button>
            <span className="pr-flag" aria-hidden="true" />
          </div>
          <div className="pr-valid">
            <small>
              <Ico name="cal" />
              {p.valid_title}
            </small>
            <b>{p.valid_days}</b>
          </div>
          <div className="pr-reco">
            <small>★ {p.reco_title}</small>
            <b>{p.reco_name}</b>
            <span>{p.reco_sub}</span>
          </div>
        </section>
      </div>

      {/* 6. strip */}
      <div className="pr-strip">
        <div className="wrap pr-strip-in">
          <div className="pr-strip-logo">
            <img className="mk" src={markImg} alt="" />
            <div>
              <img className="wd" src={wordImg} alt="Neta360" />
              <small>{p.tagline}</small>
            </div>
          </div>
          <div className="pr-pillars">
            {p.pillars.map((word, i) => (
              <span key={word}>
                <Ico name={PILLAR_ICONS[i]} />
                {word}
              </span>
            ))}
          </div>
          <div className="pr-contact">
            <h5>{p.contact}</h5>
            <a href={CONTACT.phoneHref}>
              <Ico name="phone" />
              <span className="num">{CONTACT.phone}</span>
            </a>
            <a href={`mailto:${CONTACT.desks.demo}`}>
              <Ico name="mail" />
              {CONTACT.desks.demo}
            </a>
          </div>
          <a className="pr-qr" href={site} target="_blank" rel="noopener noreferrer">
            <span dangerouslySetInnerHTML={{ __html: qrSvg }} />
            <small>{p.scan}</small>
          </a>
        </div>
      </div>
    </div>
  );
}
