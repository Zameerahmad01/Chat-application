import projectModel from "../models/project.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";

const createProject = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const loggedInUser = req.user._id;

  if (!name || !loggedInUser) {
    return res
      .status(400)
      .json(new apiResponse(400, {}, "Name and user is required"));
  }

  const existingProject = await projectModel.findOne({ name });
  if (existingProject) {
    return res
      .status(400)
      .json(new apiResponse(400, {}, "Project name already exists"));
  }

  const project = await projectModel.create({
    name,
    users: [loggedInUser],
  });

  res
    .status(201)
    .json(new apiResponse(201, project, "project created successfully"));
});

const getAllProjects = asyncHandler(async (req, res) => {
  const loggedInUser = req.user._id;

  if (!loggedInUser) {
    return res.status(400).json(new apiResponse(400, {}, "User is required"));
  }

  const projects = await projectModel.find({ users: loggedInUser });

  if (!projects) {
    return res.status(404).json(new apiResponse(404, {}, "No projects found"));
  }

  res
    .status(200)
    .json(new apiResponse(200, projects, "Projects retrieved successfully"));
});

export { createProject, getAllProjects };
