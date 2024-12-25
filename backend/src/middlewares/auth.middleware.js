import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import redisClient from "../utils/redis.config.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.jwtToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json(new apiResponse(401, {}, "Unauthorized access"));
    }

    const isBlacklisted = await redisClient.get(token);

    if (isBlacklisted) {
      return res
        .status(401)
        .clearCookie("jwtToken")
        .json(new apiResponse(401, {}, "Unauthorized access"));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res
        .status(401)
        .json(new apiResponse(401, {}, "Unauthorized - Invalid token"));
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res
        .status(401)
        .json(new apiResponse(401, {}, "Unauthorized access user not found"));
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("error in verify jwt token", error.message);
    res.status(500).json(new apiResponse(500, {}, "Internal server error"));
  }
});
