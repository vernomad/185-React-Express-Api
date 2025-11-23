import { useEffect, useState } from "react";
import type { ProjectEntry } from "@models/project/ProjectLog";
import { baseUrl } from "../lib/baseUrl";

export default function useProjectById(id: string) {
  const [projectById, setProject] = useState<ProjectEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    fetch(`${baseUrl}/api/project/${id}`, { signal: controller.signal, credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}. Contact i t support...`);
        return res.json();
      })
      .then((data: ProjectEntry) => setProject(data))
      .catch((err) => {
        if (err.name !== "AbortError") setError(err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [id]);

  return { projectById, loading, error };
}
