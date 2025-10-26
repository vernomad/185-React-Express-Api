import fs from "fs";
import path from "path";
import fsPromises from "fs/promises";
import { ProjectEntry } from "../../models/project/ProjectLog";

const jsonDir = path.join(process.cwd(), "data");

/**
 * Save a ProjectEntry to a JSON file.
 * @param data - Zod-validated ProjectEntry
 * @param projectName - Name of the project (used for folder)
 * @param fileName - JSON file name (e.g., "cars.json")
 */
export async function saveProject(
  data: ProjectEntry,
  projectName: string,
  fileName: string
) {
  try {
    const projectDir = path.join(jsonDir, projectName);
    await fsPromises.mkdir(projectDir, { recursive: true }); // only directory

    const filePath = path.join(projectDir, fileName); // JSON file path

    let existingData: ProjectEntry[] = [];

    if (fs.existsSync(filePath) && (await fsPromises.stat(filePath)).isFile()) {
      const raw = await fsPromises.readFile(filePath, "utf8");
      existingData = JSON.parse(raw);
    }

    existingData.push(data);

    await fsPromises.writeFile(filePath, JSON.stringify(existingData, null, 2), "utf8");

    return existingData;
  } catch (err) {
    console.error("Error saving project:", err);
    throw err;
  }
}

