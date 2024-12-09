import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import User from "../models/user.model.js";
import { generateJwtToken } from "../utils/jwtToken.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { log } from "console";

const signup = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.json(new apiResponse(400, {}, "All fields are required"));
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json(new apiResponse(400, {}, "password must be at least 6 characters"));
  }

  const user = await User.findOne({ email });
  if (user) {
    return res
      .status(400)
      .json(new apiResponse(400, {}, "Email is already exists"));
  }

  const newUser = await User.create({
    fullName,
    email,
    password,
  });

  const createdUser = await User.findById(newUser._id).select("-password");

  if (newUser) {
    generateJwtToken(newUser._id, res);
    res
      .status(201)
      .json(new apiResponse(201, createdUser, "signup successfully"));
  } else {
    res.status(500).json(new apiResponse(500, {}, "internal server error"));
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(400)
      .json(new apiResponse(400, {}, "Invalid credentials"));
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    return res
      .status(400)
      .json(new apiResponse(400, {}, "Invalid credentials"));
  }

  const loggedInUser = await User.findById(user._id).select("-password");

  generateJwtToken(user._id, res);
  res
    .status(201)
    .json(new apiResponse(201, loggedInUser, "Login Successfully"));
});

const logout = asyncHandler(async (req, res) => {
  res
    .status(200)
    .clearCookie("jwtToken", {
      maxAge: 0,
      httpOnly: true,
    })
    .json(new apiResponse(200, {}, "Logout Successfully"));
});

const updateProfile = asyncHandler(async (req, res) => {
  const profilePicPath = req.file.path;

  const userId = req.user._id;

  if (!profilePicPath) {
    return res
      .status(400)
      .json(new apiResponse(400, {}, "ProfilePic is required"));
  }

  const uploadResponse = await uploadOnCloudinary(profilePicPath);

  if (!uploadResponse) {
    return res
      .status(400)
      .json(new apiResponse(400, {}, "internal server error"));
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      profilePic: uploadResponse.secure_url,
    },
    { new: true }
  );

  res
    .status(200)
    .json(new apiResponse(200, updatedUser, "profilePic Updated Successfully"));
});

const checkAuth = asyncHandler((req, res) => {
  const user = req.user;
  res.status(200).json(new apiResponse(200, user, "Authenticated"));
});

export { signup, login, logout, updateProfile, checkAuth };
