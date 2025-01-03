import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../config/axios";

const initialState = {
  isAuthenticated: false,
  user: null,
  allUsers: [],
  token: null,
  isLoading: false,
};

export const signup = createAsyncThunk("auth/signup", async (formData) => {
  try {
    const response = await axios.post("/auth/signup", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
});
// Async thunk for login
export const login = createAsyncThunk("auth/login", async (formData) => {
  try {
    const response = await axios.post("/auth/login", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
});

export const getAllUsers = createAsyncThunk("auth/get-all-users", async () => {
  try {
    const response = await axios.get("/auth/get-all", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
});

export const getProfile = createAsyncThunk("auth/get-Profile", async () => {
  try {
    const response = await axios.get("/auth/get-Profile", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.data.loggedInUser;
        state.token = action.payload.data.token;
        state.isAuthenticated = true;
        state.isLoading = false;
        localStorage.setItem("token", action.payload.data.token);
      })
      .addCase(login.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      })
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(signup.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      })
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.allUsers = action.payload.data;
        state.isLoading = false;
      })
      .addCase(getAllUsers.rejected, (state) => {
        state.allUsers = [];
        state.isLoading = false;
      })
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.isLoading = false;
        state.isAuthenticated = true;
      })
      .addCase(getProfile.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      });
  },
});

export default authSlice.reducer;
