import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.jwtToken;

    if (!token) {
      return res
        .status(401)
        .json(new apiResponse(401, {}, "Unauthorized access"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res
        .status(401)
        .json(new apiResponse(401, {}, "Unauthorized - Invalid-token"));
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
