// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { registerUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [role, setRole] = useState("buyer");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    const uppercase = /[A-Z]/.test(password);
    const lowercase = /[a-z]/.test(password);
    const minLength = password.length >= 6;

    if (!uppercase || !lowercase || !minLength) {
      return Swal.fire({
        icon: "error",
        title: "Password must have:",
        html:
          "✅ At least one uppercase letter<br/>✅ At least one lowercase letter<br/>✅ Minimum 6 characters",
      });
    }

    try {
     const firebaseRes = await registerUser(email, password, name, photoURL);
  const firebaseUser = firebaseRes.user;
      const res = await fetch("https://garments-server-omega.vercel.app/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          photoURL,
          role,
          uid: firebaseUser.uid,
          status: "pending",
        }),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/login");
      } else {
        Swal.fire({ icon: "error", title: "Oops...", text: data.error });
      }
    } catch (err) {
      console.error("❌ Register Error:", err);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: err.message,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md relative">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
          Create Your Account
        </h2>

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border border-gray-300 rounded-lg p-3 text-black placeholder-black/50 focus:ring-2 focus:ring-purple-400 outline-none transition"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-300 rounded-lg p-3 text-black placeholder-black/50 focus:ring-2 focus:ring-purple-400 outline-none transition"
          />

          <input
            type="text"
            placeholder="Photo URL (optional)"
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 text-black placeholder-black/50 focus:ring-2 focus:ring-purple-400 outline-none transition"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 text-black placeholder-black/50 focus:ring-2 focus:ring-purple-400 outline-none transition"
          >
            <option value="buyer">Buyer</option>
            <option value="manager">Manager</option>
          </select>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-gray-300 rounded-lg p-3 w-full pr-12 text-black placeholder-black/50 focus:ring-2 focus:ring-purple-400 outline-none transition"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 transition"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </span>
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-xl font-semibold shadow-md hover:scale-105 transform transition"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 font-semibold underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
