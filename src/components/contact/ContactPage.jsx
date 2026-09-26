import ContactInfo from "./ContactInfo.jsx";
import ContactFlow from "./ContactFlow.jsx";

// The whole Contact page fits on one screen: contact details and offices on the left,
// and one guided form on the right that turns into a callback, WhatsApp, demo or message step.
export default function ContactPage() {
  return (
    <div className="ct">
      <section className="ct-hero">
        <ContactInfo />
        <div className="ct-flow-side">
          <ContactFlow />
        </div>
      </section>
    </div>
  );
}
