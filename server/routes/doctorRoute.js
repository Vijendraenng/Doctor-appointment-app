import express from "express";
import {
  appointmentCancel,
  appointmentComplete,
  appointmentDoctor,
  doctorDashboard,
  doctorList,
  doctorProfile,
  loginDoctor,
  updateDoctorProfile,
} from "../controllers/doctorsController.js";
import authDoctor from "../middleware/authDoctor.js";

const doctorRouter = express.Router();

doctorRouter.get("/doctot-list", doctorList);
doctorRouter.post("/login", loginDoctor);
doctorRouter.get("/doctor-appointment", authDoctor, appointmentDoctor);
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel);
doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete);
doctorRouter.get("/doctor-dashboard", authDoctor, doctorDashboard);
doctorRouter.get("/doctor-profile", authDoctor, doctorProfile);
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile);

export default doctorRouter;
