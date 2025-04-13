import express from "express";
import {
  addDoctor,
  adminDashboard,
  allDoctors,
  appointmentAdmin,
  appointmentCancel,
  loginAdmin,
} from "../controllers/adminController.js";
import upload from "../middleware/multer.js";
import authAdmin from "../middleware/authAdmin.js";
import { changeAvailability } from "../controllers/doctorsController.js";

const adminRouter = express.Router();

adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/all-doctors", authAdmin, allDoctors);
adminRouter.post("/change-availability", authAdmin, changeAvailability);
adminRouter.get("/all-apointments", authAdmin, appointmentAdmin);
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);
adminRouter.get("/admin-dashboard", authAdmin, adminDashboard);

export default adminRouter;
