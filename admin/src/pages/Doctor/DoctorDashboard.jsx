import React from "react";
import { useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { useEffect } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const DoctorDashboard = () => {
  const {
    dToken,
    cancelAppointment,
    completeAppointment,
    setDashData,
    dashData,
    getDashData,
  } = useContext(DoctorContext);
  const { currency, sloteDateFormat } = useContext(AppContext);
  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);

  return (
    dashData && (
      <div className="m-5">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 border-2 rounded border-gray-100 cursor-pointer hover:scale-105 transition-all duration-100">
            <img className="w-14" src={assets.earning_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {currency}
                {dashData.earnings}
              </p>
              <p className=" text-gray-400">Earnings</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 border-2 rounded border-gray-100 cursor-pointer hover:scale-105 transition-all duration-100">
            <img className="w-14" src={assets.appointments_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.appointments}
              </p>
              <p className=" text-gray-400">Appointments</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 border-2 rounded border-gray-100 cursor-pointer hover:scale-105 transition-all duration-100">
            <img className="w-14" src={assets.patients_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.patient}
              </p>
              <p className=" text-gray-400">Patients</p>
            </div>
          </div>
        </div>
        <div className="bg-white">
          <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t  border">
            <img src={assets.list_icon} alt="" />
            <p className="font-semibold">Latest Bookings</p>
          </div>
          <div className="pt-4 border border-t-0 ">
            {" "}
            {dashData.latestAppointments.map((data, index) => (
              <div
                className="flex items-center p-6  gap-3 hover:bg-gray-100 "
                key={index}
              >
                <img
                  className="rounded-full w-10 "
                  src={data.userData.image}
                  alt=""
                />
                <div className=" flex-1 text-sm">
                  <p className="text-gray-800 font-medium">
                    {data.userData.name}
                  </p>
                  <p className="text-gray-800">
                    Booking on {sloteDateFormat(data.slotDate)}
                  </p>
                </div>
                {data.cancelled ? (
                  <div className="flex text-xs font-medium text-red-500">
                    cancelled
                  </div>
                ) : data.isCompleted ? (
                  <div className="flex text-xs font-medium text-green-500">
                    completed
                  </div>
                ) : (
                  <div className="flex">
                    <img
                      onClick={() => cancelAppointment(data._id)}
                      className="w-10 cursor-pointer"
                      src={assets.cancel_icon}
                      alt=""
                    />
                    <img
                      onClick={() => completeAppointment(data._id)}
                      className="w-10 cursor-pointer"
                      src={assets.tick_icon}
                      alt=""
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorDashboard;
