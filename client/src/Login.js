import React, { useState } from "react";

function Login({ setIsLoggedIn }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (user === "admin" && pass === "12345") {
      setIsLoggedIn(true);
    } else {
      setError("Wrong username or password");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 border p-6 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Login</h2>

      <input
        placeholder="Username"
        className="border w-full p-2 mb-3"
        onChange={(e) => setUser(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border w-full p-2 mb-3"
        onChange={(e) => setPass(e.target.value)}
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white w-full py-2"
      >
        Login
      </button>
    </div>
  );
}

export default Login;
