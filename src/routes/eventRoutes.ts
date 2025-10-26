import express from "express";
import { 
    getEvent, 
    getEvents, 
    createEvent, 
    updateEvent, 
    deleteEvent } from "../controllers/eventController";
import { validateIdParam } from "../controllers/validateIds";
import { upload } from "../utils/multer";    
import { validateData } from "../middleware/validationMiddleware";
import {UpdateCalendarEventSchema} from '../../models/event/EventLog'

const eventRouter = express.Router()

eventRouter.post(
    "/",
    upload.fields([
    { name: "image", maxCount: 1 },
  ]), 
  createEvent
);

eventRouter.get("/:id", validateIdParam, getEvent);

eventRouter.get("/", getEvents);

eventRouter.patch(
    "/:id",
     upload.fields([
    { name: "image", maxCount: 1 },
  ]),
  validateIdParam,
  validateData(UpdateCalendarEventSchema),
  updateEvent
);

eventRouter.delete(
    "/:id",
    validateIdParam,
    deleteEvent
);

export default eventRouter