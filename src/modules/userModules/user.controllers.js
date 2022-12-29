const asyncHandler = require("express-async-handler");
const User = require("./user.models");
const bcrypt = require("bcryptjs");
const SALT = Number(process.env.SALT);
const { uploadToCloudinary } = require("../../helpers/cloudinary");
const { generateToken } = require("../../helpers/tokenGen");
const { logger } = require("../../helpers/logger");

// @desc Register User
// @route POST /api/users/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("⚡️[server]: Please fill all fields");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("⚡️[server]: User Already Exist");
  }

  // Hash password with bcrypt
  const salt = await bcrypt.genSalt(SALT);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create User
  const user = await User.create({ name, email, password: hashedPassword });

  // Check user data and return a response
  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar.url,
      token: generateToken(user._id),
    });
    logger.info(`⚡️[server]: ${user.name} account was created successful`);
  } else {
    res.status(400);
    throw new Error("⚡️[server]: Invalid user data");
  }
});

// @desc Authenticate User
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar.url,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    logger.error("⚡️[server]: Invalid user credentials");
  }
});

// @desc edit users
// @route PUT /api/users/me/edit
// @access Private

const editUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user);

  // Check if the loggin user matches the user
  if (!user) {
    res.status(401);
    logger.error("⚡️[server]: User not authorized");
  }

  const updatedUser = await User.findByIdAndUpdate(user.id, req.body, {
    new: true,
  });
  logger.error(updatedUser);
  res.status(200).json({ data: updatedUser });
});

// @desc Get User data
// @route GET /api/users/me
// @access Private
const getUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
  logger.info("⚡️[server]: User profile retrieved");
});

// @desc upload user picture
// @route GET /api/users/me/upload
// @access Private
const uploadPicture = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user);
  if (!user) {
    res.status(401);
    logger.error("⚡️[server]: User not authorized");
  }

  const { avatar } = req.files.file;

  try {
    let url, publicId;
    if (avatar) {
      const uploadedResponse = await uploadToCloudinary(avatar, "Profiles");
      url = uploadedResponse.url;
      publicId = uploadedResponse.public_id;
      const ho = await User.findByIdAndUpdate(user.id, req.files.file, {
        new: true,
      });

      res.status(200).json(ho, req.user);
      logger.info("⚡️[server]: Profile photo upload success");
    }
  } catch (error) {
    logger.error("⚡️[server]: something went wrong!");
  }
});

// @desc Delete users
// @route DELETE /api/users/me/delete
// @access Private

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  // Check user
  if (!user) {
    res.status(401);
    logger.error("⚡️[server]: User not authorized");
  }

  await user.remove();
  res.status(200).json({ _id: req.user._id });
  logger.info("⚡️[server]: User account was deleted");
});

module.exports = {
  registerUser,
  loginUser,
  editUser,
  getUser,
  deleteUser,
  uploadPicture,
};
