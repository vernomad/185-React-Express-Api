import { TrackingEvent } from "../../types/TrackingTypes";

type AnalyticProps = {
  events: TrackingEvent[];
  total: number;
  limit: number;

  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;

  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;

  dateRange: string;
  setDateRange: React.Dispatch<React.SetStateAction<string>>;

};

export default function FetchEvents({
  events, total, 
  limit, page, 
  setPage, filter, 
  setFilter, dateRange, 
  setDateRange,
}: AnalyticProps) {
 
  // const [dateRange, setDateRange] = useState("all");


  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6">
      <h3>Events</h3>
        <>
          <div className="table-wrapper">
            <div className="analytics-caption">
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
            </div>
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
                    <td className="t-clr" data-cell="type">
                      {e.type}
                    </td>
                    <td className="t-clr" data-cell="slug">
                      {e.slug}
                    </td>
                    <td className="t-clr" data-cell="ip">
                      {e.ip}
                    </td>
                    <td className="t-clr" data-cell="country">
                      {" "}
                      {e.geo
                        ? `${e.geo.city}, ${e.geo.region}, ${e.geo.country}`
                        : "—"}
                    </td>
                    <td className="t-clr" data-cell="user">
                      {e.userId || "—"}
                    </td>
                    <td className="t-clr" data-cell="time">
                      {new Date(e.createdAt).toLocaleString()}
                    </td>
                    <td className="t-clr" data-cell="btn">
                      {e.type === "click" && e.meta && "clickTarget" in e.meta
                        ? e.meta.clickTarget
                        : "—"}
                    </td>
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

    </div>
  );
}
