import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TopDoctors = () => {
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className=" text-3xl font-medium">Top Doctors to Book</h1>
      <p className=" sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors.
      </p>
      <div className=" w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4  pt-5 gap-y-6 px-3 sm:px-0">
        {doctors.map((data, index) => (
          <div
            onClick={() => navigate(`/appointment/${data._id}`)}
            key={index}
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
          >
            <img className=" bg-[#C9D8FF] " src={data.image} alt="" />
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm text-center text-green-400">
                <p className="w-2 h-2 bg-green-400 rounded-full"></p>
                <p>Avilable</p>
              </div>
              <p className="text-gray-900 text-lg font-medium">{data.name}</p>
              <p className="text-gray-600 text-sm ">{data.speciality}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          navigate("/doctors");
          scrollTo(0, 0);
        }}
        className=" bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10 hover:"
      >
        more
      </button>
    </div>
  );
};

export default TopDoctors;
