import { useRoutes } from "react-router-dom";
import HomeComponet from "../components/page/HomeComponent";
import ErrorBoundary from "../components/ui/ErrorBoundary";
// import { useUser } from '../useUser';
// import Admin from "./Admin";


export default function Home() {
  //  const { user } = useUser();

  //  const isAdmin = user?.roles.includes("Admin");


  const routes = useRoutes([
    {
      path: "",
      element: <ErrorBoundary><HomeComponet /></ErrorBoundary>,
    },
    // {
    //   path: "",
    //   element: isAdmin && <Admin />,
    // },
  ]);
  return routes;
}
