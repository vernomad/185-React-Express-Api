import { useRoutes } from "react-router-dom";
import Info from "../components/page/Info";
import ErrorBoundary from "../components/ui/ErrorBoundary";

export default function About() {
    const routes = useRoutes([
        {
          path: "",
          element: <ErrorBoundary><Info /></ErrorBoundary>,
        },
      ]);
      return routes;
}
