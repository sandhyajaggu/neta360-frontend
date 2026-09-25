import { useEffect, useRef } from "react";
import { useLang } from "../i18n/LanguageContext.jsx";

const VIDEO_SRC = {
  te: "/videos/neta360-digital-blueprint.mp4",
  en: "/videos/neta360-decoding-en.mp4",
};

export default function VideoModal({ open, onClose }) {
  const { lang } = useLang();
  const videoRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      videoRef.current?.pause();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal open" role="dialog" aria-modal="true" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dialog dialog-video">
        <button className="close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <video ref={videoRef} src={VIDEO_SRC[lang]} controls autoPlay playsInline />
      </div>
    </div>
  );
}
