import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const RelatedDoctors = ({ docId, speciality }) => {
  const { doctors } = useContext(AppContext);
  const [relDoc, setRelDoc] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorsdata = doctors.filter(
        (data) => data.speciality === speciality && data._id !== docId
      );
      setRelDoc(doctorsdata);
    }
  }, [doctors, speciality, docId]);

  return (
    <div>
      <div className="flex flex-col items-center gap-5 py-5 mt-20">
        <h1 className=" text-3xl font-medium">Related Doctors</h1>
        <p className=" sm:w-1/3 text-center text-sm">
          Simply browse through our extensive list of trusted doctors.
        </p>
      </div>
      <div className=" w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4  pt-5 gap-y-6 px-3 sm:px-0">
        {relDoc.map((data, index) => (
          <div
            onClick={() => {
              navigate(`/appointment/${data._id}`);
              scroll(0, 0);
            }}
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
    </div>
  );
};

export default RelatedDoctors;
