import React from "react";
import { useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const DoctorAppointment = () => {
  const {
    dToken,
    getAppointment,
    appointment,
    cancelAppointment,
    completeAppointment,
  } = useContext(DoctorContext);
  const { calculateAge, sloteDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    getAppointment();
  }, [dToken]);

  return (
    <div className="w-full mx-w- xl m-5 ">
      <p className="mb-3 text-lg font-medium">All Appointment </p>
      <div className="bg-white border rounded text-sm  max-h-[80vh] min-h-[50vh] overflow-y-scroll">
        <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Payment </p>
          <p> Age</p>
          <p>Date and Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {appointment.map((data, index) => (
          <div
            className="flex flex-wrap justify-baseline max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 items-center text-gray-500 border-b hover:bg-gray-50 "
            key={index}
          >
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2">
              <img
                className="w-8 rounded-full"
                src={data.userData.image}
                alt=""
              />
              <p>{data.userData.name}</p>
            </div>
            <p className=" text-xs inline   border border-[#5F6FFF] px-3 mx-auto rounded-full ">
              {data.payment ? "online" : "Cash"}
            </p>
            <p className="max-sm:hidden">{calculateAge(data.userData.dob)}</p>
            <p>
              {sloteDateFormat(data.slotDate)}|| {data.slotTime}
            </p>
            <p>
              {" "}
              {currency}
              {data.amount}
            </p>
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
  );
};

export default DoctorAppointment;
