import { useRoutes } from "react-router-dom";
import ContactComponent from "../components/page/Contact";
import ErrorBoundary from "../components/ui/ErrorBoundary";


export default function Contact() {
    const routes = useRoutes([
        {
          path: "",
          element: <ErrorBoundary><ContactComponent /></ErrorBoundary>,
        },
      ]);
      return routes;
}
