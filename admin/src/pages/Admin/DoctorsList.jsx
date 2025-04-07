import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorsList = () => {
  const { doctors, getAllDoctors, aToken, changeAvailability } =
    useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);
  return (
    <div className=" m-5 max-h-[90vh] overflow-scroll">
      <h1 className="text-lg font-medium">All Doctors</h1>
      <div className="flex flex-wrap w-full gap-4 pt-5 gap-y-6">
        {doctors.map((doctor, index) => (
          <div
            className="border border-indigo-200 rounded-xl max-w-56 overflow-hidden  cursor-pointer group"
            key={index}
          >
            <img
              className="bg-indigo-50 group-hover:bg-[#5F6FFF] transition-all duration-500"
              src={doctor.image}
              alt=""
            />
            <div className="p-4">
              <p className="text-neutral-800 text-lg font-medium">
                {doctor.name}
              </p>
              <p className="text-zinc-600 text-sm">{doctor.speciality}</p>
              <div className="flex mt-2 items-center gap-1 text-sm">
                <input
                  onChange={() => changeAvailability(doctor._id)}
                  type="checkbox"
                  checked={doctor.avilable}
                />
                <p>Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
