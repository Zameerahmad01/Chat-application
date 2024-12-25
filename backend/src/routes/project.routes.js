import { Router } from "express";
import {
  createProject,
  getAllProjects,
} from "../controllers/project.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create").post(verifyJWT, createProject);
router.route("/get").get(verifyJWT, getAllProjects);

export default router;
