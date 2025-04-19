import { React, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import RelatedDoctors from "../Components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } =
    useContext(AppContext);
  const daysOfWeak = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const navigate = useNavigate();

  const fetchDocInfo = async () => {
    const docInfos = await doctors.find((doc) => doc._id === docId);

    setDocInfo(docInfos);
  };

  const getAvilableSlots = async () => {
    setDocSlots([]);
    // getting current date
    let today = new Date();
    for (let i = 0; i < 7; i++) {
      // getting date with index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      // setting end time of the date with index
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);
      // setting  hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeslots = [];
      while (currentDate < endTime) {
        let formatterdTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
        const sloteDate = day + "_" + month + "_" + year;
        const sloteTime = formatterdTime;
        const isSloteAvailable =
          docInfo?.slots?.[sloteDate] &&
          docInfo.slots[sloteDate].includes(sloteTime)
            ? false
            : true;

        if (isSloteAvailable) {
          // add slots to array
          timeslots.push({
            datetime: new Date(currentDate),
            time: formatterdTime,
          });
        }

        // increament time by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      setDocSlots((prev) => [...prev, timeslots]);
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }
    try {
      const date = docSlots[slotIndex][0].datetime;

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      const slotDate = day + "_" + month + "_" + year;

      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        { docId, slotDate, slotTime },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(error.message);
    }
  };
  useEffect(() => {
    fetchDocInfo();
  }, [docId, doctors]);
  useEffect(() => {
    getAvilableSlots();
  }, [docInfo]);

  return (
    docInfo && (
      <div>
        {/*  doctor detailes */}
        <div className="flex flex-col sm:flex-row ">
          <div>
            <img
              className="bg-[#5F6FFF]  w-full sm:max-w-72 rounded-lg"
              src={docInfo.image}
              alt=""
            />
          </div>
          <div className="flex-1 border-gray-400 border  rounded-lg   p-8 py-7 bg-white mx-2 sm:mx-5 mt-[-80px] sm:mt-0">
            {/*----------- doc name ,degree,experience,specialiy------------ */}
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}{" "}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </p>
            <div className=" flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree}-{docInfo.speciality}
              </p>
              <button className="rounded-full  border px-2 py-0.5 text-xs">
                {docInfo.experience}
              </button>
            </div>
            {/* ----------Doctor about----------- */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3 ">
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className="tetx-sm text-gray-500 max-w-[700px] mt-1">
                {" "}
                {docInfo.about}
              </p>
            </div>
            <div>
              <p className=" mt-4 font-medium text-gray-500">
                Appointment fee:
                <span className="text-gray-900 font-medium">
                  {currencySymbol}
                  {docInfo.fees}
                </span>
              </p>
            </div>
          </div>
        </div>
        {/* ---------Doctors slotes----------- */}
        <div className="sm:ml-72  sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking slots</p>
          <div className="flex items-center gap-3 mt-4 w-full overflow-x-scroll ">
            {docSlots.length &&
              docSlots.map((data, index) => (
                <div
                  onClick={() => setSlotIndex(index)}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? "bg-[#5F6FFF] text-white"
                      : "border border-gray-200 "
                  }`}
                  key={index}
                >
                  <p>{data[0] && daysOfWeak[data[0].datetime.getDay()]}</p>
                  <p>{data[0] && [data[0].datetime.getDate()]}</p>
                </div>
              ))}
          </div>
          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {docSlots.length &&
              docSlots[slotIndex].map((data, index) => (
                <p
                  onClick={() => setSlotTime(data.time)}
                  className={` text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer${
                    data.time === slotTime
                      ? " bg-[#5F6FFF] text-white"
                      : " text-gray-400 border border-gray-300"
                  }`}
                  key={index}
                >
                  {data.time.toLowerCase()}
                </p>
              ))}
          </div>
          <button
            onClick={bookAppointment}
            className=" bg-[#5F6FFF] text-white my-6 text-sm font-light px-14 py-3 rounded-full"
          >
            Book an appointment
          </button>
        </div>
        {/* listing related doctors */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};
export default Appointment;
