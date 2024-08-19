import React, { useState, useContext, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import ThemeContext from "../components/ThemeContext/ThemeContext";
import { FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons

function Login({ closeModal }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const { theme } = useContext(ThemeContext);

  const nav = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("emailForSignIn");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      alert("User logged in successfully");

      if (rememberMe) {
        localStorage.setItem("emailForSignIn", email);
      } else {
        localStorage.removeItem("emailForSignIn");
      }

      closeModal();
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
          theme === "dark" ? "bg-[#031021]" : "bg-white"
        }`}
      >
        <h2 className="text-3xl font-semibold text-center ">Login</h2>
        {/* Form  */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="relative">
            <label htmlFor="email" className="text-sm font-medium ">
              Email Address
            </label>
            <input
              className={`search-input w-full p-2 ${
                theme === "dark" ? "bg-[#031021] border border-primary-300 text-primary-200" : ""
              }`}
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required // Make email required
            />
            <FaEnvelope className="absolute right-3 top-9 text-gray-400" size={20} />
          </div>
          <div className="relative">
            <label htmlFor="password" className="text-sm font-medium ">
              Password
            </label>
            <input
              className={`search-input w-full p-2 ${
                theme === "dark" ? "bg-[#031021] border border-primary-300 text-primary-200" : ""
              }`}
              type={showPassword ? "text" : "password"} // Toggle between text and password
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required // Make password required
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <inputgit
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
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
