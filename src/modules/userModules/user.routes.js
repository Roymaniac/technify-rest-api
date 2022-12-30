const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUser,
  deleteUser,
  editUser,
  uploadPicture,
} = require("./user.controllers");

const { protected } = require("../../middlewares/authMiddleware"); // 

router.route("/register").post(registerUser); // Register Route
router.route("/login").post(loginUser); // Login Route
router.route("/me").get(protected, getUser); // User Profile Route
router.route("/me/upload").post(protected, uploadPicture); // Upload a Profile Pic Route
router.route("/me/edit").put(protected, editUser); // Edit a profile route
router.route("/me/delete").delete(protected, deleteUser); // Delete a user account

module.exports = router;
