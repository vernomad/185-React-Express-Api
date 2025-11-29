// import { useState } from "react";
import ShowButton from "../buttons/ShowButton";
import FetchEvents from "../data/FetchEvents";
import { GeoChart } from "../ui/GeoChart";
import { DurationTotalChart } from "../ui/DurationTotalChart";
import { DurationAverageChart } from "../ui/DurationAverageChart";
import { DeviceChart } from "../ui/DevicesChart";
import { BrowserChart } from "../ui/BrowserChart";
import { OperatingSystemChart } from "../ui/OperatingSystemChart";

import useAnalyticData from "../../hooks/useAnalyticsData";
import useChartData from "../../hooks/useChartData";
import FetchPageStats from "../data/FetchPageStats";
import { DurationBucketChart } from "../ui/DurationBucketsChart";
import { TrackingEvent } from "../../types/TrackingTypes";
import { ClickButtonChart } from "../ui/ClickButtonChart";

export default function AnalyticsSection() {
  const {
    events,
    error,
    total,
    page,
    setPage,
    filter,
    setFilter,
    dateRange,
    setDateRange,
    sortedPages,
  } = useAnalyticData(15);

  const {
    durationTotalsByPage: durationTotalsByPage, //as yet still unused
    durationAveragesByPage: durationAveragesByPage, //as yet still unused
    durationBuckets: durationBuckets,
    sessions: sessions,
    events: ChartEvents,
    error: chartError,
    filter: chartFilter,
    setFilter: setChartFilter,
    dateRange: chartDateRange,
    setDateRange: setChartDateRange,
    total: chartTotal,
  } = useChartData();

  function buildGeoCounts(events: TrackingEvent[]) {
    const counts: Record<string, number> = {};

    for (const evt of events) {
      const country = evt.geo?.country ?? "Unknown";

      counts[country] = (counts[country] || 0) + 1;
    }

    return counts;
  }

  return (
    <div id="admin-analytics" className="admin-container">
      <h2>Analytics</h2>

      <ShowButton
        showWhat="Show events"
        content={
          <>
            <div>
              <h4>
                Total events: <span id="total">{chartTotal}</span>
              </h4>
            </div>
            <div className="button-wrapper">
              {!error ? (
                <FetchEvents
                  events={events}
                  total={total}
                  limit={15}
                  page={page}
                  setPage={setPage}
                  filter={filter}
                  setFilter={setFilter}
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                />
              ): (
                <p className="errors">Failed: {error}</p>
              )}
            </div>
          </>
        }
      />
      <ShowButton
        showWhat="Show page stats"
        content={
          <div className="button-wrapper">
            {!error ? (
              <FetchPageStats
                filter={filter}
                setFilter={setFilter}
                sortedPages={sortedPages}
                dateRange={dateRange}
                setDateRange={setDateRange}
              />
            ): (
                <p className="errors">Failed: {error}</p>
              )}
          </div>
        }
      />
      <ShowButton
        showWhat="Show charts"
        content={
          <>
            <div>
              <h4>
                Total events: <span id="total">{chartTotal}</span>
              </h4>
            </div>
            <div className="analytics-caption">
              <div>
                <label htmlFor="filter-3">Filter by type:</label>
                <select
                  id="filter-3"
                  value={chartFilter}
                  onChange={(e) => {
                    setChartFilter(e.target.value);
                  }}
                  className="select-analytics"
                >
                  <option value="all">All</option>
                  <option value="view">View</option>
                  <option value="click">Click</option>
                  <option value="hover">Hover</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div>
                <label htmlFor="range-3">Date range:</label>
                <select
                  id="range-3"
                  value={chartDateRange}
                  onChange={(e) => {
                    setChartDateRange(e.target.value);
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
            {!chartError && sessions.length > 0 && (
              <div className="chart-grid">
                <DeviceChart events={sessions} />

                <BrowserChart events={sessions} />

                <OperatingSystemChart events={sessions} />

                {chartFilter === "click" && (
                  <ClickButtonChart events={ChartEvents} />
                )}
                {(chartFilter === "all" || chartFilter === "view") && (
                  <DurationBucketChart buckets={durationBuckets} />
                )}

                <GeoChart geoCounts={buildGeoCounts(sessions)} />

                <div className="chart-double-outer">
                  <div className="chart-double">
                    <DurationTotalChart totals={durationTotalsByPage} />

                    <DurationAverageChart totals={durationAveragesByPage} />
                  </div>
                </div>
              </div>
            )}
          </>
        }
      />
    </div>
  );
}
