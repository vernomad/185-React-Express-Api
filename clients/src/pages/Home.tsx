import { useRoutes } from "react-router-dom";
import HomeComponet from "../components/page/HomeComponent";
// import { useUser } from '../useUser';
// import Admin from "./Admin";


export default function Home() {
  //  const { user } = useUser();

  //  const isAdmin = user?.roles.includes("Admin");


  const routes = useRoutes([
    {
      path: "",
      element: <HomeComponet />,
    },
    // {
    //   path: "",
    //   element: isAdmin && <Admin />,
    // },
  ]);
  return routes;
}
