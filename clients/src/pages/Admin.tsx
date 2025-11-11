// pages/Admin.tsx
import { useUser } from "../useUser";
import { hasPermission, Role } from "../lib/auth";
import { useAuthVerify } from "../hooks/useAuthVerify";
import UserSection from "../components/admin/UserSection";
import ProjectSection from "../components/admin/ProjectSection";
import EventSection from "../components/admin/EventSection";
import { baseUrl } from "../lib/baseUrl";
// import ShowButton from "../components/buttons/ShowButton";
import { usePageView } from "../hooks/usePageView";
import AnalyticsSection from "../components/admin/AnalyticSection";
import ShowCtaButton from "../components/buttons/ShowCtaButton";

export default function Admin() {
  usePageView('/admin')
  const { user } = useUser();

  const {
    userToken,
    verified,
    error: authError,
    loading: authLoading,
  } = useAuthVerify(baseUrl);

 if (!verified || authError) return <div className="admin-errors"><p className="loading-error">Not authenticated <span className="errors">{authError}</span></p></div>;

  if (authLoading) return (
      <div className="admin-errors">
        <h1 className="loading-error">Loading...</h1>
        
      </div>
    );

  let content = null;
  let authUser: { id: string; role: Role } | null = null;
  if (user) {
    const validRole = user.roles.find((role) =>
      ["admin", "editor", "user"].includes(role)
    ) as Role | undefined;

    if (!validRole) throw new Error("No valid role found for user");

      authUser = { role: validRole, id: user.id };

    content =
    authUser.role === "admin" ? (
      <p>Welcome admin {user.username} who has full permissions</p>
    ) : authUser.role === "editor" ? (
         <p>Welcome editor {user.username} who has access to partial permissions</p>
    ) : (
      <p>Welcome {user.username} who does not havwe full and only partial permissions</p>
    );
  }

  return (
    <div className="admin-wrapper">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin</h1>
          {content}
        </div>
      </div>
      
        {/* {userError && <span className="errors">{userError}</span>} */}
        {authUser && hasPermission(authUser, "create:users") && (
        <UserSection verified={verified}  userToken={userToken ?? ""} />    
        )} 
        {authUser && hasPermission(authUser, "create:projects") && (
        <ProjectSection />
        )} 
        {authUser && hasPermission(authUser, "create:events") && (
        <EventSection />
         )} 
         <AnalyticsSection />
      <div className="admin-secret">
        {/* <ShowButton 
        showWhat="Show secret"
        content={
          <img src="/assets/img/600.jpg" />
        }
        /> */}
        <ShowCtaButton
        showWhat="ShowSecret"
         content={
          <img src="/assets/img/600.jpg" />
        }
         />
      </div>
    </div>
  );
}
