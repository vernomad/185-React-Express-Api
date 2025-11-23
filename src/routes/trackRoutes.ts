import express from "express";
import { trackEvents, getEvents, getCharts } from "../controllers/trackController";

const trackRoutes = express.Router();

trackRoutes.post("/track", trackEvents);

trackRoutes.get("/analytics", getEvents)

trackRoutes.get("/analytics/charts", getCharts)

export default trackRoutes;
