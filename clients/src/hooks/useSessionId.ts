import { useEffect, useState } from "react";
import { baseUrl } from "../lib/baseUrl";

export default function useSessionId() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${baseUrl}/api/session`, {
      method: "GET",
      credentials: "include", // <-- include cookies
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // Expect the server to respond with something like: { sessionId: "abc123" }
        setSessionId(data.sessionId || null);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return { sessionId, loading, error };
}
