import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";

function Login({ setauth }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);

    if (!formData.email || !formData.password) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );
      console.log("token:", res.data.token);
      localStorage.setItem("email", formData.email);
      localStorage.setItem("token", res.data.token);

    
      console.log("Login response:", res.data);
      toast.success("Login Successfully")
      navigate('/')
      // Reset form
      setFormData({
        email: "",
        password: ""
      });


    } catch (error) {
      toast.error("Login Failed")
      console.log("Login error:", error);
      console.error("Login error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="bg-[#9CAFAA] p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#1C352D]">Login.</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData?.email||""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData?.password||""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-md transition duration-200"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-5 text-sm">
          if Don't have account?{" "}
          <span
            className="text-gray-700 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
