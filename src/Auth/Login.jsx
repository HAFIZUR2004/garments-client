import React, { useState, useContext } from "react";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const Login = () => {
  const navigate = useNavigate();
  const { backendLogin, googleLogin, backendGoogleLogin } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Email/Password backend login
const { loginUser } = useContext(AuthContext);

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    await loginUser(email, password); // ✅ Firebase login
    Swal.fire("Success!", "Login Successful", "success");
    navigate("/");
  } catch (err) {
    Swal.fire("Error", err.message, "error");
  }
};


  // Google login
  const handleGoogleLogin = async () => {
    try {
      const result = await googleLogin(); // Firebase Google login
      await backendGoogleLogin(result.user); // Backend sync
      Swal.fire("Success!", "Google Login Successful", "success");
      navigate("/");
    } catch (err) {
      Swal.fire("Error", err.message || "Google Login Failed", "error");
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
            className="border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded">
            Login
          </button>
        </form>

        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={handleGoogleLogin}
            className="bg-red-600 text-white p-2 rounded flex items-center justify-center gap-2"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Login with Google
          </button>
        </div>

        <p className="mt-4 text-center">
          No account? <Link to="/register" className="text-blue-500">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
