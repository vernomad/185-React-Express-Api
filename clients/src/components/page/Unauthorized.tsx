import { useUser } from "../../useUser"
// import { useSearchParams } from "react-router-dom"; 
import { usePageView } from "../../hooks/usePageView";
export default function UnauthorizedComponent() {
  usePageView('/unathorised')
const {user} = useUser()

const params = new URLSearchParams(window.location.search);
const pageIp = params.get("ip");

console.log("User:", user)
  return (
    <div className="unauthorized-container">
    <div className="container-400">
      <h1>Unauthorized</h1>
      <p>"400 Bad Request"</p>
      <div className="warning">
       <p>It appears you have arrived here via dubious actions and socially unacceptable behavior.</p>
       <p>Hacking is a low life crime and 185 does not take kindly to crimes of this nature.</p>
       <p>We now know where and who you are. There is nowhere to run... nowhere to hide...ip={user?.ip || pageIp}</p>
       </div>
    </div>
    </div>
  )
}
