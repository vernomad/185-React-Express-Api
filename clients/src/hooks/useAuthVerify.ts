// hooks/useAuthVerify.ts
import { useEffect, useState } from "react";

export function useAuthVerify(baseUrl: string) {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/auth/verify`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          const err = await res.json();
          setError(err.reason || "Verification failed");
          setVerified(false);
        } else {
          const { userToken } = await res.json();
          setUserToken(userToken);
          setVerified(true);
        }
      } catch {
        setError("Failed to verify authentication.");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [baseUrl]);

  return { userToken, verified, error, loading };
}
