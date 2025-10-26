import { useState } from "react";
import UpdateUserForm from "../forms/UpdateUser";
import FetchUserForm from "../forms/FetchUser";
import {  UserLogEntryWithId } from "../../../../models/user/UserLog";

type ReadMoreProps = {
  // userId: string;
  token: string;
};

export default function UpdateUsers({  token }: ReadMoreProps) {
  const [expanded, setExpanded] = useState(false);
   const [user, setUser] = useState<UserLogEntryWithId | null>(null);

  //const toggleExpansion = () => setExpanded(!expanded);
  // if (expanded) {
  //   console.log("userId and token", userId, token )
  // }

  return (
    <>
      
        {expanded && token && (
        <div className="button-wrapper">
          {!user ? (
            // Show fetch form if we don’t have the user yet
            <FetchUserForm token={token} onUserFetched={setUser} />
          ) : (
            // Show update form if we have the user
            <UpdateUserForm user={user} token={token} />
          )}
        </div>
      )}
        
      <button className={`readmore ${expanded ? "expanded" : ""}`} type="button" onClick={() => setExpanded((prev) => !prev)}>
        {expanded ? "Show less" : "Update user"}
      </button>
    </>
  );
}
