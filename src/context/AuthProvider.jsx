import React, { createContext, useState, useEffect } from "react";
import { auth } from "../firebase/firebase.config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const registerUser = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const loginUser = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const googleLogin = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setFirebaseUser(currentUser);

        try {
          const token = await currentUser.getIdToken();
          localStorage.setItem("token", token);

          const res = await axios.get(
            `http://localhost:5000/api/users/by-email/${currentUser.email}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        } catch (err) {
          console.error("User fetch error:", err);
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
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
