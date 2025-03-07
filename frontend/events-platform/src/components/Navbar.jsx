import { Link } from "react-router-dom";
import { logOut } from "../utils/auth";
import React, { useState, useEffect } from "react";
import { auth } from "../firebase/firebaseConfig";

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <nav className="">
      <Link to="/" className="">
        Events Plaltform
      </Link>
      <div>
        {user ? (
          <>
            <span className="">Hello, {user.email} </span>
            <button onClick={logOut} className="">
              Logout
            </button>
            /
          </>
        ) : (
          <>
            <Link to="/login" className="">
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
