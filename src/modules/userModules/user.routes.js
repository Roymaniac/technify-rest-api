const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUser,
  deleteUser,
  editUser,
  uploadPicture
} = require("./user.controllers");

const { protected } = require("../../middlewares/authMiddleware");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/me").get(protected, getUser);
router.route("/me/upload").post(protected, uploadPicture);
router.route("/me/edit").put(protected, editUser);
router.route("/me/delete").delete(protected, deleteUser);

module.exports = router;
