import doctorModel from "../models/doctorModel.js ";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";

const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    const docData = await doctorModel.findById(docId);

    await doctorModel.findByIdAndUpdate(docId, {
      avilable: !docData.avilable,
    });
    res.json({ success: true, message: "Availablity Change" });
  } catch (error) {
    res.json({ success: true, message: error.message });
  }
};

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    res.json({ success: true, doctors });
  } catch (error) {
    res.json({ success: true, message: error.message });
  }
};
// Api for doctor login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      return res.json({ success: false, message: "invalid credentials " });
    }
    const isMatch = await bcrypt.compare(password, doctor.password);
    // const pass = await bcrypt(password);

    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "invalid credentials " });
    }
  } catch (error) {
    res.json({ success: true, message: error.message });
  }
};

// api to get all appointment for doctor pannel

const appointmentDoctor = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await appointmentModel.find({ docId });
    res.json({ success: true, appointments });
  } catch (error) {
    res.json({ success: true, message: error.message });
  }
};
// Api to mark completed appointment for doctor pannel
const appointmentComplete = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      return res.json({ success: true, message: "Appointment Completed" });
    } else {
      return res.json({ success: false, message: "Mark Failed" });
    }
  } catch (error) {
    res.json({ success: true, message: error.message });
  }
};
// Api to cancel appointment for doctor pannel
const appointmentCancel = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
      return res.json({ success: true, message: "Appointment cacelled" });
    } else {
      return res.json({ success: false, message: "cancellation Failed" });
    }
  } catch (error) {
    res.json({ success: true, message: error.message });
  }
};

// Api to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointment = await appointmentModel.find({ docId });
    let earnings = 0;

    appointment.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });
    let patient = [];
    appointment.map((item) => {
      if (!patient.includes(item.userId)) {
        patient.push(item.userId);
      }
    });
    const dashData = {
      earnings,
      appointments: appointment.length,
      patient: patient.length,
      latestAppointments: appointment.reverse().slice(0, 5),
    };
    res.json({ success: true, dashData });
  } catch (error) {
    res.json({ success: true, message: error.message });
  }
};

//  Api to get doctor profile data for doctor panel

const doctorProfile = async (req, res) => {
  try {
    const { docId } = req.body;
    const profileData = await doctorModel.findById(docId).select("-password");
    res.json({ success: true, profileData });
  } catch (error) {
    res.json({ success: true, message: error.message });
  }
};

// Api to update doc profile data for doctor panel
const updateDoctorProfile = async (req, res) => {
  try {
    const { docId, fees, address, avilable } = req.body;
    await doctorModel.findByIdAndUpdate(docId, { fees, address, avilable });
    res.json({ success: true, message: " profile updated" });
  } catch (error) {
    res.json({ success: true, message: error.message });
  }
};
export {
  changeAvailability,
  doctorList,
  loginDoctor,
  appointmentDoctor,
  appointmentComplete,
  appointmentCancel,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
};
