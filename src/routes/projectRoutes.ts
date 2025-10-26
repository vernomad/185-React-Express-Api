import express from "express";
import {
  getProject,
  getProjects,
  updateProject,
  deleteImage,
  deleteProject,
  createProject,
} from "../controllers/projectController";
import { validateIdParam } from "../controllers/validateIds";
import { upload } from "../utils/multer";
import { validateData } from "../middleware/validationMiddleware";
import { baseValidation } from "../../models/project/ProjectLog";

const projectRouter = express.Router();

// Create project with file uploads
projectRouter.post(
  "/",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "images", maxCount: 25 },
  ]),
  createProject
);
// Get single project
projectRouter.get("/:slugOrId",  getProject);

// Get all projects
projectRouter.get("/", getProjects);

// Update project
projectRouter.patch(
  "/:id",
    upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "images", maxCount: 25 },
  ]),
  validateIdParam,
  validateData(baseValidation.partial()), // allow partial updates
  updateProject
);

//Delete image
projectRouter.delete("/:slug/*", deleteImage)

// Delete project
projectRouter.delete("/:id", validateIdParam, deleteProject);

export default projectRouter;
