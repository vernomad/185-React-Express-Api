import { useState } from "react";
import UpdateUserForm from "../forms/UpdateUser";
import FetchUserForm from "../forms/FetchUser";
import {  UserLogEntryWithId } from "../../../../models/user/UserLog";

type ReadMoreProps = {
  // userId: string;
  token: string;
};

export default function UpdateUsers({  token }: ReadMoreProps) {

   const [user, setUser] = useState<UserLogEntryWithId | null>(null);

  return (
    <>
      
        {token && (
        <>
          {!user ? (
            // Show fetch form if we don’t have the user yet
            <FetchUserForm token={token} onUserFetched={setUser} />
          ) : (
            // Show update form if we have the user
            <UpdateUserForm user={user} token={token} />
          )}
        </>
      )}
        
    </>
  );
}
