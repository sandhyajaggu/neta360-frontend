import { useRef } from "react";

export default function Toast({ message }) {
  // Keep the last text while the toast slides out.
  const last = useRef("");
  if (message) last.current = message;

  return (
    <div className={`toast${message ? " show" : ""}`} role="status">
      {last.current}
    </div>
  );
}
