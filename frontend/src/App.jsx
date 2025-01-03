import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Profile from "./pages/Profile";
import AuthLayout from "./components/auth/AuthLayout";
import Login from "./pages/Auth/Login";
import { Signup } from "./pages/Auth/Signup";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import Project from "./pages/Project";
import CheckAuth from "./components/common/Check-auth";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <CheckAuth>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>
        <Route path="/" element={<Home />} />
        <Route
          path="/profile"
          element={
            <CheckAuth>
              <Profile />
            </CheckAuth>
          }
        />
        <Route
          path="/project"
          element={
            <CheckAuth>
              <Project />
            </CheckAuth>
          }
        />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
