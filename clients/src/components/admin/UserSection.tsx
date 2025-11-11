// components/admin/UserSection.tsx
import ShowButton from "../buttons/ShowButton";
import CreateUser from "../forms/CreateUser";
import UpdateUsers from "../buttons/UpdateUsers";
import FetchAllUsersJson from "../data/FetchUsersJson";
import { useUserData } from "../../hooks/useUserData";
import DeleteForm from "../forms/DeleteForm";

type Props = {
  userToken: string;
  verified: boolean;
};

export default function UserSection({  userToken, verified }: Props) {
   const {
    data,
    error,
    loading,
  } = useUserData( userToken, verified );

if (loading) return <p className="">Loading...</p>;
if (error) return <p>Failed: {error}</p>;
  return (
    <div className="admin-container">
      <h2>Users</h2>
     
        <>
          <ShowButton
            showWhat="Show users"
            content={
              <div className="button-wrapper">
                <FetchAllUsersJson userData={data} />
              </div>
            }
          />

           <UpdateUsers token={userToken} />

          <ShowButton
            showWhat="Create new user"
            content={
              <div className="button-wrapper">
                <CreateUser />
              </div>
            }
          />
         

          <ShowButton
            showWhat="Delete user"
            content={
              <div className="button-wrapper">
                <DeleteForm token={userToken} dir="user" />
              </div>
            }
          />
        </>
    </div>
  );
}
