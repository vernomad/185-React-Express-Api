import { useEffect, useState } from "react";
import { useRoutes } from "react-router-dom";
import { useUser } from "../useUser";
import { hasPermission, Role } from "../lib/auth";

export default function Admin() {
  const { userToken, user } = useUser();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState<string | null>(null);

  let baseUrl = "";

  if (import.meta.env.MODE === "development") {
    baseUrl = import.meta.env.VITE_DEV_URL;
  } else {
    baseUrl = import.meta.env.VITE_BASE_URL;
  }
console.log("User in admin", user)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/user`, {
          method: "GET",
          headers: userToken ? { Authorization: `Bearer ${userToken}` } : {},
          credentials: "include", // To send cookies with the request
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data); // Set the user data if the request is successful
        } else {
          // Handle errors like 403 Forbidden
          setError("You are not authorized to view this data.");
        }
      } catch (err) {
        setError("Failed to fetch user data.");
        console.error(err);
      }
    };

    fetchUserData();
  }, [userToken, baseUrl]);
  let content;
  if (user) {
    const validRole = user.roles.find((role) =>
      ["admin", "editor", "user"].includes(role)
    ) as Role | undefined;

    if (!validRole) {
      throw new Error("No valid role found for user");
    }

    const authUser: { id: string; role: Role } = {
      role: validRole,
      id: user.id,
    };

    content = (
      <div>
        {hasPermission(authUser, "create:projects") ? (
          <>
            <div>User is admin with create projects permissons</div>
          </>
        ): (
          <>
            <div>User is not admin and without create projects permissons</div>
          </>
        )}
      </div>
    );
  }

  const routes = useRoutes([
    {
      path: "",
      element: (
        <>
          <div className="container">
            {error && <p>{error}</p>}{" "}
            {/* Render error message if there is an error */}
            {userData ? (
              <div className="wrapper-users">
                <h1>Admin</h1>
                {content && content}
                <h2>User Data</h2>
                {/* {userData  && Array.forEach(data => {
                
              })} */}
                <pre>{JSON.stringify(userData, null, 1)}</pre>
              </div>
            ) : (
              <p>Loading user data...</p>
            )}
          </div>
          <div className="container">
            <h2>Upload projects</h2>
          </div>
        </>
      ),
    },
  ]);

  return routes;
}
