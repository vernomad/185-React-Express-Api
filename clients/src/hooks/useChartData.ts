import { useEffect, useState, useMemo } from "react";
import { baseUrl } from "../lib/baseUrl";
import { TrackingEvent } from "../types/TrackingTypes";


export default function useChartData() {
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [total, setTotal] = useState(0);

  const [ durationTotalsByPage , setDurationTotalsByPage] = useState<Record<string, number>>({});   
  const [durationAveragesByPage, setDurationAveragesByPage] = useState<Record<string, number>>({});   
  const [countsByType, setCountsByType] = useState<Record<string, number>>({});
  const [durationBuckets, setDurationBuckets] = useState<Record<string, number>>({});
  // const [geoCounts, setGeoCounts] = useState<Record<string, number>>({});


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    fetch(
      `${baseUrl}/api/analytics/charts?type=${filter}&range=${dateRange}`,
      { signal: controller.signal, credentials: "include" }
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!data.success) return setError("Server returned failure.");

        setDurationAveragesByPage(data.durationAveragesByPage)  
        setDurationTotalsByPage(data.durationTotalsByPage)
        setEvents(data.events);
        setTotal(data.total);

        setCountsByType(data.countsByType);
        setDurationBuckets(data.durationBuckets);
        // setGeoCounts(data.geoCounts);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError("Network error");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [filter, dateRange]);

    // 🔥 NEW: compute sessions ONCE using useMemo
  const sessions = useMemo(() => {
  const map = new Map<string, TrackingEvent>();

  for (const evt of events) {
    if (!evt.sessionId) continue; // <-- skip null or empty
    if (!map.has(evt.sessionId)) {
      map.set(evt.sessionId, evt);
    }
  }

  return Array.from(map.values());
}, [events]);


  return {
    durationTotalsByPage, 
    durationAveragesByPage,
    sessions,
    events,
    total,
    countsByType,
    durationBuckets,
    loading,
    error,

    filter, setFilter,
    dateRange, setDateRange,
  };
}

