import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../config/axios";

const initialState = {
  project: null,
  projects: [],
  isLoading: false,
  error: null,
};

export const createProject = createAsyncThunk(
  "project/createProject",
  async (projectData) => {
    try {
      const response = await axios.post("/project/create", projectData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const getAllProjects = createAsyncThunk(
  "project/getAllProjects",
  async () => {
    const response = await axios.get("/project/get-all", {
      withCredentials: true,
    });
    return response.data;
  }
);

export const addCollaborators = createAsyncThunk(
  "project/add-collaborators",
  async (projectData) => {
    try {
      const response = await axios.put("/project/add-user", projectData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const getProject = createAsyncThunk(
  "project/get-project",
  async (projectId) => {
    try {
      const response = await axios.get(`project/get-project/${projectId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const updateFileTree = createAsyncThunk(
  "project/update-file-tree",
  async (fileTreeData) => {
    try {
      const response = await axios.put(
        "/project/update-filetree",
        fileTreeData,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        action.payload.success
          ? state.projects.push(action.payload.data)
          : state.projects;
        state.isLoading = false;
      })
      .addCase(createProject.rejected, (state) => {
        state.projects = [];
        state.isLoading = false;
      })
      .addCase(getAllProjects.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProjects.fulfilled, (state, action) => {
        state.projects = action.payload.data;
        state.isLoading = false;
      })
      .addCase(getAllProjects.rejected, (state) => {
        state.projects = [];
        state.isLoading = false;
      })
      .addCase(getProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProject.fulfilled, (state, action) => {
        state.project = action.payload.data;
        state.isLoading = false;
      })
      .addCase(getProject.rejected, (state) => {
        state.isLoading = false;
        state.project = null;
      });
  },
});

export default projectSlice.reducer;
