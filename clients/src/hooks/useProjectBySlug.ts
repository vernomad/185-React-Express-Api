import { useEffect, useState } from "react";
import type { ProjectEntry } from "@models/project/ProjectLog";
import { baseUrl } from "../lib/baseUrl";

export default function useProjectBySlug(slug: string) {
  const [projectById, setProject] = useState<ProjectEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!slug) return;

    const controller = new AbortController();

    fetch(`${baseUrl}/api/project/${slug}`, { signal: controller.signal, credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data: ProjectEntry) => setProject(data))
      .catch((err) => {
        if (err.name !== "AbortError") setError(err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [slug]);

  return { projectById, loading, error };
}
