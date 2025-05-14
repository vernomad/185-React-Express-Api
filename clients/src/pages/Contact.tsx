import { useRoutes } from "react-router-dom";
import ContactComponent from "../components/page/Contact";


export default function Contact() {
    const routes = useRoutes([
        {
          path: "",
          element: <ContactComponent />,
        },
      ]);
      return routes;
}
