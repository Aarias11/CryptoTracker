import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import TradingViewMarketWidget from "../components/TradingViewMarketWidget";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { Link } from "react-router-dom";
import CryptoMarketCoins from "../CryptoMarketCoins.json";
import { MdOutlineStarBorder, MdOutlineStar } from "react-icons/md";
import { RxMagnifyingGlass } from "react-icons/rx";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";
import { db } from "../firebase"; // Ensure this points to your Firebase config file
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import ThemeContext from "../components/ThemeContext";
import TradingViewTicker from "../components/TradingViewTicker";
import useScrollToTop from "../components/useScrollToTop";


function Home() {
  const [cryptos, setCryptos] = useState(CryptoMarketCoins); //use [] when dealing with API
  const [coins, setCoins] = useState("");
  const [favorites, setFavorites] = useState({}); // Tracks favorites by ID
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, SetIsModalOpen] = useState(false);
  const { theme } = useContext(ThemeContext); // Using ThemeContext
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [shouldBlink, setShouldBlink] = useState(false);
  const auth = getAuth();




  // Fetchig Crypto API Data
  // // Coin Gecko API

  // useEffect(() => {
  //     axios
  //     .get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=200&page=1&sparkline=true&locale=en')
  //     .then((res) => {
  //         setCryptos(res.data)

  //     })
  // }, [])

  


  // Fetching User's Favorited Cryptos
  useEffect(() => {
    const fetchFavorites = async () => {
      const user = auth.currentUser;
      if (user) {
        const querySnapshot = await getDocs(
          collection(db, "users", user.uid, "favorites")
        );
        const newFavorites = {};
        querySnapshot.forEach((doc) => {
          newFavorites[doc.id] = true; // Use doc.id to mark as favorited
        });
        setFavorites(newFavorites);
      }
    };

    // Fetch favorites on mount and auth state change
    fetchFavorites();

    const unsubscribe = auth.onAuthStateChanged(fetchFavorites);
    return unsubscribe; // Cleanup subscription
  }, [auth]);

  
  // -----------------

  // Toggle favorite State for a Crypto
  const toggleFavorite = async (crypto) => {
    const user = auth.currentUser;
    if (!user || !crypto.id) return; // Ensure there is a logged-in user and crypto.id is defined

    try {
      const favoritesRef = doc(db, "users", user.uid, "favorites", crypto.id);

      if (favorites[crypto.id]) {
        // If already favorited, remove from Firestore
        await deleteDoc(favoritesRef);
        setFavorites((prevFavorites) => {
          const updatedFavorites = { ...prevFavorites };
          delete updatedFavorites[crypto.id]; // Remove the crypto from the favorites
          return updatedFavorites;
        });
      } else {
        // If not favorited, add to Firestore
        await setDoc(favoritesRef, {
          id: crypto.id,
          rank: crypto.market_cap_rank,
          image: crypto.image,
          name: crypto.name,
          symbol: crypto.symbol,
          price: crypto.current_price,
          low24h: crypto.low_24h,
          high24h: crypto.high_24h,
          change24h: crypto.price_change_percentage_24h,
          marketCap: crypto.market_cap,
          volume: crypto.total_volume,
          supply: crypto.circulating_supply,
          totalSupply: crypto.total_supply,
          weekly: crypto.sparkline_in_7d.price,
        });
        setFavorites((prevFavorites) => ({
          ...prevFavorites,
          [crypto.id]: true, // Mark the crypto as favorited
        }));
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // Handle the error appropriately
    }
  };
  // -----------------

  // Function to Handle Search Query Changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Assuming `cryptos` is your state variable holding the array of cryptocurrency data
  // and `searchQuery` is used for filtering that list.
  const filteredCryptos = cryptos.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate the Total Number of Pages
  const totalPages = Math.ceil(filteredCryptos.length / itemsPerPage);

  // Calculate the Current Items to Display on the Page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCryptos.slice(indexOfFirstItem, indexOfLastItem);

  // Handler functions for pagination controls
  const handlePrevious = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    setCurrentPage(currentPage + 1);
  };

  // Conditional styles based on theme
  const tableTheme =
    theme === "dark"
      ? "label-12"
      : "label-12";
  const headerBgTheme =
    theme === "dark"
      ? "label-12"
      : "label-12";
  const bodyBgTheme =
    theme === "dark" ? "label-12" : "label-12";

  // OPEN MODAL
  const openModal = () => {
    SetIsModalOpen(true);
  };

  // Scroll to Top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setShouldBlink(true); // Start the blink
      setTimeout(() => setShouldBlink(false), 500); // Stop the blink after 0.5s to ensure it blinks once
    }, 15000); // 15 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  // Apply the blink class conditionally
  const blinkClass = shouldBlink ? 'blink' : '';

  return (
    <div
      className={`w-full h-auto   ${
        theme === "dark" ? " " : " "
      }`}
    >
      <div
        className={`w-full h-[565px] py-35 flex justify-center items-center   ${
          theme === "dark"
          ? "bg-gradient-to-r from-[#07172b]  to-[#031021] "
          : ""
        }`}
      >
        
        <div className="max-w-6xl mx-auto">
          <h2 className="headline-semibold-48 p-5 text-center">
            Cryptocurrencies By Highest MarketCap
          </h2>
          <p className="body-14 leading-relaxed mx-auto text-center mb-4 max-w-4xl px-3">
            The current Market Cap for all currencies stands at
            <span className="text-teal-400 ml-2 px-3">949T</span>, marking a pivotal
            moment in the financial landscape.
          </p>
          <p className="body-14 leading-relaxed mx-auto text-center mb-4 max-w-4xl px-3">
            It reflects not just investor interest, but the innovation and
            utility brought by platforms and tokens to the digital economy. The
            sector's evolution, from Bitcoin and Ethereum to DeFi and NFTs, is
            rapid and vibrant.
          </p>
          <p className="body-14 leading-relaxed mx-auto text-center mb-8 max-w-4xl px-3">
            Engage with market trends, delve into the analytics, and explore the
            digital economy on our platform. Your journey into investment and
            participation starts here.
          </p>
          <div className="text-center">
            <a
              href="/explore"
              className="bg-teal-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-teal-400 transition duration-300 ease-in-out"
            >
              Start Exploring
            </a>
          </div>
        </div>
      </div>

      <div className={`App ${
      theme === "dark" ? "" : ""
    }`} >
      <div>
       
      <TradingViewTicker key={theme} />

      
      
      </div>
        <div className="h-[400px] lg:px-[45px]">
        <TradingViewMarketWidget />
        </div>
      </div>
      {/* Searchbar */}
      {/* ----------------------- */}
      <div className="p-3 lg:px-[50px]">
        <div className=" w-full h-[50px] relative">
          <input
            className={`w-[300px] h-full border border-primary-200 rounded-xl font-semibold focus:outline-none text-sm p-3 relative px-[40px] ${
              theme === "dark"
                ? "bg-[#031021] text-primary-200"
                : ""
            }`}
            type="search"
            placeholder="Search Crypto"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <RxMagnifyingGlass
            size={20}
            className={`absolute top-4  text-slate-200 left-2 ${
              theme === "dark" ? "text-zinc-200" : " text-slate-800"
            }`}
          />
        </div>
      </div>
      {/* CRYPTO TABLE CONTAINER*/}
      {/* ----------------------- */}

      <div
        className={`w-[100%] h-full flex flex-col justify-center overflow-x-scroll  lg:px-[50px] ${
          theme === "dark" ? " " : " "
        }`}
      >
        {/* CRYPTO TABLE */}
        {/* ----------------------- */}
        <table className={`min-w-full divide-y  px-[65px] ${tableTheme} `}>
          {/* TABLE HEAD */}
          {/* ----------------------- */}

          <thead className={`${headerBgTheme}`}>
            <tr className="">
              {/* RANK */}
              <th className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider sticky left-0 z-40 ${theme === "dark" ? " bg-[#07172b]" : " bg-zinc-300"}`}>
                # Rank
              </th>
              {/* NAME */}
              <th className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider sticky left-[99px] z-40  ${theme === "dark" ? " bg-[#07172b]" : " bg-zinc-300"}`}>
                Name
              </th>

              {/* Price */}
              <th class="px-5 py-3 bg- text-left text-xs font-semibold  uppercase tracking-wider headerBgTheme">
                Price
              </th>
              {/* Low 24H */}
              <th class="px-5 py-3 bg- text-left text-xs font-semibold  uppercase tracking-wider headerBgTheme">
                Low 24H
              </th>
              {/* High 24H */}
              <th class="px-5 py-3 bg- text-left text-xs font-semibold  uppercase tracking-wider headerBgTheme">
                High 24H
              </th>
              {/* 24H % */}
              <th class="px-5 py-3 bg- text-left text-xs font-semibold  uppercase tracking-wider headerBgTheme">
                24H %
              </th>
              {/* Market Cap */}
              <th class="px-5 py-3 bg- text-left text-xs font-semibold  uppercase tracking-wider headerBgTheme">
                Market Cap
              </th>
              {/* Volume */}
              {/* <th class="px-5 py-3 bg- text-left text-xs font-semibold  uppercase tracking-wider headerBgTheme">
                Volume
              </th> */}
              {/* Circulating Supp */}
              <th class="px-5 py-3 bg- text-left text-xs font-semibold  uppercase tracking-wider headerBgTheme">
                Circulating Supply
              </th>
              {/* 7 Day */}
              <th class="px-5 py-3 bg- text-left text-xs font-semibold  uppercase tracking-wider headerBgTheme">
                7 Day
              </th>
            </tr>
          </thead>
          {/* TABLE BODY */}
          {/* ----------------------- */}

          <tbody className={`divide-y divide-zinc-600 bodyBgTheme`}>
            {currentItems.map((crypto, index) => (
              <tr key={crypto.id}>
                {/* RANK */}
                <td class={`px-5 py-3 h-[85px]  text-xs font-semibold items-center flex gap-4 tracking-wider sticky left-0  ${theme === "dark" ? " bg-[#07172b]" : " "}`}>
                  <button className="  ">
                    {favorites[crypto.id] ? (
                      <MdOutlineStar
                        className="cursor-pointer text-yellow-400  transition-colors duration-150"
                        size={20}
                        onClick={() => toggleFavorite(crypto)}
                      />
                    ) : (
                      <MdOutlineStarBorder
                        className="cursor-pointer text-zinc-600-400 transition-colors duration-150"
                        size={20}
                        onClick={() => toggleFavorite(crypto)}
                      />
                    )}
                  </button>
                  <span className="text-xl">{crypto.market_cap_rank}</span>
                </td>
                {/* IMAGE, NAME, SYMBOL */}
                <td class={`px-5 py-3   text-left text-xs font-semibold  uppercase tracking-wider bodyBgTheme sticky left-[99px]  ${theme === "dark" ? " bg-[#07172b]" : " bg-white"}`}>
                  <Link to={`/cryptopage/${crypto.symbol}`}>
                    <div className="flex items-center gap-3">
                      <img
                        className="w-8 h-8 rounded-full"
                        src={crypto.image || "path/to/fallback/image.png"}
                        alt=""
                      />
                      {crypto.name}{" "}
                      <span className="font-light">
                        ({crypto.symbol.toUpperCase()})
                      </span>
                    </div>
                  </Link>
                </td>
                {/* CURRENT PRICE */}
                <td class={`px-5 py-3   text-left text-xs font-semibold  uppercase tracking-wider bodyBgTheme ${blinkClass}`}>
                  $
                  {Number(crypto.current_price) >= 1
                    ? Number(crypto.current_price)
                        .toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : Number(crypto.current_price).toFixed(4)}
                </td>

                {/* LOW 24H */}
                <td class="px-5 py-3  text-left text-xs font-semibold  uppercase tracking-wider bodyBgTheme">
                  ${Number(crypto.low_24h).toLocaleString()}
                </td>
                {/* HIGH 24H */}
                <td class="px-5 py-3  text-left text-xs font-semibold uppercase tracking-wider bodyBgTheme">
                  ${Number(crypto.high_24h).toLocaleString()}
                </td>
                {/* 24H % */}
                <td class={`px-5 py-3   text-left text-xs font-semibold uppercase tracking-wider bodyBgTheme ${blinkClass}`}>
                  <span
                    className={
                      crypto.price_change_percentage_24h > 0
                        ? "text-green-500 flex items-center"
                        : crypto.price_change_percentage_24h < 0
                        ? "text-red-500 flex items-center"
                        : "text-black flex items-center"
                    }
                  >
                    {crypto.price_change_percentage_24h > 0 ? (
                      <FaCaretUp className="mr-1" />
                    ) : crypto.price_change_percentage_24h < 0 ? (
                      <FaCaretDown className="mr-1" />
                    ) : null}
                    {crypto.price_change_percentage_24h.toFixed(2)}%
                  </span>
                </td>
                {/* MARKET CAP */}
                <td class="px-5 py-3  bg- text-left text-xs font-semibold  uppercase tracking-wider bodyBgTheme">
                  ${crypto.market_cap.toLocaleString()}
                </td>
                {/* VOLUME */}
                {/* <td class="px-5 py-3   text-left text-xs font-semibold  uppercase tracking-wider bodyBgTheme">
                  {crypto.total_volume.toLocaleString()}
                </td> */}
                {/* CIRCULATING SUPPLY */}
                <td class="px-5 py-3  text-left text-xs font-semibold  uppercase tracking-wider pt-7 bodyBgTheme">
                  <div className=" items-center space-x-2">
                    <div className="w-full bg-gray-200 rounded-full  h-2 ">
                      <div
                        className="bg-blue-600 p-1 h-2 rounded-full "
                        style={{
                          width: `${
                            (crypto.circulating_supply / crypto.total_supply) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs font-semibold w-full">
                      {Number(crypto.circulating_supply).toLocaleString()}
                    </span>
                  </div>
                </td>

                {/* 7 DAY MINI CHART */}
                <td class="px-5 py-3  text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ">
                  <Sparklines
                    data={crypto.sparkline_in_7d.price}
                    svgWidth={160}
                    svgHeight={50}
                  >
                    <SparklinesLine color="teal" />
                  </Sparklines>
                </td>
              </tr>
            ))}

            {/* <!-- Add more rows as needed --> */}
          </tbody>
        </table>
        {/* Pagination Controls */}
        <div className="pagination-controls flex justify-center mt-4">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="px-4 py-2 mx-1 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 mx-1 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;