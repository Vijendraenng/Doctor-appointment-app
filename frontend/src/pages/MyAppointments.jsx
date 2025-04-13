import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointment, setAppointment] = useState([]);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const navigator = useNavigate();

  const sloteDateFormat = (sloteDate) => {
    const dateArry = sloteDate.split("_");
    return (
      dateArry[0] + " " + months[Number(dateArry[1]) - 1] + " " + dateArry[2]
    );
  };
  const getUserAppointment = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/user/my-appointments",
        { headers: { token } }
      );

      if (data.success) {
        setAppointment(data.appointment.reverse());
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointment();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backendUrl + "/api/user/verifyRazorpay",
            response,
            { headers: { token } }
          );
          if (data.success) {
            getUserAppointment();
            navigator("/my-appointments");
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/payment-razorpay",
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        initPay(data.order);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (token) {
      getUserAppointment();
    }
  }, [token]);
  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My appointments
      </p>
      <div>
        {appointment.map((data, index) => (
          <div
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex py-2 border-b"
            key={index}
          >
            <div>
              <img
                className="w-32 bg-indigo-50"
                src={data.docData.image}
                alt=""
              />
            </div>
            <div className=" flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">
                {data.docData.name}
              </p>
              <p>{data.speciality}</p>
              <p className="text-zinc-400 font-medium mt-1">Address:</p>
              <p className="text-xs">{data.docData.address.line1}</p>
              <p className="text-xs">{data.docData.address.line2}</p>

              <p className="text-sm mt-">
                <span className="text-sm pr-2 text-neutral-700 font-medium ">
                  Date & Time:
                </span>
                {sloteDateFormat(data.slotDate)} || {data.slotTime}
              </p>
            </div>
            <div> </div>
            {data.cancelled ? (
              <div className="flex flex-col gap-2 justify-end">
                <button className="text-sm text-center sm:min-w-48 py-1 border rounded text-red-500">
                  Apppointment Cancelled
                </button>
              </div>
            ) : data.isCompleted ? (
              <div className="flex flex-col gap-2 justify-end">
                <button className="text-sm text-center sm:min-w-48 py-1 border rounded text-green-500">
                  Apppointment Completed
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 justify-end">
                {data.payment ? (
                  <button
                    className={`text-sm text-green-500 text-center sm:min-w-48 py-1 border rounded  
                        transition-all duration-300`}
                  >
                    fees Paid
                  </button>
                ) : (
                  <button
                    onClick={() => appointmentRazorpay(data._id)}
                    className="text-sm text-stone-500 text-center sm:min-w-48 py-1 border rounded 
                      hover:bg-[#5F6FFF]  hover:text-white
                     transition-all duration-300"
                  >
                    Pay Online
                  </button>
                )}
                <button
                  onClick={(e) => cancelAppointment(data._id)}
                  className="text-sm text-stone-500 text-center sm:min-w-48 py-1 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  Cancel apppointment
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
