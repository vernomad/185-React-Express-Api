export function getAltFromPath(path: string) {
  // Extract filename without directories
  const fileName = path.split("/").pop() || "";
  // Remove extension
  const nameWithoutExt = fileName.split(".")[0];
  // Replace dashes or underscores with spaces
  return nameWithoutExt.replace(/[-_]/g, " ");
}

