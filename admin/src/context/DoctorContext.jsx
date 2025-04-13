import { useState } from "react";
import { createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
  );

  const [appointment, setAppointment] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);

  const getAppointment = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/doctor/doctor-appointment",
        {
          headers: { dToken },
        }
      );
      if (data.success) {
        setAppointment(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };
  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/complete-appointment",
        { appointmentId },
        { headers: { dToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointment();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/cancel-appointment",
        { appointmentId },
        { headers: { dToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointment();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/doctor/doctor-dashboard",
        { headers: { dToken } }
      );
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };
  const getDoctorProfile = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/doctor/doctor-profile",
        { headers: { dToken } }
      );
      if (data.success) {
        setProfileData(data.profileData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };
  const value = {
    dToken,
    setDToken,
    backendUrl,
    getAppointment,
    appointment,
    completeAppointment,
    cancelAppointment,
    getDashData,
    dashData,
    setDashData,
    getDoctorProfile,
    profileData,
    setProfileData,
  };
  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
