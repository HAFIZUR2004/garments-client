import React, { createContext, useState, useEffect } from "react";
import { auth } from "../firebase/firebase.config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

 const registerUser = async (email, password, name, photoURL) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  // ফায়ারবেস প্রোফাইল আপডেট করুন যাতে সাথে সাথে ছবি পাওয়া যায়
  await updateProfile(result.user, {
    displayName: name,
    photoURL: photoURL
  });
  return result;
};
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
