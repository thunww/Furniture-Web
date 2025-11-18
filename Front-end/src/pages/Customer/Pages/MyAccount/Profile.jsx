import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUser,
  fetchUserById,
  uploadAvatar,
} from "../../../../redux/adminSlice";

import {
  FaUser,
  FaPhone,
  FaCalendarAlt,
  FaTransgender,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";

/* -------------------- VALIDATE PHONE VN (+84 / 0) -------------------- */
const isValidVietnamPhone = (phone) => {
  const vnPhoneRegex = /^(0(3|5|7|8|9)\d{8}|(\+84)(3|5|7|8|9)\d{8})$/;
  return vnPhoneRegex.test(phone);
};

/* -------------------- VALIDATE FIELD CHUNG -------------------- */
const validateField = (name, value) => {
  if (!value.trim()) return "Không được để trống";

  if (["first_name", "last_name"].includes(name)) {
    if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(value)) {
      return "Chỉ được chứa chữ cái";
    }
  }

  if (name === "phone") {
    if (!isValidVietnamPhone(value)) {
      return "Số điện thoại phải đúng định dạng VN (0xxxx hoặc +84xxxx)";
    }
  }

  if (name === "date_of_birth") {
    const date = new Date(value);
    if (date > new Date()) return "Ngày sinh không thể lớn hơn hiện tại";
  }

  return null;
};

/* -------------------- PROFILE FIELD COMPONENT -------------------- */
const ProfileField = ({ icon, label, value, isEditing, onChange, name }) => {
  const [errorMsg, setErrorMsg] = useState("");

  const handleInputChange = (field, val) => {
    const err = validateField(field, val);
    setErrorMsg(err);
    onChange(field, val);
  };

  let formattedValue = value;
  if (name === "date_of_birth" && value) {
    try {
      formattedValue = format(parseISO(value), "dd/MM/yyyy");
    } catch {}
  }

  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 text-gray-600 mb-1.5">
        <div className="text-blue-500">{icon}</div>
        <span className="text-xs font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>

      {isEditing ? (
        <>
          {name === "date_of_birth" ? (
            <input
              type="date"
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={value ? value.split("T")[0] : ""}
              onChange={(e) => handleInputChange(name, e.target.value)}
            />
          ) : name === "gender" ? (
            <select
              className="w-full px-4 py-2.5 border rounded-lg"
              value={value}
              onChange={(e) => handleInputChange(name, e.target.value)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          ) : (
            <input
              type="text"
              className="w-full px-4 py-2.5 border rounded-lg"
              value={value || ""}
              onChange={(e) => handleInputChange(name, e.target.value)}
            />
          )}

          {errorMsg && <p className="text-red-500 text-xs mt-1">{errorMsg}</p>}
        </>
      ) : (
        <p className="text-base font-medium text-gray-800 py-2 px-3 bg-gray-50 rounded-lg truncate">
          {formattedValue || "Not updated yet"}
        </p>
      )}
    </div>
  );
};

/* -------------------- MAIN PROFILE COMPONENT -------------------- */
const Profile = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?.user_id);
  const user = useSelector((state) => state.admin.selectedUser);
  const isAuthLoading = useSelector((state) => state.auth.isLoading);

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (userId) dispatch(fetchUserById(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone: user.phone || "",
        date_of_birth: user.date_of_birth || "",
        gender: user.gender || "male",
        profile_picture: user.profile_picture || "",
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* -------------------- SAVE -------------------- */
  const handleSave = async () => {
    if (!profileData) return;

    // Validate toàn bộ trường trước khi save
    for (const [field, val] of Object.entries(profileData)) {
      const err = validateField(field, val);
      if (err) {
        alert(`Lỗi ở ${field}: ${err}`);
        return;
      }
    }

    let uploadedImageUrl = profileData.profile_picture;

    if (selectedImage) {
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("image", selectedImage);

      const result = await dispatch(uploadAvatar(formData));
      if (uploadAvatar.fulfilled.match(result)) {
        uploadedImageUrl = result.payload;
      } else return;
    }

    const updatedData = {
      ...profileData,
      profile_picture: selectedImage ? uploadedImageUrl : undefined,
    };

    dispatch(updateUser({ user_id: userId, ...updatedData }));
    setIsEditing(false);
    setSelectedImage(null);
  };

  if (isAuthLoading || !profileData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="profile-page bg-gray-50 p-6 rounded-xl">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border">
        <div className="flex flex-col md:flex-row">
          {/* Avatar + Buttons */}
          <div className="w-full md:w-1/3 p-6 flex flex-col items-center bg-gradient-to-b from-blue-50">
            <div className="relative mb-6">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 shadow-lg">
                <img
                  src={
                    selectedImage
                      ? URL.createObjectURL(selectedImage)
                      : profileData.profile_picture ||
                        "https://th.bing.com/th/id/OIP.ByNwhzY5vUBvdIEfMCqDogHaHa"
                  }
                  className="w-full h-full object-cover"
                />
              </div>

              {isEditing && (
                <>
                  <label
                    htmlFor="upload"
                    className="absolute bottom-0 right-0 p-3 bg-blue-500 rounded-full text-white cursor-pointer"
                  >
                    <FaEdit />
                  </label>
                  <input
                    id="upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files[0])
                        setSelectedImage(e.target.files[0]);
                    }}
                  />
                </>
              )}
            </div>

            {isEditing ? (
              <div className="w-full flex gap-3">
                <button
                  onClick={handleSave}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  <FaSave /> Save
                </button>

                <button
                  onClick={() => setIsEditing(false)}
                  className="w-full bg-gray-100 text-gray-600 px-4 py-2 rounded-lg border"
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-blue-50 text-blue-600 border border-blue-200 px-4 py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <FaEdit /> Edit
              </button>
            )}
          </div>

          {/* Info fields */}
          <div className="w-full md:w-2/3 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileField
              icon={<FaUser />}
              label="First name"
              value={profileData.first_name}
              isEditing={isEditing}
              onChange={handleChange}
              name="first_name"
            />

            <ProfileField
              icon={<FaUser />}
              label="Last name"
              value={profileData.last_name}
              isEditing={isEditing}
              onChange={handleChange}
              name="last_name"
            />

            <ProfileField
              icon={<FaPhone />}
              label="Phone"
              value={profileData.phone}
              isEditing={isEditing}
              onChange={handleChange}
              name="phone"
            />

            <ProfileField
              icon={<FaCalendarAlt />}
              label="Date of Birth"
              value={profileData.date_of_birth}
              isEditing={isEditing}
              onChange={handleChange}
              name="date_of_birth"
            />

            <ProfileField
              icon={<FaTransgender />}
              label="Gender"
              value={profileData.gender}
              isEditing={isEditing}
              onChange={handleChange}
              name="gender"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
