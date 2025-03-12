import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { logOut } from "../utils/auth";
import { auth } from "../firebase/firebaseConfig";
import { db } from "../firebase/firebaseConfig";
import { getDoc, doc } from "firebase/firestore";

const Home = () => {
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
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-yellow-50 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Welcome to the Community Events Platform
      </h1>
      <p className="text-lg text-gray-600 text-center max-w-2xl">
        Discover and participate in amazing local events. Sign up to stay
        updated and add events to your personal calendar.
      </p>
      <div className="mt-6">
        <Link
          to="/events"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Browse Events
        </Link>
        {user ? (
          <>
            {/* <span className="mr-9"> </span>
            <button onClick={logOut} className="bg-red-500 px-4 py-2 rounded">
              Logout
            </button> */}
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="ml-4 bg-gray-700 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-800 transition"
            >
              Login
            </Link>
            <Link
              to="/signUp"
              className="ml-4 bg-gray-700 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-800 transition"
            >
              Sign Up!
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
