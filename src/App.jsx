import { useCallback, useEffect, useRef, useState } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Modules from "./components/Modules.jsx";
import ProductPreview from "./components/preview/ProductPreview.jsx";
import WhoAndStats from "./components/WhoAndStats.jsx";
import CtaBanner from "./components/CtaBanner.jsx";
import Footer from "./components/Footer.jsx";
import ContactPage from "./components/contact/ContactPage.jsx";
import PricingPage from "./components/pricing/PricingPage.jsx";
import DemoModal from "./components/DemoModal.jsx";
import VideoModal from "./components/VideoModal.jsx";
import Toast from "./components/Toast.jsx";

// "#/contact" and "#/pricing" are their own pages; any other hash (e.g. "#modules") is a section of the home page.
function pageFromHash() {
  const hash = window.location.hash;
  if (hash.startsWith("#/contact")) return "contact";
  if (hash.startsWith("#/pricing")) return "pricing";
  return "home";
}

export default function App() {
  const [page, setPage] = useState(pageFromHash);
  const [demoOpen, setDemoOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [toast, setToast] = useState("");
  const timer = useRef();

  const openDemo = useCallback(() => setDemoOpen(true), []);
  const closeDemo = useCallback(() => setDemoOpen(false), []);
  const openVideo = useCallback(() => setVideoOpen(true), []);
  const closeVideo = useCallback(() => setVideoOpen(false), []);
  const showToast = useCallback((message) => {
    setToast(message);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 2600);
  }, []);

  useEffect(() => {
    const onHash = () => setPage(pageFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // After switching pages, start at the top, or at the home section named in the hash.
  useEffect(() => {
    const target = page === "home" && window.location.hash ? document.getElementById(window.location.hash.slice(1)) : null;
    if (target) target.scrollIntoView({ behavior: "instant" });
    else window.scrollTo({ top: 0, behavior: "instant" });
  }, [page]);

  return (
    <>
      <Header page={page} onDemo={openDemo} onToast={showToast} />
      {page === "contact" ? (
        <main>
          <ContactPage />
        </main>
      ) : page === "pricing" ? (
        <main>
          <PricingPage onDemo={openDemo} />
        </main>
      ) : (
        <main>
          <Hero onDemo={openDemo} onWatchVideo={openVideo} />
          <Modules />
          <ProductPreview />
          <WhoAndStats />
          <CtaBanner onDemo={openDemo} />
        </main>
      )}
      <Footer />
      <DemoModal open={demoOpen} onClose={closeDemo} />
      <VideoModal open={videoOpen} onClose={closeVideo} />
      <Toast message={toast} />
    </>
  );
}
