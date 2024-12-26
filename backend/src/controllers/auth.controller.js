import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import User from "../models/user.model.js";
import { generateJwtToken } from "../utils/jwtToken.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import aj from "../utils/arcjetconfig.js";
import redisClient from "../utils/redis.config.js";

const signup = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  const decision = await aj.protect(req, { email });
  // console.log("Arcjet decision", decision);

  if (decision.isDenied()) {
    if (decision.reason.isEmail()) {
      // If the email is invalid then return an error message
      // res.writeHead(400, { "Content-Type": "application/json" });
      // res.end(
      //   JSON.stringify({ error: "Invalid email", reason: decision.reason })
      // );
      return res.json(new apiResponse(400, decision.reason, "invalid email"));
    } else {
      // We get here if the client is a bot or the rate limit has been exceeded
      // res.writeHead(403, { "Content-Type": "application/json" });
      // res.end(JSON.stringify({ error: "Too many request please wait try again after 5 minutes", reason: decision.reason }));
      // return res.json(
      //   new apiResponse(
      //     400,
      //     decision.reason,
      //     "Too many requests please wait try again after 5 minutes"
      //   )
      // );
    }
  }

  if (!fullName || !email || !password) {
    return res.json(new apiResponse(400, {}, "All fields are required"));
  }

  if (password.length < 6) {
    return res.json(
      new apiResponse(400, {}, "password must be at least 6 characters")
    );
  }

  const user = await User.findOne({ email });
  if (user) {
    return res.json(new apiResponse(400, {}, "Email is already exists"));
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

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.json(new apiResponse(400, {}, "Invalid credentials"));
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return res.json(new apiResponse(400, {}, "Invalid credentials"));
  }

  const loggedInUser = await User.findById(user._id).select("-password");

  const token = generateJwtToken(user._id, res);
  res
    .status(201)
    .json(new apiResponse(201, { loggedInUser, token }, "Login Successfully"));
});

const logout = asyncHandler(async (req, res) => {
  const token = req.cookies.jwtToken;
  redisClient.set(token, "logout", "EX", 60 * 60 * 24);
  res
    .status(200)
    .clearCookie("jwtToken")
    .json(new apiResponse(200, {}, "Logout Successfully"));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const loggedInUser = req.user._id;
  const users = await User.find({ _id: { $ne: loggedInUser } });
  res
    .status(200)
    .json(new apiResponse(200, users, "All users fetched successfully"));
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

const getProfile = asyncHandler((req, res) => {
  const user = req.user;
  res.status(200).json(new apiResponse(200, user, "Authenticated"));
});

export { signup, login, logout, updateProfile, getProfile, getAllUsers };
