// import { useEffect, useRef } from "react";
// import { useTrackEvent } from "./useTrackEvent";
// import { detectMobile } from "../lib/deviceDetect";
// /**
//  * Tracks a page view when the component mounts or slug changes.
//  * @param slug - the page or route identifier (e.g. "/home" or "/projects/:id")
//  */
// const viewedPages = new Set<string>();

// export function usePageView(slug: string) {
//   const { track } = useTrackEvent();

//   // Track viewed pages in session (prevents duplicate logging)
//   const hasTracked = useRef(false);

//   // Track previous slug and entry time
//   const prevSlug = useRef<string | null>(null);
//   const entryTime = useRef<number>(Date.now());

//   useEffect(() => {
//     // Send duration for previous page (SPA referrer)
//     if (prevSlug.current) {
//       const duration = Date.now() - entryTime.current;
//       track({
//         type: "view",
//         slug: prevSlug.current,
//         meta: {
//           durationOnPage: duration,
//           ...getDeviceMeta(),
//         },
//       });
//     }

//     // Mark current page as tracked
//     if (!hasTracked.current) {
//       hasTracked.current = true;
//     }

//     // Reset entry time for current page
//     entryTime.current = Date.now();
//     prevSlug.current = slug;

//     // Initial view for this page
//     if (!viewedPages.has(slug)) {
//       viewedPages.add(slug);
//       track({
//         type: "view",
//         slug,
//         meta: {
//           ...getDeviceMeta(),
//           durationOnPage: 0,
//         },
//       });
//     }
//   }, [slug, track]);

//   // Send duration when user leaves or tab is hidden
//   useEffect(() => {
//     const sendDuration = () => {
//       if (!prevSlug.current) return;

//       const duration = Date.now() - entryTime.current;
//       track({
//         type: "view",
//         slug: prevSlug.current,
//         meta: {
//           durationOnPage: duration,
//           ...getDeviceMeta(),
//         },
//       });
//     };

//     const handleVisibility = () => {
//       if (document.visibilityState === "hidden") sendDuration();
//     };

//     window.addEventListener("beforeunload", sendDuration);
//     document.addEventListener("visibilitychange", handleVisibility);

//     return () => {
//       sendDuration(); // SPA route change or unmount
//       window.removeEventListener("beforeunload", sendDuration);
//       document.removeEventListener("visibilitychange", handleVisibility);
//     };
//   }, [track]);
// }

import { useEffect } from "react";
import { useTrackEvent } from "./useTrackEvent";
// import { getDeviceMeta } from "./getDeviceMeta";
import { detectMobile } from "../lib/deviceDetect";
import { usePageTimer } from "../utils/usePageTimer";


export function usePageView(slug: string) {
  const { track } = useTrackEvent();
  const { lastSlug, lastStart, setPage } = usePageTimer();

  useEffect(() => {
    const now = Date.now();

    // 1️⃣ Send duration for previous page (if any)
    if (lastSlug && lastStart) {
      const duration = Math.floor((now - lastStart) / 1000);

      // Important: do NOT depend on 'track'
      track({
        type: "view",
        slug: lastSlug,
        meta: {
          durationOnPage: duration,
          ...getDeviceMeta(),
        },
      });
    }

    // 2️⃣ Set the new page
    setPage(slug);

    // 3️⃣ When leaving the site entirely
    const onUnload = () => {
      if (lastStart) {
        const duration = Math.floor((Date.now() - lastStart) / 1000);

        navigator.sendBeacon(
          "/api/track",
          JSON.stringify({
            slug,
            type: "view",
            meta: {
              durationOnPage: duration,
              ...getDeviceMeta(),
            },
          })
        );
      }
    };

    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);

   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);
}



/* ---------- Utility functions ---------- */

export function getDeviceMeta() {
  const isMobile = detectMobile()
  
  let device: "mobile" | "tablet" | "desktop";
  if (isMobile) {
    device = "mobile";
  } else {
    const width = window.innerWidth;
    device = width < 1024 ? "tablet" : "desktop";
  }

  // Try to use modern User-Agent Client Hints (available in most browsers)
  const browser =
    (navigator.userAgentData?.brands &&
      navigator.userAgentData.brands[0]?.brand) ||
    getBrowserFromUA(navigator.userAgent);

  const os =
    navigator.userAgentData?.platform || getOSFromUA(navigator.userAgent);

  const referrer = document.referrer || "direct";

  return { device, browser, os, referrer };
}

// --- Fallbacks for older browsers ---
function getBrowserFromUA(ua: string): string {
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (/Safari\/[0-9.]+$/.test(ua)) return "Safari";
  if (ua.includes("Edge")) return "Edge";
  if (ua.includes("OPR") || ua.includes("Opera")) return "Opera";
  return "Unknown";
}

function getOSFromUA(ua: string): string {
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Mac")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("Android")) return "Android";
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
  return "Unknown";
}
