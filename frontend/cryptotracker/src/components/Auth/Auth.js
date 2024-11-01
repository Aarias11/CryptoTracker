import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import ThemeContext from "../ThemeContext/ThemeContext";
import { RxHamburgerMenu } from "react-icons/rx";
import { GoStarFill } from "react-icons/go";
import { GiPieChart } from "react-icons/gi";
import { PiMapTrifoldFill } from "react-icons/pi";
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";

import {
  RiCloseLine,
  RiSunLine,
  RiMoonLine,
  RiDashboardLine,
  RiExchangeDollarLine,
  RiSearchLine,
  RiBookLine,
  RiGalleryLine,
  RiStarLine,
  RiBriefcaseLine,
  RiLoginBoxLine,
  RiUserAddLine,
} from "react-icons/ri";
import Login from "../../pages/Login";
import SignUp from "../../pages/SignUp";

import { PiCurrencyBtcFill } from "react-icons/pi";
import SearchComponent from "../SearchComponent/SearchComponent";

function Auth() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false); // State to manage the search component's visibility

  const dropdownRef = useRef(null);
  const searchRef = useRef(null); // Reference for the search component

  const nav = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext); // Using ThemeContext

  // Additional state
  const [user, setUser] = useState(null); // To store the user's information

  const auth = getAuth();

  const isLoggedIn = !!user;

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        setUser(user);
      } else {
        // User is signed out
        setUser(null);
      }
    });

    return () => unsubscribe(); // Clean up subscription
  }, [auth]);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful
        nav("/");
      })
      .catch((error) => {
        // An error happened
        console.error("Sign out error", error);
      });
  };

  // Detect clicks outside of the search component and the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchExpanded(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchExpanded, isDropdownOpen]);

  // OPEN LOGIN MODAL
  const openModal = () => {
    setIsLoginModalOpen(true);
  };
  // Open SignUp Modal
  const openSignUpModal = () => {
    setIsSignUpModalOpen(true);
  };

  // Close Login Modal
  const closeModal = () => {
    setIsLoginModalOpen(false);
    // Correctly use setIsLoginModalOpen to manage the modal state
  };

  // Close Signup Modal
  const closeSignUpModal = () => {
  console.log("Close button clicked");  // Add this line
  setIsSignUpModalOpen(false);
};

  

  return (
    <div
      className={`flex justify-between items-center ${
        theme === "dark" ? " " : " "
      }`}
    >
      
      <ul
        className={`w-full flex justify-end text-sm   label-12 gap-5 items-center ${
          theme === "dark" ? " " : " "
        }`}
      >
        {!isLoggedIn ? (
          <>
            <ul
              className={`flex justify-end gap-4 w-auto lg:w-[210px]  items-center  text-[12px] ${
                theme === "dark" ? " text-red-400" : " text-teal-600"
              }`}
            >
              {/* <li className="hidden xl:flex items-center gap-2 translate-x-6 ">
                <PiCurrencyBtcFill className="text-yellow-500" size={23} />
                <span className="w-[100px]">Halving: 3D</span>
              </li> */}
<li onClick={toggleTheme} className="cursor-pointer">
          {theme === "dark" ? (
            <BsSunFill className="text-yellow-500" size={24} />
          ) : (
            <BsMoonStarsFill className="text-blue-900" size={24} />
          )}
        </li>
              <li className="pt-1" ref={searchRef}>
                <SearchComponent
                  theme={theme}
                  searchExpanded={searchExpanded}
                  setSearchExpanded={setSearchExpanded}
                />
              </li>
            </ul>
          </>
        ) : (
          <>
            <ul
              className={`flex justify-end gap-4 w-auto lg:w-[210px]  items-center  text-[12px] ${
                theme === "dark" ? " text-red-400" : " text-teal-600"
              }`}
            >
              {/* <li className="hidden xl:flex items-center gap-2 translate-x-6 ">
                <PiCurrencyBtcFill className="text-yellow-500" size={23} />
                <span className="w-[100px]">Halving: 16D</span>
              </li> */}
              <li className="hidden xl:flex  gap-2 items-center">
                <GoStarFill className="text-yellow-400" size={20} />
                <Link to="/watchlist">
                  <span className="text-primary-400">Watchlist</span>
                </Link>
              </li>
              <li className="hidden xl:flex  gap-2 items-center">
                <GiPieChart className="text-slate-400" size={20} />
                <Link to="/portfolio">
                  <span className="text-primary-400">Portfolio</span>
                </Link>
              </li>
              <li onClick={toggleTheme} className="cursor-pointer">
          {theme === "dark" ? (
            <BsSunFill className="text-yellow-500" size={24} />
          ) : (
            <BsMoonStarsFill className="text-blue-900" size={24} />
          )}
        </li>
              <li ref={searchRef}>
                <SearchComponent
                  theme={theme}
                  searchExpanded={searchExpanded}
                  setSearchExpanded={setSearchExpanded}
                />
              </li>
            </ul>
          </>
        )}
        {user ? (
          <>
            <li
              className={`hidden xl:flex font-semibold ${
                theme === "dark" ? " text-[#EAF2FD]" : " text-teal-600"
              } `}
            >
              {user.email}
            </li>

            {/* User avatar and dropdown menu toggle */}
            <li className="relative" ref={dropdownRef}>
              <Avatar
              sx={{ width: 35, height: 35 }}
                className="w-10 h-10 rounded-full cursor-pointer object-cover"
                src={user.photoURL}
                alt="User Avatar"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />
              {isDropdownOpen && (
                <div
                  className={`absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md  ${
                    theme === "dark"
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-900"
                  } transition duration-150 ease-in-out z-50`}
                >
                  <ul>
                    <Link to="/account">
                      <li
                        className={`px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                          theme === "dark"
                            ? "bg-gray-800 text-white"
                            : "bg-white text-gray-900"
                        }`}
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Account
                      </li>
                    </Link>
                    <li
                      className={`px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                        theme === "dark"
                          ? "bg-gray-800 text-white"
                          : "bg-white text-gray-900"
                      }`}
                      onClick={() => {
                        handleSignOut();
                        setIsDropdownOpen(false);
                      }}
                    >
                      Sign Out
                    </li>
                  </ul>
                </div>
              )}
            </li>
          </>
        ) : (
          <>
            <li
              className={`w-[70px] p-1  justify-center rounded-lg  font-semibold cursor-pointer hidden xl:flex ${
                theme === "dark"
                  ? " bg-primary-600 text-primary-25"
                  : " text-zinc-700"
              }`}
              onClick={openModal}
            >
              Login
            </li>
            <li
              className="font-semibold cursor-pointer hidden xl:flex"
              onClick={openSignUpModal}
            >
              Sign Up
            </li>
          </>
        )}
        {/* Hamburger Menu Icon */}
        <div className="xl:hidden pt-1">
          <RxHamburgerMenu
            className="cursor-pointer"
            size={25}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>
      </ul>

      {/* Conditionally render the Login modal */}
      {isLoginModalOpen && <Login closeModal={closeModal} />}
      {isSignUpModalOpen && <SignUp closeSignUpModal={closeSignUpModal} />}

      <div
        className={`fixed inset-y-0 right-0 w-[50%] h-screen  bg-[#F8F9FA] shadow-xl transform border-l border-zinc-700  ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out lg:hidden z-50`}
      >
        {/* Menu Header */}
        <div
          className={`flex justify-between items-center h- p-2 border-b border-zinc-700 ${
            theme === "dark"
              ? "bg-gradient-to-r from-[#07172b]  to-primary-900 "
              : "bg-white text-gray-900"
          }`}
        >
          <h2 className="text-xl font-semibold ">Menu</h2>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-gray-500 hover:text-gray-800 p-2 rounded-md"
          >
            <RiCloseLine className="text-2xl" />
          </button>
        </div>

        {/* Profile Information */}
        {user && (
          <div
            className={`p-2 border-b border-zinc-700  ${
              theme === "dark"
                ? "bg-gradient-to-r from-[#07172b]  to-primary-900 "
                : "bg-white "
            }`}
          >
            <div className="flex items-center space-x-3">
              <img
              sx={{ width: 35, height: 35 }}
                className="w-10 h-10 rounded-full cursor-pointer"
                src={user.photoURL}
                alt="User Avatar"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />
              <div>
                <p className="label-semibold-12 ">{user.email}</p>
              </div>
              {/* Footer - Theme Switcher */}

              <div className="w-full flex justify-end translate-x-1.5">
                <button
                  onClick={toggleTheme}
                  className="flex items-center justify-center w-auto p-2 rounded-md text-gray-900"
                >
                  {theme === "dark" ? (
                    <RiSunLine
                      size={25}
                      className="text-orange-500 text-xl mr-2"
                    />
                  ) : (
                    <RiMoonLine size={25} className="text-xl mr-2" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div
          className={`overflow-y-auto  h-screen ${
            theme === "dark"
              ? "bg-gradient-to-r from-[#07172b]  to-primary-900"
              : "bg-white text-gray-900"
          }`}
        >
          <ul className="p-4 space-y-4">
            {/* Adding Icons to the Links for better UX */}
            {!isLoggedIn ? (
              <>
                <li className="group flex items-center p-2 rounded-md hover:bg-gray-700 hover:text-zinc-100">
                  <RiDashboardLine
                    className={`text-lg mr-2 ${
                      theme === "dark" ? "text-zinc-200" : "text-zinc-800"
                    }`}
                  />
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                    Cryptocurrencies
                  </Link>
                </li>
                <li className="group flex items-center p-2 rounded-md hover:bg-gray-700 hover:text-zinc-100">
                  <RiExchangeDollarLine
                    className={`text-lg mr-2 ${
                      theme === "dark" ? "text-zinc-200" : "text-zinc-800"
                    }`}
                  />
                  <Link
                    to="/exchanges"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Exchanges
                  </Link>
                </li>
                <li className="group flex items-center p-2 rounded-md hover:bg-gray-700 hover:text-zinc-100">
                  <PiMapTrifoldFill
                    className={`text-lg mr-2 ${
                      theme === "dark" ? "text-zinc-200" : "text-zinc-800"
                    }`}
                  />
                  <Link
                    to="/heatmap"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    HeatMap
                  </Link>
                </li>

                <li className="group flex items-center p-2 rounded-md hover:bg-gray-700 hover:text-zinc-100">
                  <RiBookLine
                    className={`text-lg mr-2 ${
                      theme === "dark" ? "text-zinc-200" : "text-zinc-800"
                    }`}
                  />
                  Learn
                </li>
                <li className="group flex items-center p-2 rounded-md hover:bg-gray-700 hover:text-zinc-100">
                  <RiLoginBoxLine
                    className={`text-lg mr-2 ${
                      theme === "dark" ? "text-zinc-200" : "text-zinc-800"
                    }`}
                  />
                  <button
                    onClick={() => {
                      setIsLoginModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-base"
                  >
                    Login
                  </button>
                </li>
                <li className="group flex items-center p-2 rounded-md hover:bg-gray-700 hover:text-zinc-100">
                  <RiUserAddLine
                    className={`text-lg mr-2 ${
                      theme === "dark" ? "text-zinc-200" : "text-zinc-800"
                    }`}
                  />
                  <button
                    onClick={() => {
                      setIsSignUpModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-base"
                  >
                    Signup
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="group flex items-center p-2 rounded-md hover:bg-gray-700 hover:text-zinc-100">
                  <RiDashboardLine
                    className={`text-lg mr-2 ${
                      theme === "dark" ? "text-zinc-200" : "text-zinc-800"
                    }`}
                  />
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                    Cryptocurrencies
                  </Link>
                </li>
                <li className="group flex items-center p-2 rounded-md hover:bg-gray-700 hover:text-zinc-100">
                  <RiExchangeDollarLine
                    className={`text-lg mr-2 ${
                      theme === "dark" ? "text-zinc-200" : "text-zinc-800"
                    }`}
                  />
                  <Link
                    to="/exchanges"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Exchanges
                  </Link>
                </li>
                <li className="group flex items-center p-2 rounded-md hover:bg-gray-700 hover:text-zinc-100">
                  <PiMapTrifoldFill
                    className={`text-lg mr-2 ${
                      theme === "dark" ? "text-zinc-200" : "text-zinc-800"
                    }`}
                  />
                  <Link
                    to="/heatmap"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    HeatMap
                  </Link>
                </li>
                <li className="group flex items-center p-2 rounded-md hover:bg-gray-700 hover:text-zinc-100">
                  <RiGalleryLine
                    className={`text-lg mr-2 ${
                      theme === "dark" ? "text-zinc-200" : "text-zinc-800"
                    }`}
                  />
                  <Link
                    to="/community"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Community
                  </Link>
                </li>

                {/* Portfolio */}
                <li className="group flex items-center p-2 rounded-md hover:bg-gray-700 hover:text-zinc-100">
                  <RiBriefcaseLine
                    className={`text-lg mr-2 ${
                      theme === "dark" ? "text-zinc-200" : "text-zinc-800"
                    }`}
                  />
                  <Link
                    to="/portfolio"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Portfolio
                  </Link>
                </li>

                {/* Watchlist */}
                <li className="group flex items-center p-2 rounded-md hover:bg-gray-700 hover:text-zinc-100">
                  <RiStarLine
                    className={`text-lg mr-2 ${
                      theme === "dark" ? "text-zinc-200" : "text-zinc-800"
                    }`}
                  />
                  <Link
                    to="/watchlist"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Watchlist
                  </Link>
                </li>
                <div className="text-center">
                  <button
                    onClick={handleSignOut}
                    className=" text-white mt-1 label-semibold-14 button-primary-small-hover-dark"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Auth;
