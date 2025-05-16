import { useEffect, useState } from "react";
import { useRoutes } from "react-router-dom";
import { useUser } from "../useUser";
import { hasPermission, Role } from "../lib/auth";

interface UserToken {
 token: string | null;
  // Add other fields as necessary based on the API response
}

export default function Admin() {
  const { user } = useUser();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [userToken, setUserToken] = useState<UserToken | null>(null);
  const [verified, setIsVerified] = useState(false)
  const [loading, setLoading] = useState<boolean>(true);

   const baseUrl =
    import.meta.env.MODE === 'development'
      ? import.meta.env.VITE_DEV_URL
      : import.meta.env.VITE_BASE_URL;

console.log("User in admin", user)

 useEffect(() => {
  const fetchToken = async () => {
     try {
        const response = await fetch(`${baseUrl}/api/auth/verify`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
       console.log('User is not authenticated.');
        } else {
           const result = await response.json();
           setUserToken(result.userToken)
           setIsVerified(true)
        }
  } catch (error) {
     console.error('Error verifying authentication:', error);
  }
 }
 fetchToken()
 }, [baseUrl]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (verified) {
      try {
        const response = await fetch(`${baseUrl}/api/user`, {
          method: "GET",
          headers: userToken ? { Authorization: `Bearer ${userToken}` } : {},
          credentials: "include", // To send cookies with the request
        });

        if (response.ok) {
          const data = await response.json();
         // Set the user data if the request is successful
         setLoading(false)
        setUserData(data); 

        } else {
          // Handle errors like 403 Forbidden
          setError("You are not authorized to view this data.");
        }
      } catch (err) {
        setError("Failed to fetch user data.");
        console.error(err);
      }
    };
  }
    fetchUserData();
  }, [userToken, baseUrl, verified]);


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
          <div className="login-permission">
            <p>User is admin with create projects permissons</p>
          </div>
        ): (
          <div className="login-permission">
            <p>User is not admin and without create projects permissons</p>
          </div>
        )}
      </div>
    );
  }

  const routes = useRoutes([
    {
      path: "",
      element: (
        <>
        {loading && (
          <>
           <div className="container"><h1>Loading...</h1></div>
          </>
        )}
          <div className="admin-container">
            {error && <p>{error}</p>}{" "}
            {/* Render error message if there is an error */}
            {userData ? (
              <div className="wrapper-users">
                <h1>Admin</h1>
                {content && content}
                <h2>User Data</h2>
                {/* {userData  && Array.forEach(data => {
                
              })} */}
              <div>
                <pre>{JSON.stringify(userData, null, 1)}</pre>
                </div>
              </div>
            ) : (
              <p>Loading user data...</p>
            )}
          </div>
          <div className="admin-container">
            <h2>Upload projects</h2>
          </div>
        </>
      ),
    },
  ]);

  return routes;
}
