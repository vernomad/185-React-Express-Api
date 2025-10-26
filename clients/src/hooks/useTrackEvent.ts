// hooks/useTrackEvent.ts
import { baseUrl } from "../lib/baseUrl";
import { useUser } from "../useUser";
import { TrackingEventType, TrackingEvent, TrackEventInput } from "../types/TrackingTypes";


/* ---------- The hook ---------- */
export function useTrackEvent() {
  const {user}= useUser()

  const track = async <T extends TrackingEventType>(
    event: TrackEventInput<T>
  ): Promise<void> => {
    try {
        // Build payload based on TrackingEvent type
      const payload: TrackingEvent = {
        ...event,
        sessionId: getSessionIdFromCookie(),
        // Only add userId if it exists
        // ...(user ? { userId: user.username } : {}),
        userId: user ? user.username : "anonymous",
        createdAt: new Date().toISOString(),
      };
      await fetch(`${baseUrl}/api/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // send session cookie
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("Track error:", error);
    }
  };

  return { track };
}

/* ---------- Helper to read sessionId from cookies ---------- */
function getSessionIdFromCookie(): string | null {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("sessionId="));
  return cookie ? cookie.split("=")[1] : null;
}
