const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  handleGetAllUsers,
  handleAssignRoleToUser,
  handleRemoveRoleFromUser,
  handleGetUserById,
  handleBanUser,
  handleUnbanUser,
  handleUpdateUser,
  handleUploadAvatar,
  handleGetProfile,
} = require("../controllers/usersController");

const router = express.Router();

router.get(
  "/admin/users",
  authMiddleware,
  roleMiddleware(["admin"]),
  handleGetAllUsers
);

router.get(
  "/admin/users/:userId",
  authMiddleware,
  roleMiddleware(["admin"]),
  handleGetUserById
);

router.put(
  "/admin/users/:userId",
  authMiddleware,
  roleMiddleware(["admin"]),
  handleUpdateUser
);

router.put(
  "/admin/users/ban",
  authMiddleware,
  roleMiddleware(["admin"]),
  handleBanUser
);

router.put(
  "/admin/users/unban",
  authMiddleware,
  roleMiddleware(["admin"]),
  handleUnbanUser
);

router.get("/users/me", authMiddleware, handleGetProfile);

router.put("/users/me", authMiddleware, handleUpdateUser);

router.post(
  "/users/me/upload-avatar",
  authMiddleware,
  upload.single("image"),
  handleUploadAvatar
);

module.exports = router;
