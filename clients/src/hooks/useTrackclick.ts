import { useCallback } from "react";
import { useTrackEvent } from "./useTrackEvent";
import { getDeviceMeta } from "./usePageView";

/**
 * Tracks button or link clicks with consistent metadata.
 *
 * @param slug - Unique identifier for the clicked element (e.g., "cta-button-home")
 * @param meta - Optional metadata describing where the click occurred
 */
export function useTrackClick( slug: string,
  location: string,
  clickTarget: string) {
  const { track } = useTrackEvent();

  // useCallback ensures we don't re-create the handler unnecessarily
  const handleClick = useCallback(() => {
    track({
      type: "click",
      slug,
      meta: {
        ...getDeviceMeta(),
        location,
        clickTarget,
      },
    });
  }, [slug, clickTarget, location, track]);

  return handleClick;
}

/* ---------- Helper ---------- */
// function getDeviceType() {
//   const width = window.innerWidth;
//   if (width < 768) return "mobile";
//   if (width < 1024) return "tablet";
//   return "desktop";
// }
