import React, { useState } from "react";
import { logIn } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await logIn(email, password);
    if (result.success) {
      navigate("/events");
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-gray-800">Log In</h2>
          <p className="text-gray-600 mt-2">Access your account</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition w-full"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
