import { Request, Response, NextFunction } from "express";
import { v4 as uuid } from "uuid";
import fsPromises from 'fs/promises';
import path from "path";



async function logVisitor(sessionId: string, ip: string) {

    const logDir = path.join(__dirname, "..", "logs");
    const logFile = path.join(logDir, "visitors.log");
  try {
    // Ensure the logs directory exists
    await fsPromises.mkdir(logDir, { recursive: true });

    // Log format: timestamp, IP, sessionId
    const logLine = `${new Date().toISOString()} | ${ip} | ${sessionId}\n`;

    await fsPromises.appendFile(logFile, logLine, "utf8");
  } catch (err) {
    console.error("Failed to write visitor log:", err);
  }
}

/**
 * 
 * Middleware to assign a unique session🆔 cookie to each visitor.
 * Stores nothing server-side — the cookie itself is the ID.
 */
export default async function sessionMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.cookies.sessionId) {
      const newSessionId = uuid();

      res.cookie("sessionId", newSessionId, {
        httpOnly: true,
        secure: false, // true if HTTPS
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7,
        path: "/" // 1 week
      });

      req.sessionId = newSessionId;

      // Log only new visitors
      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
      await logVisitor(newSessionId, Array.isArray(ip) ? ip[0] : ip);
    } else {
      req.sessionId = req.cookies.sessionId;
    }

    next();
  } catch (err) {
    console.error("Session middleware error:", err);
    next();
  }
}
