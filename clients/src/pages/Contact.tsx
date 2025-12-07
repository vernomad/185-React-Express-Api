import { useRoutes } from "react-router-dom";
import ContactComponent from "../components/page/Contact";
import ErrorBoundary from "../components/ui/ErrorBoundary";
import { BlurLoadProvider } from "../components/image-comp/BlurLoadComponent";


export default function Contact() {
    const routes = useRoutes([
        {
          path: "",
          element: <ErrorBoundary>
            <BlurLoadProvider>
            <ContactComponent />
            </BlurLoadProvider>
            </ErrorBoundary>,
        },
      ]);
      return routes;
}
