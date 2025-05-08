import { useRoutes } from "react-router-dom";
import ProjectsComponet from "../components/page/Projects";
// import { useUser } from '../useUser';
// import Admin from "./Admin";


export default function Projects() {
  //  const { user } = useUser();

  //  const isAdmin = user?.roles.includes("Admin");


  const routes = useRoutes([
    {
      path: "",
      element: <ProjectsComponet />,
    },
    // {
    //   path: "",
    //   element: isAdmin && <Admin />,
    // },
  ]);
  return routes;
}
