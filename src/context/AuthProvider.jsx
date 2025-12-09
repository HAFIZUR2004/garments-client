import React, { createContext, useState, useEffect } from "react";
import { auth } from "../firebase/firebase.config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Firebase register
  const registerUser = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  // Firebase login
  const loginUser = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  // Google login
  const googleLogin = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  // Logout
  const logOut = () => {
    localStorage.removeItem("user");
    return signOut(auth);
  };

  // 🔥 FIX REFRESH LOGIN ISSUE
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      // ✅ Backend থেকে user info আনবে
      const res = await axios.get(
        `http://localhost:5000/api/users/by-email/${currentUser.email}`
      );

      const dbUser = res.data;

      const userData = {
        uid: currentUser.uid,
        email: currentUser.email,
        name: dbUser.name,
        role: dbUser.role,
        status: dbUser.status,
        photoURL: dbUser.photoURL || "",
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      setUser(null);
      localStorage.removeItem("user");
    }
    setLoading(false);
  });

  return () => unsubscribe();
}, []);





  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        registerUser,
        loginUser,
        googleLogin,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
