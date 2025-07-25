import { useRoutes } from "react-router-dom";
import ProjectsComponent from "../components/page/Projects";
import ProjectDetail from "./ProjectDetails.tsx"; // <== NEW
import ViewTransitionLayout from "../components/ViewTransitionsWrapper.tsx";

export default function Projects() {
  const routes = useRoutes([
    {
      path: "",
      element: (
        <ViewTransitionLayout clsName="projects" id="from">
          <ProjectsComponent />
        </ViewTransitionLayout>
      ),
    },
    {
      path: ":id", // <== This makes /projects/123 work
      element: (
        <ViewTransitionLayout clsName="projects" id="to">
          <ProjectDetail />
        </ViewTransitionLayout>
      ),
    },
  ]);
  return routes;
}
