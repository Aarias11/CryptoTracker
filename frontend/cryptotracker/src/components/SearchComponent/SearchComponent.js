import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RxMagnifyingGlass } from "react-icons/rx";
import { VscClose } from "react-icons/vsc";
import { IoTrendingUpSharp, IoTrendingDownSharp } from "react-icons/io5";
import CryptoMarketCoins from "../../API/CryptoMarketCoins.json"; // Adjust the import path as needed
import TrendingCoins from "../../API/TrendingCoins.json";
import CryptoExchanges from "../../API/CryptoExchanges.json";

function SearchComponent({ theme }) {
  const [crypto, setCrypto] = useState(TrendingCoins);
  const [exchanges, setExchanges] = useState(CryptoExchanges);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchExpanded, setSearchExpanded] = useState(false);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClose = () => {
    setSearchExpanded(false);
  };

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
          return { ...coin, ...marketData };
        });
        setSearchResults(searchResultsWithMarketData);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  return (
    <div className="w-[40px] flex ">
      <button
        className={`w-full md:w-full h-[40px] rounded-xl px-3 focus:outline-none relative hover:cursor-pointer hidden md:flex ${
          theme === "dark" ? "" : ""
        }`}
        onClick={() => setSearchExpanded(true)}
      >
        <div className="p-2 pt-2 font-semibold text-zinc-500 "></div>

        <RxMagnifyingGlass
          size={20}
          className="absolute top-2  left-2 text-primary-300 "
        />
      </button>

      {/* Search Box Component */}
      {searchExpanded && (
        <div
          className={`absolute top-1 right-5 mt-2 p-4 md:w-[700px] md:h-auto rounded-lg shadow-lg z-50 ${
            theme === "dark"
              ? "bg-gradient-to-r from-[#07172b] border border-primary-200  to-[#031021] "
              : ""
          }  ${theme === "dark" ? "bg-[#16171a]" : "bg-[#F5F9FE]"}`}
        >
          <input
            className={`search-input w-full p-2 px-10 rounded-lg focus:outline-none text-zinc-500 font-semibold ${
              theme === "dark"
                ? "bg-gradient-to-r from-[#07172b] border border-primary-200  to-[#031021] "
                : ""
            }`}
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
              <h2 className="label-bold-12 pt-3 pb-3">Trending Coins</h2>
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
                <h2 className="label-bold-12 pt-3 pb-3">Exchanges</h2>
                {/* Mapping Through Exchanges */}
                <div className="w-full h-full flex flex-wrap gap-4">
                  {exchanges.slice(0, 25).map((exchange, id) => (
                    <div
                      className={`flex gap-3 ${
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
  );
}

export default SearchComponent;
