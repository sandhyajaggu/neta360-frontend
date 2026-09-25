import { LineIconRaw } from "./FooterIcons.jsx";
import { CONTACT } from "../config/contact.js";

export default function Footer() {
  return (
    <footer>
      <div className="wrap foot">
        <a href="#home">
          <LineIconRaw name="globe" />
          {CONTACT.website}
        </a>
        <a href={`mailto:${CONTACT.email}`}>
          <LineIconRaw name="mail" />
          {CONTACT.email}
        </a>
        <a href={CONTACT.phoneHref}>
          <LineIconRaw name="phone" />
          {CONTACT.phone}
        </a>

        <div className="social">
          <span>Follow us on</span>
          <a href="#/contact" className="fb" aria-label="Facebook">
            <svg viewBox="0 0 24 24">
              <path fill="#fff" d="M13.5 21v-7.5H16l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21z" />
            </svg>
          </a>
          <a href="#/contact" className="ig" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <rect x="4" y="4" width="16" height="16" rx="4.5" />
              <circle cx="12" cy="12" r="3.6" />
              <circle cx="17" cy="7" r=".6" fill="#fff" />
            </svg>
          </a>
          <a href="#/contact" className="yt" aria-label="YouTube">
            <svg viewBox="0 0 24 24">
              <path fill="#fff" d="M10 8.5v7l6-3.5z" />
            </svg>
          </a>
          <a href="#/contact" className="wa" aria-label="WhatsApp">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
              <path d="M20 12a8 8 0 0 1-11.8 7L4 20l1.1-4A8 8 0 1 1 20 12z" />
              <path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .8a4 4 0 0 1-2.2-2.2l.8-1-1-2z" fill="#fff" stroke="none" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
