import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useRef } from "react";
import useProjectBySlug from "../hooks/useProjectBySlug";
import { useIsMobile } from "../lib/deviceDetect";
import { usePageView } from "../hooks/usePageView";
import ErrorBoundary from "../components/ui/ErrorBoundary";
import RefreshButton from "../components/buttons/RefreshButton";
import ImageLoader from "../components/image-comp/ThumbnailLoader";
import { useUser } from "../useUser";
// import ImageLoader from "../components/image-comp/CustomImageLoader";
// import ImageLoader from "../components/image-comp/DetailsImageLoader";

export default function ProjectDetail() {
  const {state} = useUser()
  const { id, project } = useParams(); // slug + filename
  const slug = project ?? "";
  const navigate = useNavigate();

  usePageView(`/projects/${slug}`)

  const { projectById, loading, error } = useProjectBySlug(slug);
  const isMobile = useIsMobile()

  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);

   const openModal = () => {
    setIsOpen(true);
    modalRef.current?.showModal();
  };

  const closeModal = () => {
    setIsOpen(false);
    modalRef.current?.close();
  };

  // Build gallery images
const allImages: string[] = useMemo(() => {
  if (!projectById) return [];
  
  const images = [
    projectById.mainImage?.full,
    ...(projectById.images?.map((img) => img.full) || []),
  ].filter(Boolean) as string[]; // remove null/undefined/''

  // De-duplicate by using Set
  return Array.from(new Set(images));
}, [projectById]);

 // console.log("All images main", allImages)
  // State for main image — default to `id` from URL if present
  const [activeImage, setActiveImage] = useState("");

  const black = state.preferences.theme === "dark" ? "#000" : "#191684"
  const white = state.preferences.theme === "light" ? "#000" : "#ccc"


  //console.log("Active image", activeImage)

  useEffect(() => {
    if (!projectById) return;

    if (id) {
      // Match against fileName if user clicked through with one
      const match = allImages.find((img) => img.endsWith(id));
      setActiveImage(match || projectById.mainImage?.full || '');
    } else {
      // Fallback to main image
      setActiveImage(projectById.mainImage?.full || '');
    }
  }, [id, projectById, allImages]);

  if (loading || error || !projectById) {
    if (loading) {
      return <div className="error-loading-project-details"><p className="loading-error">Loading...</p></div>
    }
    if (error) {
      return <div className="error-loading-project-details" style={{ height: "100dvh"}}>
        <p className="loading-error errors">Error: <span>{error.message}</span>
        <RefreshButton />
        </p></div>
    }
    if (!projectById) {
      return null
    }
    
  }
   
  return (
    <ErrorBoundary>
    <div className="projects-grid">
      <div className="img-wrapper-projects">
        <div className="projects-header-full">
         
          <div className="project-details">
             <h1 className="projects-title">{projectById.name}</h1>
            <p><span>Duration:</span> {projectById.duration?.join(", ")}</p>
            <p><span>Description:</span> {projectById.description}</p>
            {isMobile ? (
              <p>Is a mobile device</p>
            ): (
              <p>Is laptop or desktop</p>
            )}
          </div>
        </div>

        {/* Main Image */}
        <div className="projects-wrapper-full">
          <div className="view-wrapper">
            <button onClick={openModal} className="action-button open-button" type="button">view</button>
            <img
              className="full"
              src={activeImage}
              alt={projectById.name}
              onClick={() => navigate(-1)}
              style={{ cursor: "pointer", maxWidth: "100%" }}
            />
            <dialog ref={modalRef} className={isOpen ? "open" : ""}  id="modal">

              <img
              className="full mobile-dialog-img"
              src={activeImage}
              alt={projectById.name}
              //onClick={() => navigate(-1)}
              style={{ cursor: "pointer", maxWidth: "100%" }}
            /> 
           
             <button onClick={closeModal} className="action-button close-button" type="button">X</button>
            </dialog>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="thumbnail-gallery">
          {projectById.images?.map((img) => {
            const fileName = img.full.split("/").pop() ?? "";
            return (
              <div className="thumbnail-thumbnail"
              key={fileName}
               style={{
                border: activeImage === img.full ? `2px solid ${black}` : `1px solid ${white}`,
              }}
              >
              
               <ImageLoader
          imageUrl={img.full}
          thumbUrl={img.thumb}
          onClick={() => {
            setActiveImage(img.full);
            navigate(`/projects/${slug}/${fileName}`);
          }}
         
        />
               {/* <img
                src={image}
                alt={`Thumbnail ${index}`}
                onClick={() => {
                  setActiveImage(image);
                  navigate(`/projects/${slug}/${fileName}`); // update URL with clicked file
                }}
              /> */}
           
              
              </div>
            );
          })}

        </div>
         
      </div>
    </div>
    </ErrorBoundary>
  );
}
