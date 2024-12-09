import { Router } from "express";
import {
  getAllUsers,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/users").get(verifyJWT, getAllUsers);
router.route("/:id").get(verifyJWT, getMessages);
router.route("/send/:id").post(verifyJWT, upload.single("image"), sendMessage);

export default router;
