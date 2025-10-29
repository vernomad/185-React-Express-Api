import { useEffect, useState } from "react";
import { TrackingEvent } from "../../types/TrackingTypes";
import { GeoChart } from "../ui/GeoChart";

export default function FetchAnalytics() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState("");
  const [total, setTotal] = useState(0);

   const limit = 50;

   useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`/api/analytics?limit=${limit}&offset=${page * limit}&type=${filter}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEvents(data.events);
          setTotal(data.total);
        } else {
          setError("Failed to fetch analytics data");
        }
      })
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  }, [page, filter]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6">
      <h3>Events</h3>

      <div>
        <label htmlFor="filter">Filter by type:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => {
            setPage(0); // reset to first page
            setFilter(e.target.value);
          }}
          className="select-analytics"
        >
          <option value="">All</option>
          <option value="view">View</option>
          <option value="click">Click</option>
          <option value="hover">Hover</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="errors">{error}</p>}

      {!loading && !error && (
        <>
          <div className="table-wrapper">
            <table className="table-analytics">
              <thead>
                <tr>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Slug</th>
                  <th className="text-left p-2">IP</th>
                  <th className="text-left p-2">Country</th>
                  <th className="text-left p-2">User</th>
                  <th className="text-left p-2">Time</th>
                  <th className="text-left p-2">Btn</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e: TrackingEvent, i) => (
                  <tr key={i}>
                    <td className="p-2">{e.type}</td>
                    <td className="p-2">{e.slug}</td>
                    <td className="p-2">{e.ip}</td>
                    <td className="p-2"> {e.geo
                      ? `${e.geo.city}, ${e.geo.region}, ${e.geo.country}`
                      : "—"}</td>
                    <td className="p-2">{e.userId || "—"}</td>
                    <td className="p-2">{new Date(e.createdAt).toLocaleString()}</td>
                     <td className="p-2">{e.type === "click" && e.meta && "clickTarget" in e.meta
                        ? e.meta.clickTarget
                        : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prev-button-wrapper">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={page === 0}
              className="prev-btn"
            >
              Previous
            </button>
            <span>
              Page {page + 1} of {totalPages || 1}
            </span>
            <button
              onClick={() => setPage((p) => (p + 1 < totalPages ? p + 1 : p))}
              disabled={page + 1 >= totalPages}
              className="next-btn"
            >
              Next
            </button>
          </div>
        </>
      )}
      <div>
        <h3 style={{ marginTop: "2rem"}}>Events by Country</h3>
         {!loading && !error && events.length > 0 && <GeoChart events={events} />}
      </div>
     

    </div>
  );

}
