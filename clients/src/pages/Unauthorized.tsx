import { useRoutes } from "react-router-dom";
import UnauthorizedComponent from "../components/page/Unauthorized";

export default function Unauthorized() {
    const routes = useRoutes([
        {
          path: "",
          element: <UnauthorizedComponent />,
        },
      ]);
      return routes;
}
