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
  const [dateRange, setDateRange] = useState("all");


   const limit = 15;

   useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`/api/analytics?limit=${limit}&offset=${page * limit}&type=${filter}&range=${dateRange}`)

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
  }, [page, filter, dateRange]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6">
      <h3>Events</h3>
      {loading && <p>Loading...</p>}
      {error && <p className="errors">{error}</p>}

      {!loading && !error && (
        <>
          <div className="table-wrapper">
                    <caption className="analytics-caption">
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
     <div>
  <label htmlFor="range">Date range:</label>
  <select
    id="range"
    value={dateRange}
    onChange={(e) => {
      setPage(0);
      setDateRange(e.target.value);
    }}
    className="select-analytics"
  >
    <option value="all">All</option>
    <option value="1w">Previous week</option>
    <option value="2w">Previous 2 weeks</option>
    <option value="1m">Previous month</option>
    <option value="6m">Previous 6 months</option>
  </select>
</div>
              </caption>
            <table className="table-analytics">
      
              <thead>
                <tr>
                  <th className="text-left t-clr">Type</th>
                  <th className="text-left t-clr">Slug</th>
                  <th className="text-left t-clr">IP</th>
                  <th className="text-left t-clr">Country</th>
                  <th className="text-left t-clr">User</th>
                  <th className="text-left t-clr">Time</th>
                  <th className="text-left t-clr">Btn</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e: TrackingEvent, i) => (
                  <tr key={i}>
                    <td className="t-clr"data-cell="type">{e.type}</td>
                    <td className="t-clr"data-cell="slug">{e.slug}</td>
                    <td className="t-clr"data-cell="ip">{e.ip}</td>
                    <td className="t-clr"data-cell="country"> {e.geo
                      ? `${e.geo.city}, ${e.geo.region}, ${e.geo.country}`
                      : "—"}</td>
                    <td className="t-clr" data-cell="user">{e.userId || "—"}</td>
                    <td className="t-clr" data-cell="time">{new Date(e.createdAt).toLocaleString()}</td>
                     <td className="t-clr" data-cell="btn">{e.type === "click" && e.meta && "clickTarget" in e.meta
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
