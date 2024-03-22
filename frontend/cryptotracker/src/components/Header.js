import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";
import axios from "axios";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import CryptoGlobalData from "../CryptoGlobalData.json";
import ThemeContext from "../components/ThemeContext";
import { RxHamburgerMenu } from "react-icons/rx";
import { GoStarFill } from "react-icons/go";
import { GiPieChart } from "react-icons/gi";
import { PiMapTrifoldFill } from "react-icons/pi";
import { IconAward } from '@tabler/icons-react';
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
} from "react-icons/ri";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";

function Header() {
  const [activeCoins, setActiveCoins] = useState(CryptoGlobalData);
  const [marketCap24h, setMarketCap24H] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
 

  const nav = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext); // Using ThemeContext

  // Additional state
  const [user, setUser] = useState(null); // To store the user's information

  const auth = getAuth();

  // useEffect(() => {
  //   axios
  //     .get("https://api.coingecko.com/api/v3/global")
  //     .then((response) => {
  //       // Rename `res` to `response` for clarity
  //       const data = response.data.data; // Now correctly access the nested data
  //       setActiveCoins(data.active_cryptocurrencies);
  //       setExchanges(data.markets);
  //       setMarketCap(data.total_market_cap.usd);
  //       setMarketCap24H(data.market_cap_change_percentage_24h_usd);
  //       setTotalVolume(data.total_volume.usd);
  //       setBtcDominance(data.market_cap_percentage.btc);
  //       setEtherDominance(data.market_cap_percentage.eth); // Make sure to specify the currency if needed
  //       // Make sure to specify the currency if needed

  //       // Logging for debugging
  //       // console.log(data.active_cryptocurrencies);
  //       // console.log(data.total_market_cap.usd);
  //     })
  //     .catch((error) => {
  //       console.log("Unable to fetch data", error);
  //     });
  // }, []);

  // const fetchCryptoData = async () => {
  //   const url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";
  //   const parameters = {
  //     start: '1',
  //     limit: '10',
  //     convert: 'USD'
  //   };
  //   const headers = {
  //     'X-CMC_PRO_API_KEY': '7f897da9-3e52-4fa9-9923-c8d6c7c16060',
  //     'Accept': 'application/json'
  //   };

  //   try {
  //     const response = await fetch(`${url}?${new URLSearchParams(parameters)}`, {
  //       method: "GET",
  //       headers: headers
  //     });
  //     if (!response.ok) throw new Error("Network response was not ok");
  //     const data = await response.json();
  //     console.log(data);
  //   } catch (error) {
  //     console.error("Error fetching data: ", error);
  //   }
  // };

  // fetchCryptoData();

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
  }, []);

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

  // OPEN LOGIN MODAL
  const openModal = () => {
    setIsLoginModalOpen(true);
    
  };
  // Open SignUp Modal
  const openSignUpModal = () => {
    setIsSignUpModalOpen(true)

  }

  // Close Login Modal
  const closeModal = () => {
    setIsLoginModalOpen(false);
     // Correctly use setIsLoginModalOpen to manage the modal state

  };
  

  const closeSignUpModal = () => {
    setIsSignUpModalOpen(false)
  }


  // Function to handle clicking outside to close the dropdown
const handleClickOutside = (event) => {
  if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
    setIsDropdownOpen(false);
  }
};

useEffect(() => {
  // Bind the event listener for clicks outside
  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    // Unbind the event listener on clean up
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);
  
  return (
    <div
      className={`flex px-5 justify-between items-center border-b border-zinc-500 ${
        theme === "dark" ? " " : " "
      }`}
    >
      {/* Hamburger Menu Icon */}
      <div className="lg:hidden">
        <RxHamburgerMenu
          size={25}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
      </div>
      <ul className="hidden lg:flex text-xs gap-10 p-2 label-12  font-light text-zinc-500 items-center">
        <li>
          Coins:{" "}
          <span className="font-bold text-teal-600">
            {Number(activeCoins.data.active_cryptocurrencies).toLocaleString()}
          </span>
        </li>
        <li>
          Exchanges:{" "}
          <span className="font-bold text-teal-600">
            {activeCoins.data.markets}
          </span>
        </li>

        <li>
          Market Cap:{" "}
          <span className="font-bold text-teal-600">
            {activeCoins.data.markets.toString().slice(0, 3)}T USD
          </span>
        </li>
        <li>
          24h Vol:
          <span
            className={
              marketCap24h > 0.01
                ? "text-green-500 font-bold"
                : marketCap24h <= 0.0
                ? "text-red-500 font-bold"
                : "text-black"
            }
          >
            {" "}
            {Number(
              activeCoins.data.market_cap_change_percentage_24h_usd
            ).toFixed(2)}
            %
          </span>
        </li>
        <li>
          Total Volume:{" "}
          <span className="font-bold text-teal-600">
            {activeCoins.data.total_volume.usd.toString().slice(0, 3)}T USD
          </span>
        </li>
        <li>
          Dominance:{" "}
          <span className="font-bold text-teal-600">
            BTC {Number(activeCoins.data.market_cap_percentage.btc).toFixed(2)}%{" "}
          </span>
          <span className="font-bold text-teal-600">
            ETH {Number(activeCoins.data.market_cap_percentage.eth).toFixed(2)}%
          </span>
        </li>
      </ul>

      <ul
        className={`w-full flex justify-end text-sm  lg:w-[370px] label-12 gap-5 items-center ${
          theme === "dark" ? " text-zinc-200" : " text-zinc-700"
        }`}
      >
        <li onClick={toggleTheme} className="cursor-pointer">
          {theme === "dark" ? (
            <BsSunFill className="text-yellow-500" size={24} />
          ) : (
            <BsMoonStarsFill className="text-blue-900" size={24} />
          )}
        </li>
        <li className="font-semibold ">
          <Link to="/">Home</Link>
        </li>
        {user ? (
          <>
            <li className="font-semibold ">{user.email}</li>
            
            {/* User avatar and dropdown menu toggle */}
            <li className="relative" ref={dropdownRef}>
    <img
      className="w-10 h-10 rounded-full cursor-pointer"
      src={user.photoURL}
      alt="User Avatar"
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
    />
    {isDropdownOpen && (
      <div className={`absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md  ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"} transition duration-150 ease-in-out z-50`}>
        <ul>
          <Link to='/account'>
          <li 
            className={`px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
            onClick={() => { /* Handle account click here */ setIsDropdownOpen(false); }}
          >
            Account
          </li>
          </Link>
          <li 
            className={`px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
            onClick={() => { handleSignOut(); setIsDropdownOpen(false); }}
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
              className={`w-[70px] p-1 flex justify-center border  rounded-lg bg-indigo-500 text-[#FAFAFA] font-semibold cursor-pointer${
                theme === "dark" ? " text-zinc-200" : " text-zinc-700"
              }`}
              onClick={openModal}
            >
              Login
            </li>
            <li className="font-semibold cursor-pointer"
            onClick={openSignUpModal}>
              Sign Up
            </li>
          </>
        )}
      </ul>
            {/* Conditionally render the Login modal */}
            {isLoginModalOpen && <Login closeModal={closeModal} />}
            {isSignUpModalOpen && <SignUp closeSignUpModal={closeSignUpModal} />}

      {/* Mobile Menu Side Drawer */}
      {/* ------------------------ */}

      <div
        className={`fixed inset-y-0 right-0 w-[500px] max-w-full bg-[#F8F9FA] shadow-xl transform border-l border-zinc-600  ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out lg:hidden z-50`}
      >
        {/* Menu Header */}
        <div
          className={`flex justify-between items-center p-2 border-b border-zinc-600 ${
            theme === "dark" ? "bg-gradient-to-r from-zinc-800  to-[#16171a] " : "bg-white text-gray-900"
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
            className={`p-2 border-b border-zinc-600 ${
              theme === "dark"
                ? "bg-gradient-to-r from-zinc-800  to-[#16171a] text-white"
                : "bg-white text-gray-900"
            }`}
          >
            <div className="flex items-center space-x-3">
            <img
      className="w-10 h-10 rounded-full cursor-pointer"
      src={user.photoURL}
      alt="User Avatar"
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
    />
              <div>
                <p className="text-sm font-semibold ">{user.email}</p>
                <button
                  onClick={handleSignOut}
                  className="text-xs font-medium text-red-500 mt-1"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div
          className={`overflow-y-auto ${
            theme === "dark"
              ? "bg-gradient-to-r from-zinc-800  to-[#16171a] text-white"
              : "bg-white text-gray-900"
          }`}
        >
          <ul className="p-4 space-y-4">
            {/* Adding Icons to the Links for better UX */}
            <li className="group flex items-center p-2 rounded-md hover:bg-gray-700 hover:text-zinc-100">
              <RiDashboardLine className="text-lg text-zinc-200 group-hover:text-gray-200 mr-2" />
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                Cryptocurrencies
              </Link>
            </li>
            <li className="group flex items-center p-2 rounded-md hover:bg-gray-700 hover:text-zinc-100">
              <RiExchangeDollarLine className="text-lg text-zinc-200   mr-2 " />
              <Link to="/exchanges" onClick={() => setIsMobileMenuOpen(false)}>
                Exchanges
              </Link>
            </li>
            <li className="group flex items-center p-2 rounded-md hover:bg-gray-700 hover:text-zinc-100">
              <PiMapTrifoldFill className="text-lg text-zinc-200  mr-2" />
              <Link to="/heatmap" onClick={() => setIsMobileMenuOpen(false)}>
                HeatMap
              </Link>
            </li>
            <li className="group flex items-center p-2 rounded-md hover:bg-gray-700 hover:text-zinc-100">
              <RiGalleryLine className="text-lg text-zinc-200  mr-2" />
              NFT
            </li>
            <li className="group flex items-center p-2 rounded-md hover:bg-gray-700 hover:text-zinc-100">
              <RiBookLine className="text-lg text-zinc-200  mr-2" />
              Learn
            </li>
            {/* Portfolio */}
            <li className="group flex items-center p-2 rounded-md hover:bg-gray-700 hover:text-zinc-100">
              <RiBriefcaseLine className="text-lg text-zinc-200   mr-2" />
              <Link to="/portfolio" onClick={() => setIsMobileMenuOpen(false)}>
                Portfolio
              </Link>
            </li>

            {/* Watchlist */}
            <li className="group flex items-center p-2 rounded-md hover:bg-gray-700 hover:text-zinc-100">
              <RiStarLine className="text-lg text-zinc-200  mr-2" />
              <Link to="/watchlist" onClick={() => setIsMobileMenuOpen(false)}>
                Watchlist
              </Link>
            </li>
            {/* Additional Features */}
            {/* Search Feature Placeholder */}
            <li>
              <div className="flex items-center bg-gray-200 rounded-md p-2">
                <RiSearchLine className="text-lg text-gray-500 mr-2" />
                <input
                  className="bg-transparent placeholder-gray-500 text-sm focus:outline-none"
                  type="search"
                  placeholder="Search..."
                  // Implement search functionality
                />
              </div>
            </li>
          </ul>
        </div>

        {/* Footer - Theme Switcher */}
        <div
          className={`  w-full h-[200px] flex flex-col justify-end p-4 border-t border-zinc-600 ${
            theme === "dark"
              ? "bg-gradient-to-r from-zinc-800  to-[#16171a] text-white"
              : "bg-[#FAFAFA] text-gray-900"
          }`}
        >
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-full p-2 rounded-md text-gray-800 bg-gray-100 hover:bg-gray-200"
          >
            {theme === "dark" ? (
              <RiSunLine className="text-xl mr-2" />
            ) : (
              <RiMoonLine className="text-xl mr-2" />
            )}
            Switch Theme
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
