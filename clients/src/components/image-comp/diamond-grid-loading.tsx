
import ImageLoader from './CustomImageLoader'
import type { ProjectEntry } from "@models/project/ProjectLog";

type DiamondType = {
  id: string;
  fileName: string;
  imagUrl: string;
  thumbUrl: string;
  slug: string;
  name: string;
}

interface Props {
  projects: ProjectEntry[]
  error: Error | null;
  loading: boolean;
}

export default function DiamondGridLoading({projects, error, loading}: Props) {


  const diamonData = projects.map((project: ProjectEntry) => {
   const fileName = project.mainImage?.full?.split("/").pop() ?? "";

    const item: DiamondType = {
      id: project.id,
      fileName: fileName,
      imagUrl: project.mainImage?.full || '',
      thumbUrl: project.mainImage?.thumb || '',
      slug: project.slug,
      name: project.name,
    }
    return item
  })
  
  // const images = [
  //   { imagUrl: '/assets/185/57chev.jpg', thumbUrl: '/assets/185/57chev-thumbnail.jpg', slug: "185", id: "57chev.jpg", ext: "jpg" },
    
  //    { imagUrl: '/assets/185/Porche-911-rad.jpeg', thumbUrl: '/assets/185/Porche-911-rad-thumbnail.jpeg', slug: "185", id: "Porche-911-rad.jpeg", ext: "jpeg" },
    
   
  //   { imagUrl: '/assets/185/Porche-911-scene.jpeg', thumbUrl: '/assets/185/Porche-911-scene-thumbnail.jpeg', slug: "185", id: "Porche-911-scene.jpeg", ext: "jpeg" },
  //   { imagUrl: '/assets/185/Cuda.jpg', thumbUrl: '/assets/185/Cuda-thumbnail.jpg', slug: "185", id: "Cuda.jpg", ext: "jpg" },
  // ];

   if (loading) return <p className='errors-message'>Loading projects...</p>;
  if (error) return <p className='errors-message'>Error: {error.message}</p>;

  return (
    <article className='gallery-diamond'>
      {diamonData && diamonData.map((data) => (
    
        <ImageLoader
          key={data.id}  // Unique key for each ImageLoader component
          className='img-container'
          imagUrl={data.imagUrl}
          thumbUrl={data.thumbUrl}
          slug={data.slug}
          id={data.fileName}
        />
      ))}
      {diamonData && diamonData.map((data) => (
    
        <ImageLoader
          key={data.id}  // Unique key for each ImageLoader component
          className='img-container'
          imagUrl={data.imagUrl}
          thumbUrl={data.thumbUrl}
          slug={data.slug}
          id={data.fileName}
        />
      ))}
       {/* {images.map((image, index) => (
        <ImageLoader
          key={index}  // Unique key for each ImageLoader component
          className='img-container'
          imagUrl={image.imagUrl}
          thumbUrl={image.thumbUrl}
          slug={image.slug}
          id={image.id}
        />
      ))} */}
      
      
    </article>
  )
}

