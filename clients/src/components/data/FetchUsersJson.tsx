import { useState } from "react";
import { UserLogEntryWithId } from "@models/user/UserLog";

type Props = {
  userData: UserLogEntryWithId[];
};

export default function FetchAllUsersJson({ userData }: Props) {
  const [selectedName, setSelectedName] = useState<string | null>(null);
    const [expanded, setExpanded] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleIsOpen = () => setIsOpen(!isOpen)
  
    const toggleExpansion = () => setExpanded(!expanded);

//console.log("userData in FetchAllUsersJson:", userData);
  const selectedUser = userData.find((p) => p.username === selectedName)


  return (
    <>
    <ul className="toggle-buttons">
      <li>
        <button onClick={toggleExpansion}>
            {expanded ? "Show Less" : "All"}
          </button>
      </li>
      {userData?.map((p) => (
        <li key={p._id}>
          <button onClick={() => [setSelectedName(p.username), toggleIsOpen()]}>
            {p.username}
          </button>
        </li>
      ))}
      
    </ul>

      {selectedUser && isOpen && (
        <div className="user-wrapper">
<pre>{JSON.stringify(selectedUser, null, 1)}</pre>
        </div>
        
      )}
      {expanded && (
        <div className="user-wrapper">
 <pre>{JSON.stringify(userData, null, 1)}</pre>
        </div>
     
      )}
     
    </>
   
  )
}