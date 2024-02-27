import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { MdOutlineStarBorder, MdOutlineStar } from "react-icons/md";
import {
  FaGithub,
  FaRedditAlien,
  FaThumbsUp,
  FaThumbsDown,
} from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import TradingViewChart from "../components/TradingViewChart";
import TradingViewNews from "../components/TradingViewNews";
import TradingViewTechnicalAnalysis from "../components/TradingViewTechnicalAnalysis";
import CryptoApi from "../CryptoApi.json";
import ThemeContext from "../components/ThemeContext";
import Skeleton from "@mui/material/Skeleton";

function CryptoPage() {
  const [crypto, setCrypto] = useState(CryptoApi);
  const { symbol } = useParams(); // Get the symbol from the URL
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFullDescriptionShown, setIsFullDescriptionShown] = useState(false);

  const { theme, toggleTheme } = useContext(ThemeContext); // Using ThemeContext
  // useEffect(() => {
  //   // First, get the full list of coins to find the ID that matches the symbol
  //   axios
  //     .get(`https://api.coingecko.com/api/v3/coins/list`)
  //     .then((res) => {
  //       const coin = res.data.find(
  //         (coin) => coin.symbol.toLowerCase() === symbol.toLowerCase()
  //       );
  //       if (!coin) {
  //         throw new Error(`Coin with symbol ${symbol} not found.`);
  //       }
  //       return coin.id;
  //     })
  //     // Then, use the ID to fetch the detailed information
  //     .then((coinId) => {
  //       return axios.get(
  //         `https://api.coingecko.com/api/v3/coins/${coinId}?tickers=true&market_data=true&community_data=true&sparkline=true`
  //       );
  //       // );
  //     })
  //     .then((res) => {
  //       setCrypto(res.data);
  //       console.log(res.data);
  //     })
  //     .catch((err) => {
  //       console.error(err.message);
  //       setCrypto(null); // Handle error (e.g., symbol not found)
  //     });
  // }, [symbol]); // This effect depends on the `symbol`

  if (!crypto) return <div>Loading...</div>; // or handle loading/error state appropriately

  // Toggle function
  const toggleDescriptionView = () => {
    setIsFullDescriptionShown(!isFullDescriptionShown);
  };

  // Your useEffect hook for fetching crypto data

  if (!crypto) return <div>Loading...</div>;

  // Toggle function
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite); // Toggle the state
  };

  console.log(crypto.sentiment_votes_up_percentage);

  return (
    <div
      className={`w-full h-screen bg-[#FAFAFA]  ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Container */}
      <div className="w-full h-screen grid grid-row-3 md:flex">
        {/* Left Side */}
        {/* Enhanced Left Side Component */}
        <div
          className={`flex flex-col w-full md:w-[450px] h-screen overflow-y-scroll sticky top-0 bg-white dark:bg-gray-900 transition-colors duration-300 shadow-lg`}
        >
          {/* Header with Dynamic Crypto Data and Favorite Toggle */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-800  to-gray-900 dark:from-gray-800 dark:to-teal-900 text-white ">
            <div className="flex items-center space-x-4">
              <img
                src={crypto.image?.large}
                alt={crypto.name}
                className="w-16 h-16 rounded-full border-2 border-white"
              />
              <div>
                <h1 className="text-xl font-bold">{crypto.name}</h1>
                <p className="text-sm opacity-80">
                  {crypto.symbol?.toUpperCase()}
                </p>
              </div>
            </div>
            <button
              onClick={toggleFavorite}
              className={`transition duration-300 ease-in-out p-2 rounded-full ${
                isFavorite
                  ? "text-yellow-400"
                  : "text-white hover:text-yellow-400"
              }`}
            >
              {isFavorite ? (
                <MdOutlineStar size={28} />
              ) : (
                <MdOutlineStarBorder size={28} />
              )}
            </button>
          </div>

          {/* Crypto Stats: Price, Market Cap, and Volume */}
          <div className="p-4 h-[300px] bg-white dark:bg-gray-800 mt-4 rounded-lg shadow">
            <h2 className="text-xl font-bold">Stats</h2>
            <div className="flex flex-wrap gap-4 text-center">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Current Price
                </p>
                <p className="text-lg font-semibold">
                  ${crypto.market_data?.current_price?.usd.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Market Cap
                </p>
                <p className="text-lg font-semibold">
                  ${crypto.market_data?.market_cap?.usd.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  24h Volume
                </p>
                <p className="text-lg font-semibold">
                  ${crypto.market_data?.total_volume?.usd.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Price Chart Placeholder */}
          <div className="p-4 mt-4  bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Price Chart
            </h3>
            {/* Placeholder for a dynamic price chart component */}
            <div className="h-[500px] bg-gray-200 dark:bg-gray-700 rounded-md mt-2 flex items-center justify-center">
              <TradingViewTechnicalAnalysis />
            </div>
          </div>

          {/* Quick Insights */}
          <div className="p-4 mt-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Quick Insights
            </h3>
            <ul className="mt-2 space-y-2">
              {/* Dynamic list of insights about the cryptocurrency */}
              <li className="text-sm text-gray-600 dark:text-gray-300">
                Insight #1
              </li>
              <li className="text-sm text-gray-600 dark:text-gray-300">
                Insight #2
              </li>
              <li className="text-sm text-gray-600 dark:text-gray-300">
                More insights...
              </li>
            </ul>
          </div>

          {/* Social Media and Official Links */}
          <div className="p-4 mt-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Connect
            </h3>
            <div className="flex flex-wrap gap-4 mt-2 justify-center">
              {/* Conditional rendering for available social media links */}
              <a
                href={crypto.links?.twitter}
                className="text-blue-500 hover:underline"
              >
                Twitter
              </a>
              <a
                href={crypto.links?.reddit}
                className="text-orange-500 hover:underline"
              >
                Reddit
              </a>
              {/* Add more social media and official links */}
            </div>
          </div>

          {/* More sections can be added here */}
        </div>

        {/* Middle - Chart */}
        <div className="w-full h-screen overflow-y-scroll flex-grow">
          <div className="w-full h-[500px] ">
            <TradingViewChart cryptoId={symbol} />
            {/* Bottom */}
            <div className="w-full py-4 bg-gradient-to-r from-gray-800  to-gray-900 dark:from-gray-800 dark:to-teal-900 text-white shadow-lg rounded-lg overflow-hidden">
    <div className="px-4 md:px-6 lg:px-8">
        {/* Market Overview */}
        <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Market Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Market Cap</p>
                    <p className="text-xl font-semibold">$1.5T</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">24h Trading Volume</p>
                    <p className="text-xl font-semibold">$200B</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Bitcoin Dominance</p>
                    <p className="text-xl font-semibold">45%</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Ethereum Dominance</p>
                    <p className="text-xl font-semibold">18%</p>
                </div>
            </div>
        </div>

        {/* Latest News Section as previously designed */}
        <h2 className="text-2xl font-bold mb-4">Latest News</h2>
        <div className="w-full h-[400px] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-inner p-4">
            <TradingViewNews />
        </div>

        {/* Additional Functionalities */}
        <div className="mt-8">
            <h2 className="text-3xl font-bold mb-2">Trending Coins</h2>
            <div className="flex overflow-x-auto gap-4 p-2">
                {/* Placeholder for trending coins. Each coin could be a component */}
                <div className="min-w-[160px] bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <p className="text-sm font-semibold">Bitcoin</p>
                    <p className="text-lg">$60,000</p>
                </div>
                <div className="min-w-[160px] bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <p className="text-sm font-semibold">Ethereum</p>
                    <p className="text-lg">$4,000</p>
                </div>
                {/* More coins */}
            </div>
        </div>

        {/* Footer with additional links for navigation */}
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">© 2024 CryptoDashboard</p>
                <div className="flex gap-4">
                    <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:underline">Privacy Policy</a>
                    <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:underline">Terms of Service</a>
                </div>
            </div>
        </div>
    </div>
</div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default CryptoPage;
