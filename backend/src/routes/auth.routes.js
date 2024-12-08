import { Router } from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";
// import { verifyJWT } from "../middlewares/auth.middleware.js";
// import { apiResponse } from "../utils/apiResponse.js";

const router = Router();

router.route("/signup").get(signup);
router.route("/login").get(login);
router.route("/logout").get(logout);

export default router;
