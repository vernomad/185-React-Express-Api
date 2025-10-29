//Track controller
import { Request, Response } from 'express';
import { v4 as uuid } from "uuid";
// import fs from "fs/promises";
import fsPromises from "fs/promises";
import path from "path";
import { TrackingEvent } from "../types/trackTypes";

const baseDir = path.join(process.cwd(), "data")

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
    return geo;
  } catch (err) {
    console.warn("Geo lookup failed for IP:", ip, err);
    return { country: "Unknown", region: "", city: "", lat: 0, lon: 0 };
  }
}


export const trackEvents = async (req: Request, res: Response) => {
  const sessionId = req.cookies.sessionId || "anonymous";
  const slug = req.body.slug || "unknown";
  const type = req.body.type;

  try {
    if (!type) return res.status(400).json({ success: false, message: "Missing event type" });

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
      return res.status(200).json({ success: false, message: `Duplicate ${type} ignored` });
    }

    recentEvents.set(key, now);

    // Extract client IP
    const rawIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "";
    const ip = rawIp.includes(",") ? rawIp.split(",")[0].trim() : rawIp;

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
    // const allEvents: TrackingEvent[] =  JSON.parse(content);

     // Split into lines and filter out empty ones
    const lines = content.split("\n").filter(line => line.trim() !== "");

    // Parse safely
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

    // Filter by event type if requested
    let filtered = allEvents;
    if (type && ["view", "click", "hover", "custom"].includes(type)) {
      filtered = filtered.filter(e => e.type === type);
    }

    // Paginate
    const paginated = filtered.slice(offset, offset + limit);

    res.status(200).json({
      success: true,
      total: filtered.length,
      events: paginated,
    });

  } catch (error) {
    console.error("Analytics log error:", error);
    res.status(500).json({ success: false, error: "Failed to read log file" });
  }
};



// async function getEventPath() {
//    const logPath = path.join(__dirname, "..", "logs", "analytics.log");
//    const file = await fsPromises.readFile(logPath, "utf8");
//    const events = JSON.parse(file)
// }