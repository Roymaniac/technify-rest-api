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
    return res.status(400).json({ error: "Please fill all fields" });
  }
// Check if user exists
  const user = await User.findOne({ email });

  if (user) {
    return res.status(400).json({ error: "User Already Exist" });
  }
// Hash password with bcrypt
  const salt = await bcrypt.genSalt(SALT);
  const hashedPassword = await bcrypt.hash(password, salt);
// Create User
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });
// Check user data and return a response
  if (newUser) {
    const token = generateToken(newUser._id);
    const { _id, name, email, avatar } = newUser;
    return res.status(201).json({ _id, name, email, avatar, token });
  } else {
    return res.status(400).json({ error: "Invalid user data" });
  }
});

// @desc Authenticate User
// @route POST /api/users/login
// @access Public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  const isPasswordValid = user ? await bcrypt.compare(password, user.password) : false;

  if (isPasswordValid) {
    const { _id, name, email, avatar } = user;

    res.status(200).json({
      _id,
      name,
      email,
      avatar: avatar?.url || null,
      token: generateToken(_id),
    });

    logger.info("⚡️[server]: User logged in");
  } else {
    res.status(400).send("Invalid user credentials.");
    logger.error("⚡️[server]: Invalid user credentials");
  }
});

// @desc edit users
// @route PUT /api/users/me/edit
// @access Private

const editUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
  // Check if the loggin user matches the user
    if (!user) {
      res.status(401).send("User not authorized.");
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { ...req.body },
      { new: true }
    );

    res.status(200).json(updatedUser);
    logger.info("⚡️[server]: User profile was updated");
  } catch (error) {
    logger.error("⚡️[server]: something went wrong!", error);
    res.status(500).send("Something went wrong!");
  }
});

// @desc Get User data
// @route GET /api/users/me
// @access Private
const getUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      res.status(404).send("User not found.");
  
    }
    
    res.status(200).json(user);
    logger.info("⚡️[server]: User profile retrieved");
  } catch (error) {
    logger.error("⚡️[server]: something went wrong!", error);
    res.status(500).send("Something went wrong!");
  }
});


// @desc upload user picture
// @route POST /api/users/me/upload
// @access Private
const uploadPicture = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user);
  if (!user) {
    res.status(401);
    logger.error("⚡️[server]: User not authorized");

  }

  try {
    const avatar = req.files.avatar;

    if (!avatar) {
      res.status(400).send("No files were uploaded.");

    }

    const uploadedResponse = await uploadToCloudinary(
      avatar.tempFilePath,
      "Profiles"
    );
    const cloud_url = uploadedResponse.url;
    const cloud_publicId = uploadedResponse.public_id;
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      {
        avatar: {
          url: cloud_url,
          publicId: cloud_publicId,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
    logger.info("⚡️[server]: Profile photo upload success");
  } catch (error) {
    logger.error("⚡️[server]: something went wrong!", error);
    res.status(500).send("Something went wrong!");
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
    return;
  }

  try {
    await user.remove();
    res.status(200).json({ _id: req.user._id });
    logger.info("⚡️[server]: User account was deleted");
  } catch (error) {
    logger.error("⚡️[server]: something went wrong!", error);
    res.status(500).send("Something went wrong!");
  }
});

module.exports = {
  registerUser,
  loginUser,
  editUser,
  getUser,
  deleteUser,
  uploadPicture,
};
