import { useRoutes } from "react-router-dom";
import EventComponent from "../components/page/Events";

export default function Events() {
    const routes = useRoutes([
        {
          path: "",
          element: <EventComponent />,
        },
      ]);
      return routes;
}
