import { Router } from "express";
import {
  signup,
  login,
  logout,
  getAllUsers,
  updateProfile,
  getProfile,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(logout);
router
  .route("/update-profile")
  .put(verifyJWT, upload.single("profilePic"), updateProfile);

router.route("/get-profile").get(verifyJWT, getProfile);

router.route("/get-all").get(verifyJWT, getAllUsers);

export default router;
