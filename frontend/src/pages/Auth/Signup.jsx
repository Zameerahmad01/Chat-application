import { LogIn } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { signup } from "../../store/auth-slice";

const initialState = {
  fullName: "",
  email: "",
  password: "",
};

export function Signup() {
  const [formData, setFormData] = useState(initialState);

  const Navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signup(formData)).then((res) => {
      console.log(res.payload);
      if (res.payload.success) {
        toast.success(res.payload.message);
        Navigate("/");
      } else {
        toast.error(res.payload.message);
      }
    });
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600 text-white mb-4">
          <LogIn size={24} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Create an account
        </h2>
        <p className="text-gray-600">Join us today and get started</p>
      </div>
      <div className="bg-white rounded-xl shadow-xl p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="First name"
            name="firstName"
            placeholder="John"
            required
            onChange={(e) => {
              setFormData({ ...formData, fullName: e.target.value });
            }}
          />

          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="john@example.com"
            required
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
            }}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Create a strong password"
            required
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
            }}
          />

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                required
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <span className="ml-2 text-sm text-gray-600">
                I agree to the{" "}
                <a href="#" className="text-indigo-600 hover:text-indigo-700">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-indigo-600 hover:text-indigo-700">
                  Privacy Policy
                </a>
              </span>
            </label>
          </div>

          <Button type="submit">Create account</Button>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
      <ToastContainer />;
    </div>
  );
}
