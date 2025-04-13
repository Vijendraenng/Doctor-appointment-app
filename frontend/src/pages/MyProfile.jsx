import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } =
    useContext(AppContext);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  const updateUserProfileData = async () => {
    if (isSubmitting) return; // ✅ Prevent duplicate submission
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);
      image && formData.append("image", image);
      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(error.message);
    } finally {
      setIsSubmitting(false); // ✅ Re-enable button after request
    }
  };

  return (
    userData && (
      <div className=" max-w-lg flex flex-col gap-2 text-sm ">
        {isEdit ? (
          <label htmlFor="image">
            <div className="  cursor-pointer relative inline-block">
              <img
                className="w-36 opacity-75 rounded"
                src={image ? URL.createObjectURL(image) : userData.image}
                alt=""
              />
              <img
                className="w-10 absolute bottom-12 right-12"
                src={image ? null : assets.upload_icon}
                alt=""
              />
            </div>
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              hidden
            />
          </label>
        ) : (
          <img className="w-36 rounded" src={userData.image} alt="" />
        )}
        {isEdit ? (
          // Name
          <input
            className="bg-gray-50 text-3xl font-medium max-w-60 mt-4"
            value={userData.name}
            onChange={(e) =>
              setUserData((prev) => ({
                ...prev,
                name: e.target.value, // ✅ Updates name correctly
              }))
            }
            type="text"
          />
        ) : (
          <p className="font-medium text-3xl text-neutral-800 mt-4">
            {userData.name}
          </p>
        )}
        <hr className="bg-zinc-400 h-[1px] border-none" />
        <div>
          <p className="text-neutral-600 underline mt-3">CONTACT INFORMATION</p>

          <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
            <p className="font-medium"> Email id :</p>
            {isEdit ? (
              // email
              <input
                className="bg-gray-100 max-w-52"
                value={userData.email}
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    email: e.target.value, // ✅ Updates email correctly
                  }))
                }
                type="email"
              />
            ) : (
              <p className="text-blue-500">{userData.email}</p>
            )}

            <p className="font-medium"> Phone :</p>
            {isEdit ? (
              <input
                className="bg-gray-100 max-w-52"
                value={userData.phone}
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    phone: e.target.value, // ✅ Updates phone correctly
                  }))
                }
                type="number"
              />
            ) : (
              <p className="text-blue-500">{userData.phone}</p>
            )}

            <p className="font-medium">Address:</p>
            {isEdit ? (
              <p>
                <input
                  className="bg-gray-100 max-w-52"
                  value={userData.address.line1}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value }, // ✅ Correctly updates address.line1
                    }))
                  }
                  type="text"
                />
                <br />
                <input
                  className="bg-gray-100 max-w-60"
                  value={userData.address.line2}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value }, // ✅ Correctly updates address.line2
                    }))
                  }
                  type="text"
                />
              </p>
            ) : (
              <p className="text-gray-500">
                {userData.address.line1} <br /> {userData.address.line2}
              </p>
            )}
          </div>
        </div>
        <div>
          <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>
          <div className="grid grid-cols-[1fr_1fr] gap-y-2.5 mt-3 text-neutral-700">
            <p className="font-medium">Gender:</p>
            {isEdit ? (
              <select
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, gender: e.target.value }))
                }
                name="cars"
                value={userData.gender}
                className="max-w-20 bg-gray-100"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <p className="text-gray-400">{userData.gender}</p>
            )}

            <p className="font-medium">Birthday:</p>

            {isEdit ? (
              <input
                className="max-w-28 bg-gray-100"
                value={userData.dob}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, dob: e.target.value }))
                }
                type="date"
              />
            ) : (
              <p>{userData.dob}</p>
            )}
          </div>
        </div>
        <div className="mt-10">
          {isEdit ? (
            <button
              className="border border-[#5F6FFF] px-8 py-2 rounded-full hover:bg-[#5F6FFF] hover:text-white transition-all"
              onClick={updateUserProfileData}
              disabled={isSubmitting} // ✅ disable while submitting
            >
              {isSubmitting ? "Saving..." : "Save information"}
            </button>
          ) : (
            <button
              className="border border-[#5F6FFF] px-8 py-2 rounded-full hover:bg-[#5F6FFF] hover:text-white transition-all"
              onClick={() => setIsEdit(true)}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    )
  );
};

export default MyProfile;
