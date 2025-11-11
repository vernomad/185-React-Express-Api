import { useRoutes } from "react-router-dom";
import ProjectDetail from "./ProjectDetails.tsx"; 
import ViewTransitionLayout from "../components/ViewTransitionsWrapper.tsx";
import DiamondGridLoading from "../components/image-comp/diamond-grid-loading.tsx";
// import { TooltipWrapper } from "react-tooltip";
import useProjectData from "../hooks/useProjectData.ts";
import { usePageView } from "../hooks/usePageView.ts";
import ErrorBoundary from "../components/ui/ErrorBoundary.tsx";

export default function Projects() {
 const {projects, error, loading} = useProjectData()

usePageView('/projects')

  const routes = useRoutes([
    {
      path: "",
      element: (
        <ErrorBoundary>
        <div className="main-grid" id="main-grid-projects">
          <div id="3d-contact" className="container-3d">
            <div id="grid-lines-contact" className="grid-lines ceiling"></div>
            <div id="grid-lines-contact" className="grid-lines floor">
            </div>
  
        
       <div className="diamond-grid">
          <DiamondGridLoading error={error} loading={loading} projects={projects} />

          <div className="title-wrapper-projects">
      <h1 className="main__title projects__title">
        <span>185</span>Projects
      </h1><p>gallery</p>
          </div>
          </div>
          
           </div>
          </div>
       </ErrorBoundary>
        //    <ViewTransitionLayout clsName="projects" id="from">
        //   <ProjectsComponent />
        // </ViewTransitionLayout>
      ),
    },
    {
      path: ":project/:id", 
      element: (
        <div className="main-grid bg" id="main-grid-projects">
        <ViewTransitionLayout clsName="projects" id="to">
          <ProjectDetail />
        </ViewTransitionLayout>
        </div>

      ),
    },
  ]);
  return routes;
}
