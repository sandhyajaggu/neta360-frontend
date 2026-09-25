// Pieces shared by the Contact page sections: line icons, input rules and the "sent" message.

const ICONS = {
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
  chat: <path d="M20 12a8 8 0 0 1-11.8 7L4 20l1.1-4A8 8 0 1 1 20 12z" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6.5 12 13l8.5-6.5" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </>
  ),
  lifebuoy: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <path d="M5.6 5.6l3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6" />
    </>
  ),
  handshake: <path d="M2 11l4-4 4 2 2-1 4 0 6 4-3 3M2 11l6 6 2-1 2 2 2-1 2 1 3-4M10 9l-2 3 2 1 3-2" />,
  news: (
    <>
      <path d="M4 5h13v14H6a2 2 0 0 1-2-2z" />
      <path d="M17 9h3v8a2 2 0 0 1-4 0M7 9h7M7 13h7M7 16h4" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="6" width="13" height="12" rx="2" />
      <path d="M16 10.5 21 8v8l-5-2.5" />
    </>
  ),
  translate: <path d="M4 5h9M8.5 3v2M6 5c.5 3 2.5 5.5 5 7M11 5c-.5 3-3 6-6.5 8M13 21l4-10 4 10M14.5 17.5h5" />,
  send: <path d="M21 3 3 10.5l7 2.5 2.5 7zM10 13l4-4" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
};

export function Ico({ name }) {
  return (
    <svg className="i" viewBox="0 0 24 24" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

export const nameOk = (name) => name.trim().length > 1;
export const phoneOk = (phone) => /^[6-9]\d{9}$/.test(phone);
export const digits10 = (value) => value.replace(/\D/g, "").slice(0, 10);

// Success message shown in place of a form after it is sent.
export function Sent({ title, text, again, onAgain, dark = false }) {
  return (
    <div className={`ct-sent${dark ? " dark" : ""}`} role="status">
      <span className="ct-sent-ic">
        <Ico name="check" />
      </span>
      <h3>{title}</h3>
      <p>{text}</p>
      {onAgain && (
        <button type="button" className="ct-tab" onClick={onAgain}>
          {again}
        </button>
      )}
    </div>
  );
}
