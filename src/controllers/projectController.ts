import { Request, Response } from 'express';
import {slugify} from '../utils/slugify';
// import fsPromises from "fs/promises";
// import { v4 as uuidv4 } from 'uuid';
import path from "path";
import fsPromises from "fs/promises";
import { ProjectEntry } from '../../models/project/ProjectLog';
import { deleteImg, deleteImages, saveImage, saveImages } from '../utils/imagesUtil';
import { saveProject } from '../utils/saveProject';


const baseDir = path.join(process.cwd(), "clients/public/assets");
const jsonDir = path.join(process.cwd(), "../data")

export const createProject = async (req: Request, res: Response) => {
  try {
    // Text fields
    const { name, description, duration } = req.body;


    const slug = slugify(name);

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
 // const file = req.file as { [fieldname: string]: Express.Multer.File };

  const mainImage = files["mainImage"]?.[0]; // single file
  const extraImages = files["images"] ?? []; ;

  let response: { mainImage: string, mainImageThumbnail: string } | null = null;

  if (mainImage !== null) {
   response = await saveImage(mainImage, slug)
  }

  let gallery = null;
if (extraImages.length > 0) {
  gallery = await saveImages(extraImages, slug); // using the multi-image saver
}

// Prepare the data in a structured format
    const body = {
    name: name,
    description: description,
    duration: Array.isArray(duration) ? duration : [duration],
    mainImage: response?.mainImage && response?.mainImageThumbnail
        ? {
            full: response.mainImage,
            thumb: response.mainImageThumbnail
        }
        : undefined,
    images: (gallery?.images || []).map((img, idx) => ({
        full: img,
        thumb: gallery?.imagesThumbnail?.[idx] || ''
    })),
    slug: slug,
    };

const validateData = ProjectEntry.parse(body)

console.log("Project:", validateData)

 const data = await saveProject(validateData, "cars", `cars.json`)
 //console.log("Data-saved:", data)

return res.status(200).json({ message: "Project saved", data });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating project" });
  }
};

export const getProject = async (req: Request, res: Response) => {
  const {slugOrId } = req.params;

  // console.log("SlugOrId recieved:", slugOrId)
  try {
    if (!slugOrId) {
      return res.status(403).json({ message: "Missing credentials" });
    }
    const cars = await getProjectJson()

    // ✅ sort the cars (example: alphabetical by name)
    const sortedCars = [...cars].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

     // ✅ match either UUID id or slug
    const project =
      sortedCars.find((car) => car.id === slugOrId) ||
      sortedCars.find((car) => car.slug === slugOrId);


    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (err) {
    console.error("Error retrieving project:", err);
    res.status(500).send("Error retrieving project");
  }
};

export const getProjects = async (req: Request, res: Response) => {
     const allProjects = {}
    try {
        if (allProjects) {
            res.status(200).json(allProjects)
        }
    } catch (err) {
        console.error("Error retrieving projects:", err);
        res.status(500).send("Error retrieving projects");
    }
}


export const updateProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { description, duration } = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  // console.log("Files:", files)
  // console.log("Req-body:", req.body)

  try {
    if (!id) {
      return res.status(400).json({ message: "Missing project id" });
    }
    const cars = await getProjectJson()

    const projectIndex = cars.findIndex((car: ProjectEntry) => car.id === id);
    if (projectIndex === -1) {
      return res.status(404).json({ message: "Project not found" });
    }

    const existingProject = cars[projectIndex];

    // 🚫 prevent name/slug changes
    // if (req.body.name || req.body.slug) {
    //   return res.status(400).json({ message: "Name and slug cannot be updated" });
    // }

    // 🔄 Handle file uploads
    let newMainImage = null;
    if (files?.mainImage?.[0]) {
      newMainImage = await saveImage(files.mainImage[0], existingProject.slug);
    }

    let newGallery = null;
    if (files?.images?.length > 0) {
      newGallery = await saveImages(files.images, existingProject.slug);
    }

    // ✅ Merge updates
    const updatedProject = {
      ...existingProject,
      description: description ?? existingProject.description,
      duration: duration
    ? Array.isArray(duration)
      ? duration
      : [duration]
    : existingProject.duration,
      mainImage: newMainImage
        ? {
            full: newMainImage.mainImage,
            thumb: newMainImage.mainImageThumbnail,
          }
        : existingProject.mainImage,
      images: newGallery
        ? [
            ...(existingProject.images || []), // append old ones
            ...newGallery.images.map((img, idx) => ({
              full: img,
              thumb: newGallery.imagesThumbnail[idx] || "",
            })),
          ]
        : existingProject.images,
    };

    cars[projectIndex] = updatedProject;
    const filePath = path.join("data/cars", "cars.json");
    await fsPromises.writeFile(filePath, JSON.stringify(cars, null, 2));

    return res.status(200).json({
      message: "Project updated",
      project: updatedProject,
    });
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json({ message: "Error updating project" });
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const dir = req.params[0];

 console.log("slugDir", slug, dir)
  if (!slug || !dir) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  try {
    const result = await deleteImg(slug, dir);

    if (!result) {
      // Directory not found case handled gracefully
      return res.status(404).json({
        message: `No directory found for slug: ${slug}`,
      });
    }

    return res.status(200).json({
      message: result.message,
    });

  } catch (err: any) {
    console.error(`Error deleting images for ${slug}:`, err);

    return res.status(500).json({
      message: err?.message || "Unexpected server error",
    });
  }
};



export const deleteProject = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    if (!id) {
      return res.status(400).json({ message: "Missing project ID" });
    }

    const cars = await getProjectJson();
    const sortedCars = [...cars].sort((a, b) => a.name.localeCompare(b.name));

    const index = sortedCars.findIndex((car) => car.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Remove the project
    const [deletedProject] = sortedCars.splice(index, 1);

        if (deletedProject?.slug) {
      const slug = deletedProject.slug;
      const dir = "clients/public/assets";
      try {
        await deleteImages(slug, dir);
      } catch (err) {
        console.error(`Error deleting images for ${slug}:`, err);
      }
    }

    // Write updated data back to file
    const filePath = path.join("data/cars", "cars.json");
    await fsPromises.writeFile(filePath, JSON.stringify(sortedCars, null, 2));

    res.status(200).json({
      message: "Project deleted successfully",
      deleted: deletedProject,
    });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ message: "Error deleting project" });
  }
};

async function getProjectJson() {
   const filePath = path.join("data/cars", "cars.json");
    const file = await fsPromises.readFile(filePath, "utf8");
    const cars = JSON.parse(file);

    return cars
}