import { useState, useTransition } from "react";


export default function LogoutHacker() {
  const [error, setError] = useState<null | string>(null);
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const isMutating = isFetching || isPending;
  
  // let baseUrl = ''

  // if (import.meta.env.MODE === 'development') {
  //   baseUrl = import.meta.env.VITE_DEV_URL
  // } else {
  //   baseUrl = import.meta.env.VITE_BASE_URL
  // }

    const handleLogout = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        try {
            setIsFetching(true);
            setError("")
            const res = await fetch("/api/auth/logoutHacker", {
                method: "DELETE",
                headers: {
                    'content-type': 'application/json',
                },
                credentials: 'include'
            })
            if (!res.ok) {
                setError("Unable to log out. Please try again.");
            } else {
              localStorage.removeItem("user")
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
  return (
            <>
        {error && <span className="errors">{error}</span>}
        <button type="button"
        onClick={handleLogout} 
        disabled={isPending}
        style={{ opacity: !isMutating ? 1 : 0.7 }} 
        className="dsfid"><span>dsfid</span>
        </button>
        </>
          )
       

}

