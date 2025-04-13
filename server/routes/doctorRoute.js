import express from "express";
import { doctorList } from "../controllers/doctorsController.js";

const doctorRouter = express.Router();

doctorRouter.get("/doctot-list", doctorList);

export default doctorRouter;
