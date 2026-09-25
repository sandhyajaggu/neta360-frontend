import LaptopDashboard from "./LaptopDashboard.jsx";
import PhoneApp from "./PhoneApp.jsx";
import Benefits from "./Benefits.jsx";

export default function ProductPreview() {
  return (
    <section className="preview" id="preview">
      <div className="wrap pv">
        <LaptopDashboard />
        <PhoneApp />
        <Benefits />
      </div>
    </section>
  );
}
