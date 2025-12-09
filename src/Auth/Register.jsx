import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth"; // ✅ hook import

const Register = () => {
  const navigate = useNavigate();
  const { registerUser } = useAuth(); // ✅ hook INSIDE component

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
      // ✅ STEP 1: Firebase Register
      const firebaseRes = await registerUser(email, password);
      const firebaseUser = firebaseRes.user;

      console.log("✅ Firebase User Created:", firebaseUser);

      // ✅ STEP 2: Save User in MongoDB
      const res = await fetch("http://localhost:5000/api/users/register", {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-extrabold mb-8 text-center">
          Create Your Account
        </h2>

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          <input type="text" placeholder="Name" value={name}
            onChange={(e) => setName(e.target.value)} required className="input" />

          <input type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)} required className="input" />

          <input type="text" placeholder="Photo URL"
            value={photoURL} onChange={(e) => setPhotoURL(e.target.value)} className="input" />

          <select value={role} onChange={(e) => setRole(e.target.value)} className="input">
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
              className="input"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </span>
          </div>

          <button type="submit" className="btn">
            Register
          </button>
        </form>

        <p className="mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
