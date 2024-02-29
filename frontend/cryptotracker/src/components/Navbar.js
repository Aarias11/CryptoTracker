import React, { useContext, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import ledgerlook from "../assets/ledgerlook.png";
import { GoStarFill } from "react-icons/go";
import { GiPieChart } from "react-icons/gi";
import { RxMagnifyingGlass } from "react-icons/rx";
import { IoTrendingUpSharp, IoTrendingDownSharp } from "react-icons/io5";

import { VscClose } from "react-icons/vsc";
import ThemeContext from "../components/ThemeContext";
import TrendingCoins from "../TrendingCoins.json";
import CryptoMarketCoins from "../CryptoMarketCoins.json";
import CryptoExchanges from "../CryptoExchanges.json";

function Navbar() {
  const [crypto, setCrypto] = useState(TrendingCoins);
  const [coins, setCoins] = useState(CryptoMarketCoins);
  const [exchanges, setExchanges] = useState(CryptoExchanges);
  const { theme, toggleTheme } = useContext(ThemeContext); // Using ThemeContext
  const [searchExpanded, setSearchExpanded] = useState(false); // State to manage the search component's visibility
  const searchComponentRef = useRef(null);
  const searchRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [combinedResults, setCombinedResults] = useState([]);

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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div
      className={`h-[70px] flex gap-10 p-3 border-b border-zinc-600 items-center relative text-sm ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      <img className="w-[55px] h-[55px] rounded-full" src={ledgerlook} />
      <ul
        className={`hidden md:flex sm:gap-4 h-auto md:w-auto md:gap-8 font-semibold  ${
          theme === "dark" ? " text-zinc-200" : " text-zinc-700"
        }`}
      >
        <li className="text-xs md:text-sm">
          <Link to="/">Cryptocurrencies</Link>
        </li>
        <li className="text-xs md:text-sm">
          <Link to="/exchanges">Exchanges</Link>
        </li>
        <li className="text-xs md:text-sm">
          <Link to="/heatmap">HeatMap</Link>
        </li>
        <li className="text-xs md:text-sm">
          <Link to="/community">Community</Link>
        </li>
        <li className="text-xs md:text-sm">Learn</li>
      </ul>
      <ul
        className={`flex justify-end gap-4 w-[470px] items-center font-light ${
          theme === "dark" ? " text-red-400" : " text-teal-600"
        }`}
      >
        <li className="hidden xl:flex ">Bitcoin Halving: 60 Days</li>
        <li className="hidden xl:flex  gap-2 items-center">
          <GoStarFill className="text-yellow-400" size={20} />
          <Link to="/watchlist">Watchlist</Link>
        </li>
        <li className="hidden xl:flex  gap-2 items-center">
          <GiPieChart className="text-slate-400" size={20} />
          <Link to="/portfolio">Portfolio</Link>
        </li>
      </ul>

      {/* SearchBar */}
      <div className="w-[2000px] md:w-[330px] flex ">
        <button
          className={`w-full md:w-full h-[40px] rounded-xl px-3 bg-slate-300 focus:outline-none relative hover:cursor-pointer ${
            theme === "dark"
              ? "bg-slate-700 text-zinc-200"
              : "bg-zinc-200 text-gray-600"
          }`}
          onClick={() => setSearchExpanded(true)}
        >
          <div className="p-2 pt-2 font-semibold text-zinc-500">Search</div>

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
            } border ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
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
                    ? "bg-gray-700 text-zinc-200"
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
    </div>
  );
}

export default Navbar;
