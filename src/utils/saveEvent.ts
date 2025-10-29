import fs from "fs";
import path from "path";
import fsPromises from "fs/promises";

import {CalendarEventEntry} from "../../models/event/EventLog";
import { ensureDirExists } from "./saveProject";

const jsonDir = path.join(process.cwd(), "data");
// const dirPath =
//   process.env.NODE_ENV === "production"
//     ? path.join(__dirname, "..", "..", "data")   // project-root/data
//     : path.join(__dirname, "..", "data"); // dev: src/data

/**
 * Save a ProjectEntry to a JSON file.
 * @param data - Zod-validated CalendarEventEntry
 * @param eventName 
 * @param fileName - JSON file name (e.g., "events.json")
 */

export async function saveEvent(
    data: CalendarEventEntry,
    eventName: string,
    fileName: string,
) {

    try {
        await ensureDirExists(jsonDir)
        const eventDir = path.join(jsonDir, eventName)
        await fsPromises.mkdir(eventDir, { recursive: true });

        const filePath = path.join(eventDir, fileName);

        let existingData: CalendarEventEntry[] = []

         if (fs.existsSync(filePath) && (await fsPromises.stat(filePath)).isFile()) {
              const raw = await fsPromises.readFile(filePath, "utf8");
              existingData = JSON.parse(raw);
            }

         existingData.push(data);
         
             await fsPromises.writeFile(filePath, JSON.stringify(existingData, null, 2), "utf8");
         
             return existingData;

    } catch (err) {
        console.error("Error saving event:", err);
        throw err;
    }
    
}