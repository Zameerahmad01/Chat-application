import { Router } from "express";
import {
  createProject,
  getAllProjects,
  addUserToProject,
  getProject,
} from "../controllers/project.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create").post(verifyJWT, createProject);
router.route("/get-all").get(verifyJWT, getAllProjects);
router.route("/add-user").put(verifyJWT, addUserToProject);
router.route("/get-project/:projectId").get(verifyJWT, getProject);

export default router;
