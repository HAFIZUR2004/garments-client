import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../hooks/useAuth";

const AuthForm = ({ type = "register" }) => {
  const { registerUser, loginUser, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "", email: "", photoURL: "", role: "buyer", password: ""
  });

  const handleChange = e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (type === "register") {
      const { password } = formData;
      if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || password.length < 6) {
        return Swal.fire({
          icon: "error",
          title: "Password invalid",
          html: "✅ Uppercase<br/>✅ Lowercase<br/>✅ Min 6 chars"
        });
      }
      try {
        await registerUser(formData.email, formData.password, formData.name, formData.photoURL, formData.role);
        Swal.fire({ icon: "success", title: "Registered!", timer: 1500 });
        navigate("/login");
      } catch (err) {
        Swal.fire({ icon: "error", text: err.response?.data?.message || err.message });
      }
    } else {
      try {
        await loginUser(formData.email, formData.password);
        Swal.fire({ icon: "success", title: "Login Successful", timer: 1500 });
        navigate("/");
      } catch (err) {
        Swal.fire({ icon: "error", text: err.response?.data?.message || err.message });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">{type === "login" ? "Login" : "Register"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {type === "register" && <>
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="border p-2 rounded" required />
            <input name="photoURL" value={formData.photoURL} onChange={handleChange} placeholder="Photo URL" className="border p-2 rounded" />
            <select name="role" value={formData.role} onChange={handleChange} className="border p-2 rounded">
              <option value="buyer">Buyer</option>
              <option value="manager">Manager</option>
            </select>
          </>}
          <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded" required />
          <input name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="border p-2 rounded" required />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">{type === "login" ? "Login" : "Register"}</button>
        </form>
        {type === "login" && <button onClick={googleLogin} className="mt-4 bg-red-500 text-white p-2 rounded w-full hover:bg-red-600">Login with Google</button>}
        <p className="mt-4 text-center text-gray-600">
          {type === "login" ? "Don't have an account?" : "Already have an account?"}
          <Link to={type === "login" ? "/register" : "/login"} className="text-blue-500 font-semibold">{type === "login" ? "Register" : "Login"}</Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
