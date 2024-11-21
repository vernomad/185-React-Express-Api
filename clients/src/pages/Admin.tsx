import { useEffect, useState } from "react";
import { useRoutes } from "react-router-dom";
import { useUser } from '../useUser';

export default function Admin() {
  const { userToken, user } = useUser();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = process.env.VITE_BASE_URL || 'https://185.valab.cloud';

 useEffect(() => {
    const fetchUserData = async () => {
      try {      
        const response = await fetch(`${baseUrl}/api/user`, {
          method: "GET",
          headers: userToken ? { "Authorization": `Bearer ${userToken}` } : {},
          // headers: {
          //   "Authorization": userToken ? `Bearer ${userToken}` : "",
          // },
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
let content
  if (user?.roles.includes('Admin')) {
    content = <div>User is Admin</div>;
  }

  const routes = useRoutes([
    {
      path: "",
      element: (
        <>
        <div className="container">
         
          {error && <p>{error}</p>} {/* Render error message if there is an error */}
          {userData ? (
            <div>
               <h1>Admin</h1>
             {content && content}
              <h2>User Data</h2>
              <pre>{JSON.stringify(userData, null, 2)}</pre>
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
