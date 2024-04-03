import React, { useState, useContext } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// Make sure your Firebase configuration is properly imported
import ThemeContext from "../components/ThemeContext";

function SignUp({ closeSignUpModal }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { theme } = useContext(ThemeContext); // Using ThemeContext

  const handleRegister = async (event) => {
    event.preventDefault();

    const auth = getAuth();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("User registered successfully");
    } catch (error) {
      console.error("Error during registration:", error.message);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 ${
        theme === "dark" ? "bg-gray-800 text-primary-700" : " "
      }`}
    >
      <div
        className={`p-8 rounded-lg shadow-xl lg:w-1/3 md:w-1/2 w-full relative ${
          theme === "dark"
            ? "bg-primary-900 "
            : ""
        }`}
      >
        <h2 className="text-3xl font-semibold text-center ">Sign Up</h2>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              className="w-full p-3 mt-1 border rounded-md focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              className="w-full p-3 mt-1 border rounded-md focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-3 mt-6 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
            >
              Sign Up
            </button>
          </div>
        </form>
        <button className={`absolute top-0 right-0 p-4 ${
        theme === "dark" ? " " : " text-gray-900"
      }`} onClick={closeSignUpModal}>Close</button>
      </div>
    </div>
  );
}

export default SignUp;
