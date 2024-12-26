import projectModel from "../models/project.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";

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

  return res
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

  return res
    .status(200)
    .json(new apiResponse(200, projects, "Projects retrieved successfully"));
});

const addUserToProject = asyncHandler(async (req, res) => {
  const { projectId, users } = req.body;
  const loggedInUser = req.user._id;

  if (!projectId) {
    throw new Error("Project ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid project ID");
  }

  if (!users || !Array.isArray(users)) {
    throw new Error("Users array is required");
  }

  if (!loggedInUser) {
    throw new Error("Logged in user is required");
  }

  const project = await projectModel.findOne({
    _id: projectId,
    users: loggedInUser,
  });

  if (!project) {
    throw new Error(
      "Project not found or you are not authorized to add users to this project"
    );
  }

  const updatedProject = await projectModel.findOneAndUpdate(
    { _id: projectId },
    { $push: { users: { $each: users } } },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new apiResponse(200, updatedProject, "User added to project successfully")
    );
});

const getProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    throw new Error("Project ID is required");
  }

  const project = await projectModel
    .findOne({
      _id: projectId,
    })
    .populate("users");

  if (!project) {
    throw new Error("Project not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, project, "Project retrieved successfully"));
});

export { createProject, getAllProjects, addUserToProject, getProject };
