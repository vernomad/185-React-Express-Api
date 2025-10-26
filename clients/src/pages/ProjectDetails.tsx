import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useRef } from "react";
import useProjectBySlug from "../hooks/useProjectBySlug";
import { useIsMobile } from "../lib/deviceDetect";
import { usePageView } from "../hooks/usePageView";
// import ImageLoader from "../components/image-comp/DetailsImageLoader";

export default function ProjectDetail() {
  const { id, project } = useParams(); // slug + filename
  const slug = project ?? "";
  const navigate = useNavigate();

  usePageView(`/projects/${slug}`)

  const { projectById } = useProjectBySlug(slug);
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

  //console.log("All images main", allImages)

  // State for main image — default to `id` from URL if present
  const [activeImage, setActiveImage] = useState("");

  console.log("Active image", activeImage)

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

  if (!projectById) return <p>Loading...</p>;

  return (
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
            {/* <ImageLoader 
            className="full"
            /> */}
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
          {allImages.map((image, index) => {
            const fileName = image.split("/").pop() ?? "";
            return (
              <div className="thumbnail-item"
              key={fileName}
              style={{
                border: activeImage === image ? "2px solid black" : "1px solid #ccc",
              }}
              >
                <picture>
               <img
                src={image}
                alt={`Thumbnail ${index}`}
                onClick={() => {
                  setActiveImage(image);
                  navigate(`/projects/${slug}/${fileName}`); // update URL with clicked file
                }}
              />
                </picture>
              
              </div>
            );
          })}

        </div>
         
      </div>
    </div>
  );
}
