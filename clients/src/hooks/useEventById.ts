import { useEffect, useState } from "react";
import type { CalendarEventEntry } from "@models/event/EventLog";
import { baseUrl } from "../lib/baseUrl";

export default function useEventById(id: string) {
    const [events, setEvents] = useState<CalendarEventEntry[]>([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const controller = new AbortController();
      fetch(`${baseUrl}/api/event/${id}`, { signal: controller.signal, credentials: "include"})
           .then((res) => res.json())
           .then((data: CalendarEventEntry[]) => setEvents(data))
           .catch((err) => {
           if (err.name !== "AbortError") {
             setError(err);
           }
         })
           .finally(() => setLoading(false));
     
             return () => controller.abort();
       }, [id]);

  return { events, loading, error };
}