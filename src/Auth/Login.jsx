import React, { useState, useContext } from "react";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const { loginUser, googleLogin } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const backendUrl = "https://garments-server-omega.vercel.app";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await loginUser(email, password);
      const token = await userCredential.user.getIdToken(true);
      localStorage.setItem("token", token);

      await fetch(`${backendUrl}/api/users/by-email/${email}`)
        .then((res) => {
          if (!res.ok) {
            return fetch(`${backendUrl}/api/users/register`, {
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
        });

      Swal.fire("Success!", "Login Successful", "success");
      navigate("/"); // 🔥 NO RELOAD NEEDED
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await googleLogin();
      const token = await result.user.getIdToken(true);
      localStorage.setItem("token", token);

      await fetch(`${backendUrl}/api/users/by-email/${result.user.email}`)
        .then((res) => {
          if (!res.ok) {
            return fetch(`${backendUrl}/api/users/register`, {
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
        });

      Swal.fire("Success!", "Google Login Successful", "success");
      navigate("/");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center mb-6">Welcome Back</h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 rounded-lg"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-3 rounded-lg w-full pr-12"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button className="bg-blue-600 text-white p-3 rounded-lg font-bold">
            Login
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          className="mt-5 w-full bg-red-600 text-white p-3 rounded-lg flex items-center justify-center gap-3"
        >
          <FaGoogle /> Login with Google
        </button>

        <p className="mt-6 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-blue-600 font-bold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
