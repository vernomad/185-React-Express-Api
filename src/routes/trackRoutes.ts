import express from "express";
import { trackEvents, getEvents } from "../controllers/trackController";

const trackRoutes = express.Router();

trackRoutes.post("/track", trackEvents);

trackRoutes.get("/analytics", getEvents)

export default trackRoutes;
