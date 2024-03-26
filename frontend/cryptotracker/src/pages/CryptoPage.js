import axios from "axios";
import { Link } from 'react-router-dom'
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
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  getDoc,
  query,
  where,
  doc, // Make sure to include this import
} from "firebase/firestore";
import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import useScrollToTop from "../components/useScrollToTop";
// import GiphySearch from './GiphySearch';

function CryptoPage({ user, currentCrypto }) {
  const [crypto, setCrypto] = useState(CryptoApi);
  const { symbol } = useParams(); // Get the symbol from the URL
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFullDescriptionShown, setIsFullDescriptionShown] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [selectedGif, setSelectedGif] = useState(null);
  const [gifs, setGifs] = useState([]);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { userId } = useParams(); // Extract userId from URL
  const [userProfile, setUserProfile] = useState(null);

  const auth = getAuth();

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

  // Function to fetch comments and user data
  useEffect(() => {
    const fetchCommentsAndUsers = async () => {
      if (!symbol) return;
      setLoading(true);
      try {
        const commentsRef = collection(db, "comments");
        const q = query(commentsRef, where("crypto", "==", symbol));
        const querySnapshot = await getDocs(q);
        const commentsWithUserData = await Promise.all(
          querySnapshot.docs.map(async (documentSnapshot) => {
            const commentData = documentSnapshot.data();
            const userRef = doc(db, "users", commentData.uid);
            const userSnapshot = await getDoc(userRef);
            const userData = userSnapshot.data();
            return {
              id: documentSnapshot.id,
              ...commentData,
              userName: userData ? userData.displayName : "Anonymous",
              userPhotoURL:
                userData && userData.photoURL ? userData.photoURL : "",
              createdAt: commentData.createdAt?.toDate(),
            };
          })
        );
        commentsWithUserData.sort((a, b) => b.createdAt - a.createdAt);
        setComments(commentsWithUserData);
      } catch (error) {
        console.error("Error fetching comments and user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommentsAndUsers();
  }, [symbol]);

// Fetch USer Profile
// useEffect(() => {
//   const fetchUserProfile = async () => {
//     const userRef = doc(db, "users", userId);
//     const userSnap = await getDoc(userRef);
    
//     if (userSnap.exists()) {
//       setUserProfile({ id: userSnap.id, ...userSnap.data() });
//     } else {
//       console.log("No such user!");
//       // Handle user not found scenario
//     }
//   };

//   fetchUserProfile();
// }, [userId]); // Dependency on userId to refetch when it changes

  // Handling submission of comments
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() && !image && !selectedGif) return;

    let imageUrl = "";
    if (image) {
      const imageRef = ref(
        storage,
        `comments/${image.name}_${new Date().getTime()}`
      );
      const uploadTaskSnapshot = await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(uploadTaskSnapshot.ref);
    }

    const newComment = {
      content: comment,
      crypto: symbol,
      createdAt: serverTimestamp(), // This will be finalized by the Firestore database
      uid: user.uid,
      imageUrl: imageUrl,
      gifUrl: selectedGif ? selectedGif.images.fixed_height.url : null,
    };

    try {
      const docRef = await addDoc(collection(db, "comments"), newComment);
      // Construct a new comment object for immediate UI update, including temporary or assumed values for any fields not yet finalized by the database
      const addedComment = {
        ...newComment,
        id: docRef.id,
        // Note: createdAt will be a placeholder until the actual server timestamp is fetched or updated
        createdAt: new Date(), // Placeholder for immediate feedback, adjust as needed
      };

      // Update comments state to include the new comment
      setComments((prevComments) => [addedComment, ...prevComments]);

      // Reset form fields
      setComment("");
      setImage(null);
      setImagePreview("");
      setSelectedGif(null);
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  // Handling image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Fetching GIFs with optional search functionality
  const fetchGifs = async (searchQuery = "") => {
    setLoading(true);
    const apiKey = "RQ5SXHNSOiJygpRRGjP1JTEP5qAGCaDc";
    let url = `https://api.giphy.com/v1/gifs/${
      searchQuery.trim() ? "search" : "trending"
    }?api_key=${apiKey}&limit=10`;

    if (searchQuery.trim()) {
      url += `&q=${encodeURIComponent(searchQuery)}`;
    }

    try {
      const response = await axios.get(url);
      setGifs(response.data.data);
    } catch (error) {
      console.error("Error fetching GIFs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handling GIF selection
  const handleGifSelect = (gif) => {
    setSelectedGif(gif);
    // Close GIF picker UI here if applicable
  };

  // Toggle function
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite); // Toggle the state
  };

  function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => setDebouncedValue(value), delay);

      return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
  }

  const debouncedSearchQuery = useDebounce(searchQuery, 500); // 500ms delay

  useEffect(() => {
    // Check if the debounced search query is not empty
    if (debouncedSearchQuery.trim()) {
      fetchGifs(debouncedSearchQuery);
    } else {
      // Optionally fetch trending GIFs or clear the search results when the query is empty
      // fetchGifs(); // Uncomment this if you want to fetch trending GIFs when the search bar is cleared
      setGifs([]); // Clear the search results if you don't want to display anything when the search bar is empty
    }
  }, [debouncedSearchQuery]);

  // Scroll to Top
  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, []);

  // If loading or no crypto data, show loading or appropriate message
  if (!crypto) return <div>Loading...</div>;

  console.log(crypto.sentiment_votes_up_percentage);

  console.log(user?.displayName);

  console.log(crypto.sentiment_votes_up_percentage);

  console.log(user?.displayName);
  return (
    <div
      className={`w-full h-screen   ${
        theme === "dark"
          ? " body-14"
          : "body-14"
      }`}
    >
      {/* Container */}
      <div
        className={`w-full h-screen grid grid-row-1 lg:flex ${
          theme === "dark" ? " text-white" : " text-gray-900"
        }`}
      >
        {/* Left Side */}
        {/* Enhanced Left Side Component */}
        <div
          className={`flex flex-col w-full h-[100px] lg:w-[500px] lg:h-screen overflow-y-scroll sticky top-0  transition-colors duration-300 shadow-lg ${
            theme === "dark"
              ? " text-white"
              : " text-gray-900"
          }`}
        >
          {/* Header with Dynamic Crypto Data and Favorite Toggle */}
          <div
            className={`flex items-center justify-between p-4 bg-gradient-to-r from-gray-800  to-gray-900  dark:to-teal-900 text-white w-full ${
              theme === "dark" ? "" : ""
            }`}
          >
            <div className="flex items-center space-x-4">
              <img
                src={crypto.image?.large}
                alt={crypto.name}
                className="w-16 h-16 rounded-full "
              />
              <div>
                <h1 className="text-xl font-bold">{crypto.name}</h1>
                <p className="text-sm opacity-80">
                  {crypto.symbol?.toUpperCase()}
                </p>
              </div>
            </div>
            <div className="flex flex-col lg:hidden">
              {/* <p className="text-base text-gray-500 dark:text-gray-400">
                  Current Price
                </p> */}
              <p className="text-3xl font-semibold">
                ${crypto.market_data?.current_price?.usd.toLocaleString()}
              </p>
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
          <div
            className={`hidden lg:flex lg:flex-col lg:p-4 lg:h-[300px]  lg:mt-4 lg:rounded-lg lg:shadow ${
              theme === "dark"
                ? " text-white"
                : " text-gray-900"
            }`}
          >
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
          <div
            className={`hidden lg:flex lg:flex-wrap lg:p-4 lg:mt-4  lg:rounded-lg lg:shadow lg-w-full ${
              theme === "dark"
                ? " text-white"
                : " text-gray-900"
            }`}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Price Chart
            </h3>
            {/* Placeholder for a dynamic price chart component */}
            <div className="h-[400px]  rounded-md mt-2 flex items-center justify-center">
              <TradingViewTechnicalAnalysis />
            </div>
          </div>

          {/* Quick Insights */}
          <div
            className={`hidden lg:flex lg:flex-col lg:p-4 lg:mt-4  lg:rounded-lg lg:shadow ${
              theme === "dark"
                ? " text-white"
                : " text-zinc-600"
            }`}
          >
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
          <div
            className={`hidden lg:flex lg:flex-col lg:p-4 lg:mt-4 lg:rounded-lg lg:shadow ${
              theme === "dark"
                ? " text-white"
                : " text-gray-900"
            }`}
          >
            <h3 className="text-lg font-semibold ">Connect</h3>
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
            <div
              className={`w-full py-4  text-white shadow-lg rounded-lg overflow-hidden ${
                theme === "dark"
                  ? "bg-gradient-to-r from-gray-900  to-[#031729] dark:from-gray-900 dark:to-[#031729] text-white"
                  : "bg-white text-gray-900"
              }`}
            >
              <div className="px-4 md:px-6 lg:px-8">
                {/* Market Overview */}
                <div
                  className={`mb-8 ${
                    theme === "dark"
                      ? " text-white"
                      : " text-gray-900 "
                  }`}
                >
                  <h2 className="text-3xl font-bold mb-2">Market Overview</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className= {`rounded-lg shadow p-4 ${theme === "dark" ? "bg-[#1d1e22]" : ""}`}>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total Market Cap
                      </p>
                      <p className="text-xl font-semibold">$1.5T</p>
                    </div>
                    <div className= {`rounded-lg shadow p-4 ${theme === "dark" ? "bg-[#1d1e22]" : ""}`}>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        24h Trading Volume
                      </p>
                      <p className="text-xl font-semibold">$200B</p>
                    </div>
                    <div className= {`rounded-lg shadow p-4 ${theme === "dark" ? "bg-[#1d1e22]" : ""}`}>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Bitcoin Dominance
                      </p>
                      <p className="text-xl font-semibold">45%</p>
                    </div>
                    <div className= {`rounded-lg shadow p-4 ${theme === "dark" ? "bg-[#1d1e22]" : ""}`}>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Ethereum Dominance
                      </p>
                      <p className="text-xl font-semibold">18%</p>
                    </div>
                  </div>
                </div>

                {/* Latest News Section as previously designed */}
                <h2 className="text-2xl font-bold mb-4">Latest News</h2>
                <div className={`w-full h-[400px] overflow-y-auto rounded-lg shadow-inner p-4 ${theme === "dark" ? "bg-[#1d1e22]" : ""}`}>
                  <TradingViewNews />
                </div>

                {/* Additional Functionalities */}
                <div className="mt-8">
                  <h2 className="text-3xl font-bold mb-2">Trending Coins</h2>
                  <div className="flex overflow-x-auto gap-4 p-2">
                    {/* Placeholder for trending coins. Each coin could be a component */}
                    <div className={`min-w-[160px]  rounded-lg shadow p-4 ${theme === "dark" ? "bg-[#1d1e22] text-zinc-200" : "bg-[#FAFAFA] text-zinc-800"}`}>
                      <p className="text-sm font-semibold">Bitcoin</p>
                      <p className="text-lg">$60,000 USD</p>
                    </div>
                    <div className={`min-w-[160px]  rounded-lg shadow p-4 ${theme === "dark" ? "bg-[#1d1e22] text-zinc-200" : "bg-[#FAFAFA] text-zinc-800"}`}>
                      <p className="text-sm font-semibold">Ethereum</p>
                      <p className="text-lg">$4,000 USD</p>
                    </div>
                    {/* More coins */}
                  </div>
                </div>

                {/* Footer with additional links for navigation */}
                {/* <div className="mt-8 pt-4 border-t border-zinc-700 ">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      © 2024 CryptoDashboard
                    </p>
                    <div className="flex gap-4">
                      <a
                        href="#"
                        className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
                      >
                        Privacy Policy
                      </a>
                      <a
                        href="#"
                        className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
                      >
                        Terms of Service
                      </a>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
        {/* Right Side Component - Posts */}
        <div
          className={`flex flex-col w-full h-[500px] lg:flex lg:flex-col lg:w-[500px] lg:h-full  overflow-y-auto ${
            theme === "dark"
              ? " text-white"
              : " text-gray-900"
          }`}
        >
          <div className={`p-4  rounded-lg shadow ${
            theme === "dark"
              ? " text-white"
              : "bg-[#FAFAFA] text-gray-900"
          }`}>
            <h2 className="text-lg font-semibold ">
              Share your thoughts
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-black dark:text-gray-300 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500"
                placeholder={`What do you think about ${symbol}?`}
                rows="4"
              ></textarea>
              {/* #16171a */}
              <div className={`flex items-center justify-between ${theme === "dark"
              ? " text-white"
              : " text-gray-900"}`}>
                <label className="flex items-center cursor-pointer text-blue-500 hover:text-blue-600">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 mr-2">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.172 7l-6.586 6.586a2 2 0 001.414 3.414H16a2 2 0 002-2V8.414a2 2 0 00-2.828-1.414z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 13V5a2 2 0 00-2-2H6a2 2 0 00-2 2v14l4-4h7a2 2 0 002-2z"
                      ></path>
                    </svg>
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  Attach a photo
                </label>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-24 h-24 rounded-md object-cover"
                  />
                )}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Search GIFs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="p-2 border border-gray-300 text-zinc-700 rounded-md"
                />
              </div>
              {/* Display selected GIF */}
              {selectedGif && (
                <div>
                  <img
                    src={selectedGif.images.fixed_height.url}
                    alt="Selected GIF"
                    className="w-full max-w-xs mt-2"
                  />
                </div>
              )}
              {/* Display search results */}
              <div className="grid grid-cols-3 gap-4">
                {gifs.map((gif) => (
                  <img
                    key={gif.id}
                    src={gif.images.fixed_height_small.url}
                    alt="gif"
                    onClick={() => handleGifSelect(gif)}
                    className="cursor-pointer"
                  />
                ))}
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Post Comment
              </button>
            </form>
          </div>

          <hr />
          <div className="p-2">
            <h2 className="text-lg font-semibold">Community Posts</h2>
            {loading ? (
              <div className="flex justify-center items-center h-screen">
                <div>Loading comments...</div>
              </div>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`rounded-lg overflow-hidden mb-4 ${
                    theme === "dark"
                      ? "bg-[#151828] shadow-sm  shadow-slate-800 text-white"
                      : "bg-white shadow-md text-gray-900"
                  }`}
                >
                  <div className="p-4">
                    <div className="flex flex-col-reverse gap-4 items-center mb-4">
                      {/* Render user avatar */}

                      {/* Conditional rendering for image or GIF */}
                      {comment.imageUrl ? (
                        // Render posted image if imageUrl exists
                        <img
                          className="max-w-full h-auto rounded"
                          src={comment.imageUrl}
                          alt="Posted Image"
                        />
                      ) : comment.gifUrl ? (
                        // Render posted GIF if gifUrl exists
                        <img
                          className="max-w-full h-auto rounded"
                          src={comment.gifUrl}
                          alt="Posted GIF"
                        />
                      ) : null}

                      <div className="w-full flex gap-4">
                        <Link to={`/community/profile/${comment.userName}`}>
                        <img
                          className="w-10 h-10 rounded-full object-cover"
                          src={comment.userPhotoURL}
                          alt="User Avatar"
                        />
                        </Link>
                        <div className="flex flex-col">
                          <span className="font-semibold">
                            {comment.userName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {comment.createdAt.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center h-screen">
                <div>No comments found.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CryptoPage;
