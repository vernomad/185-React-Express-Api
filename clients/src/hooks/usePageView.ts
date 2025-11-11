import { useEffect, useRef } from "react";
import { useTrackEvent } from "./useTrackEvent";
import { detectMobile } from "../lib/deviceDetect";
/**
 * Tracks a page view when the component mounts or slug changes.
 * @param slug - the page or route identifier (e.g. "/home" or "/projects/:id")
 */
const viewedPages = new Set<string>();

export function usePageView(slug: string) {
  const { track } = useTrackEvent();
  const hasTracked = useRef(false);

  useEffect(() => {
     // Prevent multiple logs for same slug per session
    if (hasTracked.current || viewedPages.has(slug)) return;

    hasTracked.current = true;
    viewedPages.add(slug);

    //  // Force a stable session marker per page
    // const viewedKey = `page_viewed_${slug}`;

    // // Debug — see what’s happening
    // console.log("Checking sessionStorage for:", viewedKey);

    // // Check if we already tracked this page in this session
    // const alreadyTracked = sessionStorage.getItem(viewedKey);

    // if (alreadyTracked) {
    //   console.log(`✅ Already tracked view for ${slug}`);
    //   return;
    // }

    // console.log(`🚀 Tracking new view for ${slug}`);

    // // Mark this page as tracked for the session
    // sessionStorage.setItem(viewedKey, "true");

    track({
      type: "view",
      slug,
      meta: getDeviceMeta(),
    });
  }, [slug, track]);
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
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
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
