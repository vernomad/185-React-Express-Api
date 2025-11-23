//Track controller
import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
// import fs from "fs/promises";
import fsPromises from "fs/promises";
import path from "path";
import { TrackingEvent } from "../types/trackTypes";

const baseDir = path.join(process.cwd(), "data");

// At top of file or outside the controller
const recentViews = new Map<string, number>(); // key: sessionId+slug, value: timestamp

const VIEW_TTL = 1000 * 60 * 30; // 30 minutes TTL
const CLICK_TTL = 1000; // 1 sec

const CACHE_TTL = {
  view: VIEW_TTL,
  click: CLICK_TTL,
};

const recentEvents = new Map<string, number>();
const geoCache = new Map<string, any>();

function isLocalIp(ip: string) {
  return (
    ip === "::1" ||
    ip.startsWith("127.") ||
    ip.startsWith("10.") ||
    /^172\.(1[6-9]|2[0-9]|3[01])\./.test(ip) ||
    ip.startsWith("192.168.") ||
    ip.startsWith("fe80:")
  );
}

// Helper: fetch geolocation data for an IP (cached)
async function enrichGeo(ip: string) {
  if (!ip || isLocalIp(ip)) {
    return { country: "Localhost", region: "", city: "", lat: 0, lon: 0 };
  }

  if (geoCache.has(ip)) return geoCache.get(ip);

  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await res.json();

    const geo = {
      country: data.country_name || "Unknown",
      region: data.region || "",
      city: data.city || "",
      lat: data.latitude || 0,
      lon: data.longitude || 0,
      timezone: data.timezone || "",
    };

    geoCache.set(ip, geo);

    console.log("geo::::", geo);

    return geo;
  } catch (err) {
    console.warn("Geo lookup failed for IP:", ip, err);
    return { country: "Unknown", region: "", city: "", lat: 0, lon: 0 };
  }
}

export const trackEvents = async (req: Request, res: Response) => {

  console.log("Api-trak:", req.body)
  const sessionId = req.cookies.sessionId || "anonymous";
  const slug = req.body.slug || "unknown";
  const type = req.body.type;

  try {
    if (!type)
      return res
        .status(400)
        .json({ success: false, message: "Missing event type" });

    const clickTarget = req.body.meta?.clickTarget || "unknown";
    const key = `${sessionId}:${slug}:${type}:${clickTarget}`;
    const now = Date.now();

    // pick TTL by event type, fallback to VIEW_TTL
    const ttl = CACHE_TTL[type as keyof typeof CACHE_TTL] || VIEW_TTL;

    // clean old entries
    for (const [k, t] of recentEvents) {
      if (now - t > ttl) recentEvents.delete(k);
    }

    // dedupe
    if (recentEvents.has(key) && now - (recentEvents.get(key) || 0) < ttl) {
      return res
        .status(200)
        .json({ success: false, message: `Duplicate ${type} ignored` });
    }

    recentEvents.set(key, now);

    // Extract client IP
    const rawIp =
      (req.headers["x-forwarded-for"] as string) ||
      req.socket.remoteAddress ||
      "";
    const ip = rawIp.includes(",") ? rawIp.split(",")[0].trim() : rawIp;
    // const ip = "43.243.133.102"

    // Enrich with geolocation
    const geo = await enrichGeo(ip);

    const event = {
      ...req.body,
      id: uuid(),
      sessionId,
      createdAt: new Date().toISOString(),
      ip,
      geo, // ✅ Add geo info here
    };

    const logsDir = path.join(baseDir, "logs"); // folder path
    const logPath = path.join(logsDir, "analytics.log"); // file path

    // Ensure the folder exists
    await fsPromises.mkdir(logsDir, { recursive: true });

    // Ensure the file exists
    await fsPromises.access(logPath).catch(async () => {
      await fsPromises.writeFile(logPath, ""); // create empty file if missing
    });

    await fsPromises.appendFile(logPath, JSON.stringify(event) + "\n");

    res.status(201).json({ success: true });
  } catch (error) {
    console.error("Analytics log error:", error);
    res.status(500).json({ success: false });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    const logPath = path.join(baseDir, "logs", "analytics.log");

    // Read the entire log file
    const content = await fsPromises.readFile(logPath, "utf8");

    // Split into lines and filter out empty ones
    const lines = content.split("\n").filter((line) => line.trim() !== "");

    // Parse each line safely
    const allEvents: TrackingEvent[] = [];
    for (const line of lines) {
      try {
        allEvents.push(JSON.parse(line));
      } catch {
        console.warn("Skipping malformed line in analytics.log");
      }
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const type = req.query.type as string | undefined;
    const range = req.query.range as string | undefined; // 👈 add support for ?range=

    // 🔹 Filter by event type
    let filtered = allEvents;
    if (type && ["view", "click", "hover", "custom"].includes(type)) {
      filtered = filtered.filter((e) => e.type === type);
    }

    // 🔹 Filter by date range
    if (range && range !== "all") {
      const now = new Date();
      let startDate: Date | null = null;

      switch (range) {
        case "1w":
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
          break;
        case "2w":
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 14);
          break;
        case "1m":
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 1);
          break;
        case "6m":
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 6);
          break;
      }

      if (startDate) {
        filtered = filtered.filter((e) => {
          const eventDate = new Date(e.createdAt);
          return eventDate >= startDate;
        });
      }
    }

    // 🔹 Sort newest first (optional)
    filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // 🔹 Paginate
    const paginated = filtered.slice(offset, offset + limit);

    const sortedStats = filtered.reduce(
      (acc, e) => {
        const slug = e.slug || "Unknown";

        if (!acc[slug]) {
          acc[slug] = {
            slug,
            views: 0,
            clicks: 0,
            hovers: 0,
            custom: 0,
            total: 0,
          };
        }

        if (e.type === "view") acc[slug].views++;
        if (e.type === "click") acc[slug].clicks++;
        if (e.type === "hover") acc[slug].hovers++;
        if (e.type === "custom") acc[slug].custom++;

        acc[slug].total++;

        return acc;
      },
      {} as Record<
        string,
        {
          slug: string;
          views: number;
          clicks: number;
          hovers: number;
          custom: number;
          total: number;
        }
      >
    );
    const sortedPages = Object.values(sortedStats).sort(
       (a, b) => b.total - a.total
    )

    res.status(200).json({
      success: true,
      total: filtered.length,
      events: paginated,
      sortedPages: sortedPages,
    });
  } catch (error) {
    console.error("Analytics log error:", error);
    res.status(500).json({ success: false, error: "Failed to read log file" });
  }
};

export const getCharts = async (req: Request, res: Response) => {
  try {
    const logPath = path.join(baseDir, "logs", "analytics.log");

    // Read file
    const content = await fsPromises.readFile(logPath, "utf8");
    const lines = content.split("\n").filter((l) => l.trim() !== "");

    // Parse lines
    const events: TrackingEvent[] = [];
    for (const line of lines) {
      try {
        events.push(JSON.parse(line));
      } catch {
        console.warn("Skipping malformed analytics.log line");
      }
    }

    const type = req.query.type as string | undefined;
    const range = req.query.range as string | undefined;

    // ---- FILTER BY TYPE ----
    let filtered = events;
    if (type && ["view", "click", "hover", "custom"].includes(type)) {
      filtered = filtered.filter((e) => e.type === type);
    }

    // ---- FILTER BY DATE RANGE ----
    if (range && range !== "all") {
      const now = new Date();
      let startDate: Date | null = null;

      switch (range) {
        case "1w":
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case "2w":
          startDate = new Date(now.setDate(now.getDate() - 14));
          break;
        case "1m":
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case "6m":
          startDate = new Date(now.setMonth(now.getMonth() - 6));
          break;
      }

      if (startDate) {
        filtered = filtered.filter((e) => new Date(e.createdAt) >= startDate);
      }
      // console.log({
      //     range,
      //     startTime: new Date(startDate || 0).toISOString(),
      //     eventCountBefore: events.length,
      //     eventCountAfter: filtered.length,
      //   });
    }

    // ---- AGGREGATION FOR CHARTS ----
// 1. Total time per page
const durationTotalsByPage: Record<string, number> = {};

// 2. Average time per page
const durationCountsByPage: Record<string, number> = {};
    // 1. Count by type
    const countsByType: Record<string, number> = {};
    for (const e of filtered) {
      countsByType[e.type] = (countsByType[e.type] || 0) + 1;
    }

    // 2. Duration buckets (if durationOnPage exists)
    const durationBuckets = {
      "0-5s": 0,
      "5-15s": 0,
      "15-30s": 0,
      "30-60s": 0,
      "60s+": 0,
    };

    function hasDuration(meta: any): meta is { durationOnPage: number } {
      return meta && typeof meta.durationOnPage === "number";
    }
    for (const e of filtered) {
  if (e.type !== "view" || !hasDuration(e.meta)) continue;

  const slug = e.slug;
  const d = e.meta.durationOnPage;

  // 1. total duration per page
  durationTotalsByPage[slug] = (durationTotalsByPage[slug] || 0) + d;

  // 2. average duration per page preparation
  durationCountsByPage[slug] = (durationCountsByPage[slug] || 0) + 1;

  // 3. duration buckets
  if (d < 5) durationBuckets["0-5s"]++;
  else if (d < 15) durationBuckets["5-15s"]++;
  else if (d < 30) durationBuckets["15-30s"]++;
  else if (d < 60) durationBuckets["30-60s"]++;
  else durationBuckets["60s+"]++;
}
    // 3. Geo distribution
    const geoCounts: Record<string, number> = {};

    for (const e of filtered) {
      const country = e.geo?.country || "Unknown";
      geoCounts[country] = (geoCounts[country] || 0) + 1;
    }

    const durationAveragesByPage: Record<string, number> = {};
for (const slug in durationTotalsByPage) {
  durationAveragesByPage[slug] =
    durationTotalsByPage[slug] / durationCountsByPage[slug];
}

    // ---- RETURN ----
    return res.status(200).json({
      success: true,
      total: filtered.length,
      countsByType,
      durationBuckets,
      durationTotalsByPage,
      durationAveragesByPage,
      geoCounts,
      events: filtered, // optional → remove if charts only
    });
  } catch (error) {
    console.error("Chart analytics error:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to load chart analytics" });
  }
};

// async function getEventPath() {
//    const logPath = path.join(__dirname, "..", "logs", "analytics.log");
//    const file = await fsPromises.readFile(logPath, "utf8");
//    const events = JSON.parse(file)
// }
