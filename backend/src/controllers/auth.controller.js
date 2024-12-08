import { asyncHandler } from "../utils/asyncHandler.js";

const signup = asyncHandler(async (req, res) => {
  res.send("signup route");
});

const login = asyncHandler(async (req, res) => {
  res.send("login route");
});

const logout = asyncHandler(async (req, res) => {
  res.send("logout route");
});

export { signup, login, logout };
