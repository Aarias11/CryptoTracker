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

function CryptoPage({ user, currentCrypto }) {
  const [crypto, setCrypto] = useState(CryptoApi);
  const { symbol } = useParams(); // Get the symbol from the URL
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFullDescriptionShown, setIsFullDescriptionShown] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // UseEffect for fetching User Comments
  useEffect(() => {
    const fetchCommentsAndUsers = async () => {
        setLoading(true);
        try {
            const commentsRef = collection(db, "comments");
            const q = query(commentsRef, where("crypto", "==", symbol)); // Filtering by crypto symbol
            const querySnapshot = await getDocs(q);

            const commentsWithUserData = await Promise.all(
                querySnapshot.docs.map(async (documentSnapshot) => {
                    const commentData = documentSnapshot.data();
                    const userRef = doc(db, "users", commentData.uid); // Correct reference to the user's document
                    const userSnapshot = await getDoc(userRef);
                    const userData = userSnapshot.data();

                    return {
                        id: documentSnapshot.id,
                        ...commentData,
                        userName: userData ? userData.displayName : "Anonymous", // Fallback to 'Anonymous' if no displayName
                        userPhotoURL: userData && userData.photoURL ? userData.photoURL : "", // No avatar if no photoURL
                        createdAt: commentData.createdAt?.toDate(), // Keep as Date object for sorting
                    };
                })
            );

            // Sort comments by createdAt date in descending order
            commentsWithUserData.sort((a, b) => b.createdAt - a.createdAt);

            setComments(commentsWithUserData);
        } catch (error) {
            console.error("Error fetching comments and user data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (symbol) {
        fetchCommentsAndUsers();
    }
}, [symbol, db]); // Include db in the dependency array if it's a stateful value that might change


  // console.log(user);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) return;

    // Assuming 'user' is in scope and has a 'uid' property
    if (!user || !user.uid) {
      console.error("User is not authenticated.");
      return;
    }

    const newComment = {
      content: comment,
      crypto: symbol, // Assuming 'symbol' is correctly sourced from useParams or similar
      createdAt: new Date(), // Temporarily use the current date until the server timestamp is fetched
      uid: user.uid, // Include the user's UID to link the comment to the user
      // You might not have the id of the document yet since it's generated by Firestore
    };

    try {
      const docRef = await addDoc(collection(db, "comments"), {
        ...newComment,
        createdAt: serverTimestamp(), // This will be replaced with the server timestamp in Firestore
      });

      // Update local comments state to include the new comment
      // Assuming you have a state variable named 'comments' and a setter named 'setComments'
      setComments((prevComments) => [
        ...prevComments,
        { ...newComment, id: docRef.id },
      ]);

      setComment(""); // Clear the comment input field
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  console.log(crypto.sentiment_votes_up_percentage);

  console.log(user?.displayName);
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
          className={`flex flex-col w-full md:w-[500px] h-screen overflow-y-scroll sticky top-0 bg-white dark:bg-gray-900 transition-colors duration-300 shadow-lg`}
        >
          {/* Header with Dynamic Crypto Data and Favorite Toggle */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-800  to-gray-900 dark:from-gray-800 dark:to-teal-900 text-white ">
            <div className="flex items-center space-x-4">
              <img
                src={crypto.image?.large}
                alt={crypto.name}
                className="w-16 h-16 rounded-full border border-white"
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
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total Market Cap
                      </p>
                      <p className="text-xl font-semibold">$1.5T</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        24h Trading Volume
                      </p>
                      <p className="text-xl font-semibold">$200B</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Bitcoin Dominance
                      </p>
                      <p className="text-xl font-semibold">45%</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Ethereum Dominance
                      </p>
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
                <div className="mt-8 pt-4 border-t border-zinc-700 ">
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
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right Side Component - Posts */}
        <div className="w-[500px] h-full  overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold">Share your thoughts</h2>
            <form onSubmit={handleSubmit}>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-2 border rounded-md text-black"
                placeholder={`What do you think about ${currentCrypto}?`}
              />
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Post
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
                    theme === "dark" ? "bg-gray-800 shadow-sm  shadow-slate-700 text-white" : "bg-white shadow-md text-gray-900"
                  }`}
                >
                  <div className="p-4">
                    <div className="flex gap-4 items-center mb-4">
                      <img
                        className="w-10 h-10 rounded-full object-cover"
                        src={comment.userPhotoURL}
                        alt="User Avatar"
                      />
                      <div>
                        <div className="font-semibold">{comment.userName}</div>
                        <div className="text-xs text-gray-500">
                        {comment.createdAt.toLocaleString()}
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
