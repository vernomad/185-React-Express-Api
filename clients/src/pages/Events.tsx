import { useRoutes } from "react-router-dom";
import EventComponent from "../components/page/Events";
import ErrorBoundary from "../components/ui/ErrorBoundary";

export default function Events() {
    const routes = useRoutes([
        {
          path: "",
          element: <ErrorBoundary><EventComponent /></ErrorBoundary>,
        },
      ]);
      return routes;
}
