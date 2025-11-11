import { useEffect, useState } from "react";

// Extend Navigator type so TS accepts userAgentData
declare global {
  interface NavigatorUAData {
    mobile: boolean;
    platform: string;
    brands: { brand: string; version: string }[];
  }

  interface Navigator {
    userAgentData?: NavigatorUAData;
  }
}

export function detectMobile(): boolean {
  // 1. Chromium client hints
  if (navigator.userAgentData?.mobile) return true;

  // 2. UA string fallback
  const ua = navigator.userAgent || "";
  const mobileRegex = /\b(Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Mobile)\b/i;
  if (mobileRegex.test(ua)) return true;

  // 3. Touch support
  if (navigator.maxTouchPoints && navigator.maxTouchPoints > 1) return true;

  // 4. Screen size heuristic
//   if (window.matchMedia("(max-width: 767px)").matches) return true;

  return false;
}

export function getOrientation() {
  if (window.matchMedia("(orientation: portrait)").matches) {
    return "portrait";
  } else if (window.matchMedia("(orientation: landscape)").matches) {
    return "landscape";
  }
  return "unknown";
}


export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    
  const updateOrientation = () => {
    const full = document.querySelector('.mobile-dialog-img')
    const orientation = getOrientation();
   // console.log("Orientation:", getOrientation());
     if (full && isMobile) {
      if (orientation === "landscape") {
        full.classList.add("active");
      } else {
        full.classList.remove("active");
      }
    }
  };

  window.addEventListener("resize", updateOrientation);

  // Run once on mount
  updateOrientation();

  return () => window.removeEventListener("resize", updateOrientation);
}, [isMobile]);


  useEffect(() => {
    setIsMobile(detectMobile());

    // Optional: update on resize
    const handler = () => setIsMobile(detectMobile());
    window.addEventListener("resize", handler);

    return () => window.removeEventListener("resize", handler);
  }, []);

  return isMobile;
  
}
