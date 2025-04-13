import React from "react";
import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const AllApointments = () => {
  const { appointments, getAllAppointment, aToken, cancelAppointment } =
    useContext(AdminContext);
  const { calculateAge, sloteDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointment();
    }
  }, [aToken]);
  return (
    <div className=" w-full max-w-6xl m-5 ">
      {" "}
      <p className=" mb-3 text-lg font-medium">All Appointments</p>
      <div className=" bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-scroll ">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b">
          {" "}
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date and Time</p>
          <p>Doctor name</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        {appointments.map((data, index) => (
          <div
            className="flex flex-wrap justify-between max-sm:gap-2  sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500  py-3 px-6 border-b hover:bg-gray-50"
            key={index}
          >
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2">
              <img
                className="w-8 rounded-full "
                src={data.userData.image}
                alt=""
              />
              <p>{data.userData.name}</p>
            </div>
            <p className="max-sm:hidden">{calculateAge(data.userData.dob)}</p>
            <p>
              {sloteDateFormat(data.slotDate)}, {data.slotTime}
            </p>
            <div className="flex items-center gap-2">
              <img
                className="w-8 rounded-full bg-gray-200 "
                src={data.docData.image}
                alt=""
              />
              <p>{data.docData.name}</p>
            </div>

            <p>
              {currency}
              {data.docData.fees}
            </p>
            {data.cancelled ? (
              <p className=" text-red-400 text-xs font-medium">Cancelled</p>
            ) : data.isCompleted ? (
              <p className=" text-green-400 text-xs font-medium">Completed</p>
            ) : (
              <img
                onClick={() => {
                  cancelAppointment(data._id);
                }}
                className="w-10 cursor-pointer"
                src={assets.cancel_icon}
                alt=""
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllApointments;
