import React, { useState, useEffect, useContext, useRef } from "react";
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import CryptoGlobalData from "../../API/CryptoGlobalData.json";
import ThemeContext from "../ThemeContext/ThemeContext";


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

  return (
    <div
      className={`hidden md:border-b px-3 lg:flex lg:justify-between  lg:px-[50px] p-1 w-full ${
        theme === "dark" ? "border-zinc-800  text-primary-300 " : "border-primary-100 "
      }`}
    >
      
      <ul className="flex text-xs gap-10 p-2 label-12  font-light text-zinc-500 items-center">
        <li>
          Coins:{" "}
          <span className="text-primary-400 label-12">
            {Number(activeCoins.data.active_cryptocurrencies).toLocaleString()}
          </span>
        </li>
        <li>
          Exchanges:{" "}
          <span className="text-primary-400 label-12">
            {activeCoins.data.markets}
          </span>
        </li>

        <li>
          Market Cap:{" "}
          <span className="text-primary-400 label-12">
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
          <span className="text-primary-400 label-12">
            {activeCoins.data.total_volume.usd.toString().slice(0, 3)}T USD
          </span>
        </li>
        <li>
          Dominance:{" "}
          <span className="text-primary-400 label-12">
            BTC {Number(activeCoins.data.market_cap_percentage.btc).toFixed(2)}%{" "}
          </span>
          {/* <span className="text-primary-500 label-12">
            ETH {Number(activeCoins.data.market_cap_percentage.eth).toFixed(2)}%
          </span> */}
        </li>
      </ul>
            {/* Light Mode/Dark Mode */}
      <ul
        className={`w-full flex justify-end text-sm  lg:w-[370px] label-12 gap-5 items-center pr-2 ${
          theme === "dark" ? " text-zinc-200" : " text-zinc-700"
        }`}
      >
        {/* <li onClick={toggleTheme} className="cursor-pointer">
          {theme === "dark" ? (
            <BsSunFill className="text-yellow-500" size={24} />
          ) : (
            <BsMoonStarsFill className="text-blue-900" size={24} />
          )}
        </li> */}
        
        
      </ul>
     
    </div>
  );
}

export default Header;
