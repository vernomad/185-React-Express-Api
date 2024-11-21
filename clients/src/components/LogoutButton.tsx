import { useState, useTransition } from "react";
import { SlLogout } from "react-icons/sl";

const Logout = () => {
  const [error, setError] = useState<null | string>(null);
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const isMutating = isFetching || isPending;
  const baseUrl = process.env.VITE_BASE_URL || 'https://185.valab.cloud';

    const handleLogout = async () => {
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
                setError("Unable to logout. Please try again.");
            } else {
                startTransition(() => {
                    window.location.href = '/login'; 
                  })
            }
    
        } catch (error) {
            console.log(error)
        }
    }
   

    return <>{error && <span className="errors">{error}</span>}<button type="submit" onClick={handleLogout} disabled={isPending}
    style={{ opacity: !isMutating ? 1 : 0.7 }} className="btn-logout">Logout <SlLogout /></button></>
}

export default Logout