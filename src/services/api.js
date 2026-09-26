// Sends the "Book a demo" and "Contact us" forms.
// Set VITE_API_URL in a .env file (see .env.example) to post to the backend.
// Without a backend, set VITE_WEB3FORMS_KEY to have each request emailed to you via Web3Forms.
// Or set VITE_DEMO_EMAIL to have each request emailed to that address via FormSubmit (no signup needed).
// With none set, the forms work in demo mode (no data is sent).
const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || "";
const DEMO_EMAIL = import.meta.env.VITE_DEMO_EMAIL || "";
// WhatsApp number (country code + number, digits only, e.g. 919876543210) that receives requests.
const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER || "").replace(/\D/g, "");
// CallMeBot API key: when set, each request is also sent automatically to WHATSAPP_NUMBER on WhatsApp.
const CALLMEBOT_KEY = import.meta.env.VITE_CALLMEBOT_KEY || "";

const LABELS = {
  desk: "Desk",
  name: "Name",
  phone: "Phone",
  email: "Email",
  role: "Role",
  state: "State",
  constituency: "Constituency",
  date: "Date",
  time: "Time",
  message: "Message",
  language: "Language",
};

// Full names for the page language codes, so emails and WhatsApp messages don't show "te"/"en".
const LANGUAGE_NAMES = { te: "Telugu", en: "English" };

// Turns a payload into { Label: value } in a fixed order, skipping empty fields.
function labelled(payload) {
  const fields = {};
  for (const [key, label] of Object.entries(LABELS)) {
    if (!payload[key]) continue;
    fields[label] = key === "language" ? LANGUAGE_NAMES[payload[key]] || payload[key] : payload[key];
  }
  return fields;
}

function messageText(title, payload) {
  return [title, ...Object.entries(labelled(payload)).map(([label, value]) => `${label}: ${value}`)].join("\n");
}

const DEMO_TITLE = "New demo request (Neta360)";

// Returns a wa.me link that opens WhatsApp with the demo request pre-typed, or null if no number is configured.
export function whatsappDemoLink(payload) {
  if (!WHATSAPP_NUMBER) return null;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(messageText(DEMO_TITLE, payload))}`;
}

// Sends the text to WHATSAPP_NUMBER via CallMeBot. CallMeBot doesn't allow reading its
// response from the browser (no CORS), so this is fire-and-forget and never fails the form.
function notifyWhatsApp(text) {
  if (!WHATSAPP_NUMBER || !CALLMEBOT_KEY) return;
  const params = new URLSearchParams({ phone: `+${WHATSAPP_NUMBER}`, text, apikey: CALLMEBOT_KEY });
  fetch(`https://api.callmebot.com/whatsapp.php?${params}`, { mode: "no-cors" }).catch(() => {});
}

async function postJson(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || String(data.success) !== "true") throw new Error(data.message || `Request failed with status ${res.status}`);
  return data;
}

async function deliver(path, subject, payload) {
  if (API_URL) {
    const res = await fetch(`${API_URL}/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
    return res.json();
  }
  if (WEB3FORMS_KEY) {
    return postJson("https://api.web3forms.com/submit", {
      access_key: WEB3FORMS_KEY,
      subject,
      from_name: "Neta360 Website",
      ...(payload.email && { replyto: payload.email }),
      ...labelled(payload),
    });
  }
  if (DEMO_EMAIL) {
    return postJson(`https://formsubmit.co/ajax/${encodeURIComponent(DEMO_EMAIL)}`, {
      _subject: subject,
      _template: "table",
      ...(payload.email && { _replyto: payload.email }),
      ...labelled(payload),
    });
  }
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { ok: true, demo: true };
}

export async function submitDemoRequest(payload) {
  const result = await deliver("demo-requests", `New demo request from ${payload.name}`, payload);
  notifyWhatsApp(messageText(DEMO_TITLE, payload));
  return result;
}

// payload.desk names the request type, e.g. "Support", "Partnership", "Callback" or "Demo booking".
export async function submitContactMessage(payload) {
  const result = await deliver("contact-messages", `New ${payload.desk} request from ${payload.name}`, payload);
  notifyWhatsApp(messageText(`New ${payload.desk} request (Neta360)`, payload));
  return result;
}
