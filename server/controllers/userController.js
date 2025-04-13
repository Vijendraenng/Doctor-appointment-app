import validator from "validator";
import bycrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import razorpay from "razorpay";
// Api to register user

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }
    // validating email formate
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }
    // validating strong password
    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a strong password" });
    }
    // hashng user password
    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt);
    const userData = { name, email, password: hashedPassword };
    const newUser = new userModel(userData);
    const user = await newUser.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log(error);
  }
};

// Api for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }
    const isMatch = await bycrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid  credentials" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log(error);
  }
};

// Api to get user profile data

const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log(error);
  }
};

// Api to update user profile
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;
    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: " Data Missing" });
    }
    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });
    if (imageFile) {
      // upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageUrl = imageUpload.secure_url;
      await userModel.findByIdAndUpdate(userId, { image: imageUrl });
    }
    res.json({ success: true, message: "profile updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log(error);
  }
};

// Api to book appointmrnt
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;
    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData.avilable) {
      return res.json({ success: false, message: "Doctor not available" });
    }
    let slots = docData.slots;

    // checking for slot availability
    if (slots[slotDate]) {
      if (slots[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot not available" });
      } else {
        slots[slotDate].push(slotTime);
      }
    } else {
      slots[slotDate] = [];
      slots[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");

    delete docData.slots;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotDate,
      slotTime,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // save new slot data in docData

    await doctorModel.findByIdAndUpdate(docId, { slots });
    res.json({ success: true, message: "Appointment Booked" });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log(error);
  }
};

// Api to get user appointment for frontend
const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointment = await appointmentModel.find({ userId });
    res.json({ success: true, appointment });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log(error);
  }
};

// Api to cancell user appointment

const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    // verify appointment user
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "unauthorized action" });
    }
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });
    // relasing Doc slote

    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);

    let slots = doctorData.slots;
    slots[slotDate] = slots[slotDate].filter((e) => e !== slotTime);
    await doctorModel.findByIdAndUpdate(docId, { slots });
    res.json({ success: true, message: "Appointment Cancelled " });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log(error);
  }
};

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

//  Api for user online payment
const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData || appointmentData.cancelled) {
      return res.json({
        success: false,
        message: "Appointment cancelled or not found",
      });
    }
    // creating option for razorpay payment
    const option = {
      amount: appointmentData.amount * 100,
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    };

    // craetion of an order
    const order = await razorpayInstance.orders.create(option);

    res.json({ success: true, order });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log(error);
  }
};
//  Api to verify payment on razorpay

const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {
        payment: true,
      });
      res.json({ success: true, message: "Payemnt succesfull" });
    } else {
      res.json({ success: false, message: "Payemnt failed" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log(error);
  }
};
export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay,
};
