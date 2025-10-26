import { useEffect, useState } from "react";
import type { ProjectEntry } from "@models/project/ProjectLog";
import { baseUrl } from "../lib/baseUrl";

export default function useProjectData() {
  const [projects, setProjects] = useState<ProjectEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
 const controller = new AbortController();

    fetch(`${baseUrl}/data/cars/cars.json`, { signal: controller.signal, credentials: "include" })
      .then((res) => res.json())
      .then((data: ProjectEntry[]) => setProjects(data))
      .catch((err) => {
      if (err.name !== "AbortError") {
        setError(err);
      }
    })
      .finally(() => setLoading(false));

        return () => controller.abort();
  }, []);

  return { projects, loading, error };
}