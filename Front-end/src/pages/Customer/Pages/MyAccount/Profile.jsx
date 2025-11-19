import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateMyProfile, uploadAvatar } from "../../../../redux/adminSlice";
import {
  FaUser,
  FaPhone,
  FaCalendarAlt,
  FaTransgender,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";

/* -------------------- VALIDATION -------------------- */
const isValidVietnamPhone = (phone) => {
  const vnPhoneRegex = /^(0(3|5|7|8|9)\d{8}|(\+84)(3|5|7|8|9)\d{8})$/;
  return vnPhoneRegex.test(phone);
};

const validateField = (name, value) => {
  if (!value?.trim()) return "Không được để trống";

  if (["first_name", "last_name"].includes(name)) {
    if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(value)) {
      return "Chỉ được chứa chữ cái";
    }
  }

  if (name === "phone" && !isValidVietnamPhone(value)) {
    return "Số điện thoại không hợp lệ (VN)";
  }

  if (name === "date_of_birth") {
    const date = new Date(value);
    if (date > new Date()) return "Ngày sinh không hợp lệ";
  }

  return null;
};

/* -------------------- PROFILE FIELD -------------------- */
const ProfileField = ({ icon, label, value, isEditing, onChange, name }) => {
  const [errorMsg, setErrorMsg] = useState("");

  const handleInputChange = (field, val) => {
    const err = validateField(field, val);
    setErrorMsg(err);
    onChange(field, val);
  };

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
              className="w-full px-4 py-2 border rounded-lg"
              value={value ? value.split("T")[0] : ""}
              onChange={(e) => handleInputChange(name, e.target.value)}
            />
          ) : name === "gender" ? (
            <select
              className="w-full px-4 py-2 border rounded-lg"
              value={value}
              onChange={(e) => handleInputChange(name, e.target.value)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          ) : (
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg"
              value={value || ""}
              onChange={(e) => handleInputChange(name, e.target.value)}
            />
          )}

          {errorMsg && <p className="text-red-500 text-xs mt-1">{errorMsg}</p>}
        </>
      ) : (
        <p className="text-base font-medium bg-gray-50 p-2 rounded-lg">
          {value || "Not updated yet"}
        </p>
      )}
    </div>
  );
};

/* -------------------- MAIN PROFILE -------------------- */
const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.admin.myProfile);

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

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

  const handleSave = async () => {
    // Validate toàn bộ fields
    for (const [field, val] of Object.entries(profileData)) {
      const err = validateField(field, val);
      if (err) {
        alert(`Lỗi ${field}: ${err}`);
        return;
      }
    }

    if (selectedImage) {
      const formData = new FormData();
      formData.append("image", selectedImage);
      await dispatch(uploadAvatar(formData));
    }

    await dispatch(updateMyProfile(profileData));

    setIsEditing(false);
    setSelectedImage(null);
  };

  if (!user || !profileData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="profile-page p-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Thông tin cá nhân</h2>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={
              selectedImage
                ? URL.createObjectURL(selectedImage)
                : profileData.profile_picture ||
                  "https://th.bing.com/th/id/OIP.ByNwhzY5vUBvdIEfMCqDogHaHa"
            }
            className="w-32 h-32 rounded-full object-cover border"
          />

          {isEditing && (
            <label className="mt-3 cursor-pointer text-blue-600">
              Chọn ảnh
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files[0])}
              />
            </label>
          )}
        </div>

        {/* Fields */}
        <ProfileField
          icon={<FaUser />}
          label="First Name"
          value={profileData.first_name}
          isEditing={isEditing}
          onChange={handleChange}
          name="first_name"
        />

        <ProfileField
          icon={<FaUser />}
          label="Last Name"
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

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2"
              >
                <FaSave /> Save
              </button>

              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg flex items-center gap-2"
              >
                <FaTimes /> Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg flex items-center gap-2"
            >
              <FaEdit /> Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
