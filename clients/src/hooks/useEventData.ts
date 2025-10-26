import { useEffect, useState } from "react";
import type { CalendarEventEntry } from "@models/event/EventLog";
import { baseUrl } from "../lib/baseUrl";

export default function useEventData() {
  const [events, setEvents] = useState<CalendarEventEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${baseUrl}/data/events/events.json`, { signal: controller.signal, credentials: "include" })
      .then((res) => res.json())
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
