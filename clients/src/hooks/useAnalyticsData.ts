import { useEffect, useState } from "react";
import { baseUrl } from "../lib/baseUrl";
import { TrackingEvent, PageStats } from "../types/TrackingTypes";


export default function useAnalyticData(limit = 15) {
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [sortedPages, setSortedPages] = useState<PageStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [total, setTotal] = useState(0);

  // controls for request
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState("");
  const [dateRange, setDateRange] = useState("all");

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    fetch(
      `${baseUrl}/api/analytics?limit=${limit}&offset=${
        page * limit
      }&type=${filter}&range=${dateRange}`,
      { signal: controller.signal, credentials: "include" }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `HTTP error ${res.status} — could not load analytics data.`
          );
        }
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setEvents(data.events);
          setTotal(data.total);
          setSortedPages(data.sortedPages)
        } else {
          setError("Server returned failure.");
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError("Network error");
        }
      })
      .finally(() => {
        setLoading(false);
      });

    // cleanup — cancel request if filter/page/range changes too fast
    return () => controller.abort();
  }, [page, filter, dateRange, limit]);

  return {
    events,
    loading,
    error,
    total,

    // expose pagination + filters
    page,
    setPage,

    filter,
    setFilter,

    dateRange,
    setDateRange,

    sortedPages,
  };
}
