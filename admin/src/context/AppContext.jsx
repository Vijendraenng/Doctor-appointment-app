import { createContext } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
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
  const currency = "$";
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    return age;
  };

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const sloteDateFormat = (sloteDate) => {
    const dateArry = sloteDate.split("_");
    return (
      dateArry[0] + " " + months[Number(dateArry[1]) - 1] + " " + dateArry[2]
    );
  };
  const value = { calculateAge, sloteDateFormat, currency, backendUrl };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
