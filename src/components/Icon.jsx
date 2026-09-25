// Filled icons (module cards, chips, "who uses") and line icons (sidebar, benefits).
const FILLED = {
  "people": "<circle cx=\"12\" cy=\"6.8\" r=\"3.3\"/><path d=\"M6.3 19c0-3.6 2.6-6.6 5.7-6.6s5.7 3 5.7 6.6z\"/><circle cx=\"4.8\" cy=\"9.2\" r=\"2.5\"/><path d=\"M.5 18c0-2.8 1.9-5 4.3-5 .9 0 1.8.3 2.5.8C5.9 15.1 5 16.6 4.8 18z\"/><circle cx=\"19.2\" cy=\"9.2\" r=\"2.5\"/><path d=\"M23.5 18c0-2.8-1.9-5-4.3-5-.9 0-1.8.3-2.5.8 1.4 1.3 2.3 2.8 2.5 4.2z\"/>",
  "ballot": "<path d=\"M2.5 11h5l1.3 2h6.4l1.3-2h5V20a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 20z\"/><path d=\"M8.2 11.6 12.6 3l5.3 2.8-3.1 5.8z\"/><rect x=\"8\" y=\"15.5\" width=\"8\" height=\"1.8\" rx=\".9\" fill=\"#fff\"/>",
  "store": "<path d=\"M3 3.5h18l1.6 5.2a2.6 2.6 0 0 1-4.7 1.5 2.6 2.6 0 0 1-4.5 0 2.6 2.6 0 0 1-4.6 0 2.6 2.6 0 0 1-4.5 0A2.6 2.6 0 0 1 1.4 8.7z\"/><path fill-rule=\"evenodd\" d=\"M3.8 12.6c1.3.5 2.7.3 3.7-.4 1.1.8 2.8.8 3.8 0 1.1.8 2.7.8 3.8 0 1 .7 2.4.9 3.7.4v8.9H3.8zM9.8 21.5v-5h4.4v5z\"/>",
  "group": "<circle cx=\"12\" cy=\"6.5\" r=\"3.4\"/><path d=\"M5.6 19.5c0-3.9 2.9-7 6.4-7s6.4 3.1 6.4 7z\"/><circle cx=\"4.6\" cy=\"9\" r=\"2.6\"/><path d=\"M0 18.5c0-2.9 2-5.2 4.6-5.2.8 0 1.6.2 2.3.6-1.6 1.4-2.6 3-2.8 4.6z\"/><circle cx=\"19.4\" cy=\"9\" r=\"2.6\"/><path d=\"M24 18.5c0-2.9-2-5.2-4.6-5.2-.8 0-1.6.2-2.3.6 1.6 1.4 2.6 3 2.8 4.6z\"/>",
  "mega": "<path d=\"M2.8 9.3h3.8L16.3 4v16l-9.7-5.3H2.8A1.3 1.3 0 0 1 1.5 13.4v-2.8a1.3 1.3 0 0 1 1.3-1.3z\"/><path d=\"M6.4 15.3l1.7 5.4h3.2L9.7 15.8z\"/><path d=\"M19 8.3a5 5 0 0 1 0 7.4\" stroke=\"currentColor\" stroke-width=\"2.2\" fill=\"none\" stroke-linecap=\"round\"/>",
  "cal": "<path fill-rule=\"evenodd\" d=\"M4 4.5h2.2V2.5h2.3v2h7v-2h2.3v2H20a1.5 1.5 0 0 1 1.5 1.5v14A1.5 1.5 0 0 1 20 21.5H4A1.5 1.5 0 0 1 2.5 20V6A1.5 1.5 0 0 1 4 4.5zm.8 5.3v9.5h14.4V9.8zM7 11.5h2.3v2.3H7zm3.9 0h2.3v2.3h-2.3zm3.9 0h2.3v2.3h-2.3zM7 15.3h2.3v2.3H7zm3.9 0h2.3v2.3h-2.3zm3.9 0h2.3v2.3h-2.3z\"/>",
  "chart": "<path d=\"M2.5 20h19v1.6h-19z\"/><rect x=\"4\" y=\"14.5\" width=\"3\" height=\"4.5\" rx=\".5\"/><rect x=\"9\" y=\"11.5\" width=\"3\" height=\"7.5\" rx=\".5\"/><rect x=\"14\" y=\"13\" width=\"3\" height=\"6\" rx=\".5\"/><rect x=\"19\" y=\"8.5\" width=\"2.6\" height=\"10.5\" rx=\".5\"/><path d=\"M3.5 11.5 9 6.3l4 3 6.2-6\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M16.3 2.4H21v4.7z\"/>",
  "home": "<path d=\"M12 3 2.5 11h3v9.5h5v-6h3v6h5V11h3z\"/>",
  "mla": "<circle cx=\"12\" cy=\"7\" r=\"4.2\"/><path d=\"M3 21.5c0-4.7 4-8.3 9-8.3s9 3.6 9 8.3z\"/><path d=\"M10.9 13.3h2.2l.8 4.2-1.9 2.3-1.9-2.3z\" fill=\"#fff\"/>",
  "party": "<path d=\"M12 1.8 22.5 7v2.2h-21V7z\"/><rect x=\"3.6\" y=\"10.3\" width=\"2.6\" height=\"8.2\"/><rect x=\"8.3\" y=\"10.3\" width=\"2.6\" height=\"8.2\"/><rect x=\"13.1\" y=\"10.3\" width=\"2.6\" height=\"8.2\"/><rect x=\"17.8\" y=\"10.3\" width=\"2.6\" height=\"8.2\"/><rect x=\"1.5\" y=\"19.5\" width=\"21\" height=\"2.6\" rx=\".6\"/>",
  "cand": "<circle cx=\"12\" cy=\"10\" r=\"4.2\"/><path d=\"M3.5 22c0-4.4 3.8-7.3 8.5-7.3s8.5 2.9 8.5 7.3z\"/><path d=\"M12 .8l1.1 2.2 2.4.3-1.8 1.7.5 2.4-2.2-1.2-2.2 1.2.5-2.4-1.8-1.7 2.4-.3z\"/>",
  "office": "<path fill-rule=\"evenodd\" d=\"M4.5 1.5h15V21h2v1.8h-19V21h2zM7.5 4.5v2.3h2.4V4.5zm6.6 0v2.3h2.4V4.5zM7.5 9v2.3h2.4V9zm6.6 0v2.3h2.4V9zm-6.6 4.5v2.3h2.4v-2.3zm6.6 0v2.3h2.4v-2.3zM10.3 17.5V21h3.4v-3.5z\"/>",
  "camp": "<circle cx=\"12\" cy=\"9.3\" r=\"2.7\"/><path d=\"M7.3 16.5c0-2.7 2.1-4.7 4.7-4.7s4.7 2 4.7 4.7z\"/><path d=\"M3.6 12A8.4 8.4 0 0 1 17.4 5.6M20.4 12A8.4 8.4 0 0 1 6.6 18.4\" stroke=\"currentColor\" stroke-width=\"2.2\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M19.5 2.3v5.2h-5.2zM4.5 21.7v-5.2h5.2z\"/>"
};

const LINE = {
  "home": "<path d=\"M3 11l9-7 9 7M5 10v10h14V10\"/>",
  "people": "<circle cx=\"9\" cy=\"8\" r=\"3.5\"/><path d=\"M2 21v-1a7 7 0 0 1 14 0v1\"/><circle cx=\"17.5\" cy=\"6.5\" r=\"2.5\"/><path d=\"M18 13a5 5 0 0 1 4.5 5v1\"/>",
  "vote": "<path d=\"M4 12h16v8H4z\"/><path d=\"M8 12V4h8v8\"/><path d=\"M10 8l1.5 1.5L14 7\"/>",
  "booth": "<path d=\"M3 21h18M5 21V10M19 21V10M9 21v-6h6v6M2 10l10-6 10 6z\"/>",
  "issue": "<path d=\"M3 10v4h3l8 4V6L6 10z\"/><path d=\"M18 9a4 4 0 0 1 0 6\"/>",
  "event": "<rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M3 10h18M8 3v4M16 3v4\"/>",
  "dev": "<path d=\"M3 21h18M6 17v-4M11 17V9M16 17v-7\"/>",
  "scheme": "<path d=\"M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z\"/>",
  "report": "<path d=\"M6 3h9l4 4v14H6z\"/><path d=\"M9 12h7M9 16h5\"/>",
  "bell": "<path d=\"M6 16V11a6 6 0 0 1 12 0v5l2 2H4z\"/><path d=\"M10 21h4\"/>",
  "settings": "<circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1\"/>",
  "check": "<path d=\"M6 12.5l4 4L18 8\"/>",
  "decide": "<circle cx=\"12\" cy=\"12\" r=\"8\"/><path d=\"M8.5 15.5l7-7M12 8h3.5v3.5\"/>",
  "comm": "<path d=\"M4 10h16v10H4z\"/><path d=\"M2.5 10 5 4h14l2.5 6M9 20v-5h6v5\"/>",
  "growth": "<path d=\"M4 20h16M7 16v-3M11 16v-6M15 16v-4M19 16V7\"/><path d=\"M5 10l5-4 4 3 5-5\"/>",
  "trans": "<path d=\"M4 7l8-4 8 4v10l-8 4-8-4z\"/><path d=\"M9 12l2 2 4-4\"/>",
  "shield": "<path d=\"M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z\"/><path d=\"M9 12l2 2 4-4\"/>",
  "up": "<path d=\"M6 15l6-6 6 6\"/>"
};

export function Icon({ name, color, className = "" }) {
  return (
    <svg
      className={`f ${className}`}
      viewBox="0 0 24 24"
      style={color ? { color } : undefined}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: FILLED[name] }}
    />
  );
}

export function LineIcon({ name, className = "" }) {
  return (
    <svg
      className={`i ${className}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: LINE[name] }}
    />
  );
}
