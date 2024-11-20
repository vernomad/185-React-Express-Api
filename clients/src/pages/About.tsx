import { useRoutes } from "react-router-dom";
import Info from "../components/page/Info";

export default function About() {
    const routes = useRoutes([
        {
          path: "",
          element: <Info />,
        },
      ]);
      return routes;
}
