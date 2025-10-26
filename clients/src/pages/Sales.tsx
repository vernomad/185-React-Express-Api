import { useRoutes } from "react-router-dom";
import SalesComponent from "../components/page/Sales";


export default function Sales() {
    const routes = useRoutes([
        {
          path: "",
          element: <SalesComponent />,
        },
      ]);
      return routes;
}
