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
import { IconAward } from "@tabler/icons-react";
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
import { RxMagnifyingGlass } from "react-icons/rx";
import { IoTrendingUpSharp, IoTrendingDownSharp } from "react-icons/io5";
import { VscClose } from "react-icons/vsc";
import CryptoExchanges from "../CryptoExchanges.json";
import CryptoMarketCoins from "../CryptoMarketCoins.json";
import btclogos from "../assets/btclogos.png"
import { PiCurrencyBtcFill } from "react-icons/pi";


function Auth() {
    const [activeCoins, setActiveCoins] = useState(CryptoGlobalData);
  const [marketCap24h, setMarketCap24H] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false); // State to manage the search component's visibility
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const dropdownRef = useRef(null);
  const [exchanges, setExchanges] = useState(CryptoExchanges);
  const searchRef = useRef(null);
  const searchComponentRef = useRef(null);


  const nav = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext); // Using ThemeContext

  // Additional state
  const [user, setUser] = useState(null); // To store the user's information

  const auth = getAuth();


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
    setIsSignUpModalOpen(true);
  };

  // Close Login Modal
  const closeModal = () => {
    setIsLoginModalOpen(false);
    // Correctly use setIsLoginModalOpen to manage the modal state
  };

  const closeSignUpModal = () => {
    setIsSignUpModalOpen(false);
  };

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


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Close the search component when clicking on the close icon
  const handleClose = () => {
    setSearchExpanded(false);
  };

   // Handle outside clicks
   useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchExpanded(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchComponentRef]);

  // Fetch search results and combine with local market data
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/search?query=${searchQuery}`
        );
        const data = await response.json();
        const searchResultsWithMarketData = data.coins.map((coin) => {
          const marketData = CryptoMarketCoins.find(
            (marketCoin) => marketCoin.id === coin.id
          );
          return {
            ...coin,
            current_price: marketData?.current_price,
            price_change_percentage_24h:
              marketData?.price_change_percentage_24h,
          };
        });
        setSearchResults(searchResultsWithMarketData);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);



  return (
    <div
      className={`flex justify-between items-center ${
        theme === "dark" ? " " : " "
      }`}
    >
      

      <ul
        className={`w-full flex justify-end text-sm  lg:w-[370px] label-12 gap-5 items-center ${
          theme === "dark" ? " text-zinc-200" : " text-zinc-700"
        }`}
      >
        <ul
        className={`flex justify-end gap-4 w-[210px]  items-center  text-[12px] ${
          theme === "dark" ? " text-red-400" : " text-teal-600"
        }`}
      >
        <li className="hidden xl:flex items-center gap-2 "><PiCurrencyBtcFill className="text-yellow-500" size={20} />
 <span className="w-[100px]">Halving: 60 Days</span></li>
        <li className="hidden xl:flex  gap-2 items-center">
          <GoStarFill className="text-yellow-400" size={20} />
          <Link to="/watchlist"><span className="text-primary-400">Watchlist</span></Link>
        </li>
        <li className="hidden xl:flex  gap-2 items-center">
          <GiPieChart className="text-slate-400" size={20} />
          <Link to="/portfolio"><span className="text-primary-400">Portfolio</span></Link>
        </li>
      {/* SearchBar */}
      <div className="w-[40px] flex ">
        <button
          className={`w-full md:w-full h-[40px] rounded-xl px-3 focus:outline-none relative hover:cursor-pointer ${
            theme === "dark"
              ? "bg-zinc-700 text-zinc-200 border border-neutral-700"
              : "bg-zinc-200 text-gray-600"
          }`}
          onClick={() => setSearchExpanded(true)}
        >
          <div className="p-2 pt-2 font-semibold text-zinc-500"></div>

          <RxMagnifyingGlass
            size={20}
            className="absolute top-2  left-2 text-zinc-500"
          />
        </button>

        {/* Search Box Component */}
        {searchExpanded && (
          <div
            className={`absolute top-1 right-5 mt-2 p-4 md:w-[700px] md:h-[425px] rounded-lg shadow-lg ${
              theme === "dark"
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-800"
            }  ${
              theme === "dark" ? "bg-[#16171a]" : ""
            }`}
          >
            <input
              className="search-input w-full p-2 px-10 rounded-lg focus:outline-none text-zinc-500 font-semibold"
              type="search"
              placeholder="Search coin, pair, NFT, contract address, or exchange"
              value={searchQuery}
              onChange={handleSearchChange}
              // autoFocus
            />
            <RxMagnifyingGlass
              size={20}
              className="absolute top-6 left-6 text-zinc-500"
            />
            <VscClose
              size={20}
              className="absolute top-6 right-6 text-zinc-500 hover:cursor-pointer"
              onClick={handleClose}
            />

            {/* Conditionally Render Search Results or Default Content */}
            {searchQuery.trim().length > 0 ? (
              <div
                className={`search-results overflow-auto max-h-[340px] shadow-lg rounded-lg  ${
                  theme === "dark"
                    ? "bg-[#16171a] text-zinc-200"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {searchResults.slice(0, 5).map((coin, index) => (
                  <Link
                    to={`/cryptopage/${coin.symbol.toLowerCase()}`}
                    key={index}
                    className="block hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-300 ease-in-out rounded-md"
                  >
                    <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:text-white ">
                      <div className="flex items-center space-x-3">
                        <img
                          src={coin.thumb}
                          alt={coin.name}
                          className="w-7 h-7 rounded-full shadow"
                        />
                        <div className="hover:text-white">
                          <span className="text-md font-semibold hover:text-white">
                            {coin.name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                            ({coin.symbol.toUpperCase()})
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 hover:text-white">
                        <span className="text-md font-semibold hover:text-white ">
                          ${Number(coin.current_price).toLocaleString()}
                        </span>
                        <div
                          className={`flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                            coin.price_change_percentage_24h > 0
                              ? "bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200"
                              : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
                          }`}
                        >
                          {Number(coin.price_change_percentage_24h).toFixed(2)}%
                          {coin.price_change_percentage_24h > 0 ? (
                            <IoTrendingUpSharp className="ml-1" />
                          ) : (
                            <IoTrendingDownSharp className="ml-1" />
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                {searchResults.length > 5 && (
                  <div className="text-center py-3">
                    <button
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold py-2 px-4 rounded-lg transition duration-150 ease-in-out"
                      onClick={() => {
                        /* Implement show all results functionality */
                      }}
                    >
                      See all results ({searchResults.length})
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Trending Coins Container
              <div className="default-content">
                {/* Trending Coins Header */}
                <h2 className="pt-1 pb-1 text-zinc-500 font-semibold">
                  Trending Coins
                </h2>
                {/* Trending Coins */}
                <div className="w-full h-auto grid grid-cols-3 gap-1 border-b pb-2">
                  {crypto.coins &&
                    crypto.coins.map((coin, id) => (
                      <div key={id} className="flex gap-3">
                        <div
                          className={`w-auto h-auto flex border border-teal-500 rounded-full gap-2 items-center px-2 p-1 ${
                            theme === "dark" ? "text-zinc-300 " : ""
                          }`}
                        >
                          <img
                            className="w-5 h-5 rounded-full"
                            src={coin.item.small}
                          />
                          <h2 className="text-xs  font-semibold">
                            {coin.item.name}
                          </h2>
                          <h2 className="hidden sm:flex text-xs ">
                            ({coin.item.symbol})
                          </h2>
                          <p className="hidden sm:flex text-xs ">
                            #{coin.item.market_cap_rank}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
                {/* Exchanges */}
                <div className="w-full h-full">
                  <h2 className="pt-1 pb-1 text-zinc-500 font-semibold">
                    Exchanges
                  </h2>
                  {/* Mapping Through Exchanges */}
                  <div className="w-full h-full flex flex-wrap gap-4">
                    {exchanges.slice(0, 25).map((exchange, id) => (
                      <div
                        className={`flex gap-2 ${
                          theme === "dark"
                            ? "text-zinc-300"
                            : "bg-white text-gray-800"
                        }`}
                      >
                        <img
                          className="w-5 h-5 rounded-full "
                          src={exchange.image}
                        />
                        <h2 className=" font-semibold">{exchange.name}</h2>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      </ul>
        {user ? (
          <>
            <li className="font-semibold ">{user.email}</li>

            {/* User avatar and dropdown menu toggle */}
            <li className="relative" ref={dropdownRef}>
              <img
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
                        onClick={() => {
                          /* Handle account click here */ setIsDropdownOpen(
                            false
                          );
                        }}
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
              className={`w-[70px] p-1  justify-center border  rounded-lg bg-indigo-500 text-[#FAFAFA] font-semibold cursor-pointer hidden xl:flex ${
                theme === "dark" ? " text-zinc-200" : " text-zinc-700"
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
      <div className="xl:hidden">
        <RxHamburgerMenu
          size={25}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
      </div>
      </ul>

      {/* Conditionally render the Login modal */}
      {isLoginModalOpen && <Login closeModal={closeModal} />}
      {isSignUpModalOpen && <SignUp closeSignUpModal={closeSignUpModal} />}
      

      <div
        className={`fixed inset-y-0 right-0 w-[50%] h-screen  bg-[#F8F9FA] shadow-xl transform border-l border-zinc-600  ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out lg:hidden z-50`}
      >
        {/* Menu Header */}
        <div
          className={`flex justify-between items-center h- p-2 border-b border-zinc-600 ${
            theme === "dark"
              ? "bg-gradient-to-r from-zinc-800  to-[#16171a] "
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
            className={`p-2 border-b border-zinc-600  ${
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
                <p className="text-sm font-semibold label-semibold-14 ">{user.email}</p>
                <button
                  onClick={handleSignOut}
                  className="text-xs font-medium text-red-500 mt-1 label-semibold-14"
                >
                  Sign Out
                </button>
              </div>
              {/* Footer - Theme Switcher */}
        
          <div className="w-full flex justify-end translate-x-1.5">
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-auto p-2 rounded-md text-gray-800"
          >
            {theme === "dark" ? (
              <RiSunLine size={25} className="text-orange-500 text-xl mr-2" />
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

        
      </div>
    </div>
  )
}

export default Auth