import { useMemo } from "react";
import { crowdSVG } from "../utils/crowd.js";

export default function Crowd({ side = "left" }) {
  const mirror = side === "right";
  const markup = useMemo(() => crowdSVG(mirror, mirror ? 29 : 5), [mirror]);

  return (
    <svg
      className={`crowd ${mirror ? "crowd-r" : "crowd-l"}`}
      viewBox="0 -60 380 200"
      preserveAspectRatio={`${mirror ? "xMaxYMax" : "xMinYMax"} slice`}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
