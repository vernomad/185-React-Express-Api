import { useEffect, useState } from "react";
import type { CalendarEventEntry } from "@models/event/EventLog";
import { baseUrl } from "../lib/baseUrl";

export default function useEventData() {
  const [events, setEvents] = useState<CalendarEventEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${baseUrl}/api/event`, { signal: controller.signal, credentials: "include" })
       .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data: CalendarEventEntry[]) => {
        const parsed = data.map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));

        // console.log("Parsed events:", parsed); // ✅ Check this
       setEvents(parsed.filter((e) => e.start && e.end));
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return { events, loading, error };
}
