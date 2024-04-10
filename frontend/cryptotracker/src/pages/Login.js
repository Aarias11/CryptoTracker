import React, { useState, useContext, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import ThemeContext from "../components/ThemeContext/ThemeContext";

function Login({ closeModal }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { theme } = useContext(ThemeContext); // Using ThemeContext

  const nav = useNavigate();

  // UseEffect for saving email for "remember me""
  useEffect(() => {
    // Check if user information is saved in local storage
    const savedEmail = localStorage.getItem("emailForSignIn");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Handle Login Function
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      alert("User logged in successfully");

      if (rememberMe) {
        // Save email to local storage
        localStorage.setItem("emailForSignIn", email);
      } else {
        // Clear email from local storage
        localStorage.removeItem("emailForSignIn");
      }

      closeModal(); // Call closeModal on successful login
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div
        className={`p-8 rounded-lg shadow-xl lg:w-1/3 md:w-1/2 w-full relative ${
          theme === "dark"
            ? "bg-[#1a1a1a]/90 text-white"
            : "bg-white text-gray-900"
        }`}
      >
        <h2 className="text-3xl font-semibold text-center ">Login</h2>
        {/* Form  */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="text-sm font-medium ">
              Email Address
            </label>
            <input
              className="w-full p-3 mt-1 border rounded-md  text-black focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium ">
              Password
            </label>
            <input
              className="w-full p-3 mt-1 border rounded-md text-black focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                checked={rememberMe} // Bind the checked attribute to the rememberMe state
                onChange={(e) => setRememberMe(e.target.checked)} // Update rememberMe state based on checkbox value
              />
              <label
                htmlFor="remember-me"
                className={`block ml-2 text-sm ${
                  theme === "dark" ? " text-white" : "bg-white text-gray-900"
                }`}
              >
                {" "}
                Remember me{" "}
              </label>
            </div>
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-teal-600 hover:text-teal-500"
              >
                {" "}
                Forgot your password?{" "}
              </a>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-3 mt-6 font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 focus:outline-none focus:bg-teal-700"
            >
              Login
            </button>
          </div>
        </form>
        <button
          className={`absolute top-0 right-0 p-4 ${
            theme === "dark" ? " " : " text-gray-900"
          }`}
          onClick={closeModal}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default Login;
