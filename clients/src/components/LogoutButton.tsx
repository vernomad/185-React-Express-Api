import { useState, useTransition } from "react";
import { SlLogout } from "react-icons/sl";
import { useRoutes } from "react-router-dom";



export default function Logout() {
  const [error, setError] = useState<null | string>(null);
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const isMutating = isFetching || isPending;
  
  const baseUrl = process.env.VITE_BASE_URL || 'https://185.valab.cloud';

    const handleLogout = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        try {
            setIsFetching(true);
            setError("")
            const res = await fetch(`${baseUrl}/api/auth/logout`, {
                method: "DELETE",
                headers: {
                    'content-type': 'application/json',
                },
                credentials: 'include'
            })
            if (!res.ok) {
                setError("Unable to log out. Please try again.");
            } else {
                startTransition(() => {
                    window.location.href = '/login'; 
                  })
            }
    
        } catch (error) {
            console.log(error)
        } finally {
            setIsFetching(false); // Reset fetching state
        }
    }
    const routes = useRoutes([
    
        {
          path: "admin",
          element: (
            <>
        {error && <span className="errors">{error}</span>}
        <button type="button"
        onClick={handleLogout} 
        disabled={isPending}
        style={{ opacity: !isMutating ? 1 : 0.7 }} 
        className="btn-logout">Logout <SlLogout />
        </button>
        </>
          )
         }
        ])
        return routes
}

