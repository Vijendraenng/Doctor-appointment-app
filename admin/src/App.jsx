import React, { useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import { AdminContext } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import AllApointments from "./pages/Admin/AllApointments";
import DoctorsList from "./pages/Admin/DoctorsList";
import AddDoctors from "./pages/Admin/AddDoctors";
import { DoctorContext } from "./context/DoctorContext";
import Login from "./pages/Login";
import DoctorDashboard from "./pages/Doctor/doctorDashboard";
import DoctorAppointment from "./pages/Doctor/doctorAppointment";
import DoctorProfile from "./pages/Doctor/doctorProfile";

const App = () => {
  const { aToken } = useContext(AdminContext);

  const { dToken } = useContext(DoctorContext);
  return aToken || dToken ? (
    <div className="bg-[#F8F8FD]">
      <ToastContainer />
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          {/* Admin routes */}
          <Route path="/" element={<></>} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/all-apointments" element={<AllApointments />} />
          <Route path="/add-doctors" element={<AddDoctors />} />
          <Route path="/all-doctors" element={<DoctorsList />} />
          {/* Doctor's routes */}
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor-appointment" element={<DoctorAppointment />} />
          <Route path="/doctor-profile" element={<DoctorProfile />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
};

export default App;
