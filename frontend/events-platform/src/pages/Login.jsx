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
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-black mb-4">Log In</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 w-full max-w-md"
      >
        <input
          type="email"
          placeholder="Email"
          className="p-2 border rounded w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="current-password"
          placeholder="Password"
          className="p-2 border rounded w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
