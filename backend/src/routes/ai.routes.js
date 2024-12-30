import { Router } from "express";
import { getResult } from "../controllers/ai.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/get-result").get(getResult);

export default router;
