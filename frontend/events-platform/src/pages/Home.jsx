import React from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    console.log("Home component loaded!");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
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
        <Link
          to="/login"
          className="ml-4 bg-gray-700 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-800 transition"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Home;
