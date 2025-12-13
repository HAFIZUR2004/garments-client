// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const { loginUser, googleLogin } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const backendUrl = "http://localhost:5000";

  // 🔑 Email & Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await loginUser(email, password);
      const token = await userCredential.user.getIdToken(true);
      localStorage.setItem("token", token);

      const res = await fetch(`${backendUrl}/api/users/by-email/${email}`);
      if (!res.ok) {
        await fetch(`${backendUrl}/api/users/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: userCredential.user.displayName || "",
            email,
            role: "buyer",
            status: "pending",
          }),
        });
      }

      Swal.fire("Success!", "Login Successful", "success");
      navigate("/");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  // 🔑 Google Login
  const handleGoogleLogin = async () => {
    try {
      const result = await googleLogin();
      const token = await result.user.getIdToken(true);
      localStorage.setItem("token", token);

      const res = await fetch(
        `${backendUrl}/api/users/by-email/${result.user.email}`
      );
      if (!res.ok) {
        await fetch(`${backendUrl}/api/users/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: result.user.displayName || "",
            email: result.user.email,
            role: "buyer",
            status: "pending",
          }),
        });
      }

      Swal.fire("Success!", "Google Login Successful", "success");
      navigate("/");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded"
            required
          />

          {/* 🔐 Password with Show/Hide */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 rounded w-full pr-10"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded"
          >
            Login
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          className="mt-4 bg-red-600 text-white p-2 rounded w-full"
        >
          Login with Google
        </button>

        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
