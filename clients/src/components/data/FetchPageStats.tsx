import { PageStats } from "../../types/TrackingTypes";

type AnalyticProps = {
    sortedPages: PageStats[];
  
    filter: string;
    setFilter: React.Dispatch<React.SetStateAction<string>>;

    dateRange: string;
    setDateRange: React.Dispatch<React.SetStateAction<string>>;
}

export default function FetchPageStats({
    sortedPages,
    filter,
    setFilter,
    dateRange,
    setDateRange,

}: AnalyticProps) {

    return (
        <div className="p-6" style={{marginTop: "2rem"}}>
              <h3>Page Statistics</h3>
          <div className="table-wrapper">
                 <div className="analytics-caption">
                   <div>
                <label htmlFor="filter-1">Filter by type:</label>
                <select
                  id="filter-1"
                  value={filter}
                  onChange={(e) => {
                    // setPage(0); // reset to first page
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
                <label htmlFor="range-2">Date range:</label>
                <select
                  id="range-2"
                  value={dateRange}
                  onChange={(e) => {
                    // setPage(0);
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
                    <th className="t-clr text-left">Page</th>
                    <th className="t-clr text-left">Views</th>
                    <th className="t-clr text-left">Clicks</th>
                    <th className="t-clr text-left">Hovers</th>
                    <th className="t-clr text-left">Custom</th>
                    <th className="t-clr text-left">Total</th>
                  </tr>
                </thead>
        
                <tbody>
                     {sortedPages.map((p, i) => (
                    <tr key={i}>
                      <td className="t-clr" data-cell="Slug">{p.slug}</td>
                      <td className="t-clr" data-cell="Views">{p.views}</td>
                      <td className="t-clr" data-cell="Clicks">{p.clicks}</td>
                      <td className="t-clr" data-cell="Hovers">{p.hovers}</td>
                      <td className="t-clr" data-cell="Custom">{p.custom}</td>
                      <td className="t-clr" data-cell="Total">{p.total}</td>
                    </tr>
                  ))}         
                </tbody>
              </table>
            </div>
            </div>
    )
}