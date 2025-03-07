import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { logOut } from "../utils/auth";
import { auth } from "../firebase/firebaseConfig";
import { db } from "../firebase/firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import logo from "../assets/CC.png";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserName(userSnap.data().name);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between items-center">
      <Link to="/">
        <img src={logo} alt="Community Connect Logo" className="h-10" />
      </Link>
      <div>
        {user ? (
          <>
            <span className="mr-4">Hello, {userName || "User"}! </span>
            <button onClick={logOut} className="bg-red-500 px-4 py-2 rounded">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">
              Login
            </Link>
            <Link to="/signup" className="">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
