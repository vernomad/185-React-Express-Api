// // hooks/useUserData.ts

// import { UserLogEntryWithId } from "@models/user/UserLog";
// import { useEffect, useState } from "react";

// export function useUserData(baseUrl: string, userToken: string | null, verified: boolean) {
//   const [data, setData] = useState<UserLogEntryWithId[]>([]); // 👈 array
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!verified || !userToken) return;

//     const fetchUserData = async () => {
//       try {
//         const res = await fetch(`${baseUrl}/api/user`, {
//           method: "GET",
//           headers: { Authorization: `Bearer ${userToken}` },
//           credentials: "include",
//         });

//         if (!res.ok) {
//           setError("You are not authorized to view this data.");
//         } else {
//          // throw new Error("failed to fetch data")
//           const json: UserLogEntryWithId[] = await res.json(); // 👈 expect array
//           setData(json);
//         }
//       } catch {
//         setError("Failed to fetch user data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, [baseUrl, userToken, verified]);

//   return { data, error, loading };
// }

import { useEffect, useState } from "react";
import { UserLogEntryWithId } from "@models/user/UserLog";
import { baseUrl } from "../lib/baseUrl";

interface UseUserDataResult {
  data: UserLogEntryWithId[];
  loading: boolean;
  error: string | null;
}

export function useUserData(
  userToken: string | null,
  verified: boolean,
): UseUserDataResult {
  const [data, setData] = useState<UserLogEntryWithId[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (!verified || !userToken) return;

  const controller = new AbortController();
  const { signal } = controller;

  const fetchUserData = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/user`,  {
        method: "GET",
        headers: { Authorization: `Bearer ${userToken}` },
        credentials: "include",
        signal, // pass the signal
      });

      if (!res.ok) {
        setError("You are not authorized to view this data.");
      } else {
        const raw = await res.json();

if (Array.isArray(raw)) {
  setData(raw as UserLogEntryWithId[]);
} else if (raw && Array.isArray(raw.users)) {
  // If API wraps in { users: [...] }
  setData(raw.users as UserLogEntryWithId[]);
} else {
  setData([]); // fallback
}
      }
    } catch (err: unknown) {
      if ((err as DOMException).name === "AbortError") {
        console.log("Fetch aborted");
      } else if (err instanceof Error) {
        setError(err.message || "Failed to fetch user data.");
      } else {
        setError("Failed to fetch user data.");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchUserData();

  return () => controller.abort(); // abort on unmount
}, [userToken, verified]);


  return { data, loading, error };
}
