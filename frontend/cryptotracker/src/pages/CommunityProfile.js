import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ThemeContext from "../components/ThemeContext/ThemeContext";
import Avatar from "@mui/material/Avatar";
import { BiHappyBeaming } from "react-icons/bi";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { getStorage } from "firebase/storage"; // For uploading banner image
import { db } from "../firebase"; // Adjust the import path as needed
import { CameraIcon } from "@heroicons/react/outline"; // Ensure correct import path
import { CiCalendarDate } from "react-icons/ci";
import { IconPlus, IconMinus, IconSettings } from "@tabler/icons-react";
import TrendingCoins from "../API/TrendingCoins.json";

function CommunityProfile({ user }) {
  const [bannerImage, setBannerImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [hover, setHover] = useState(false);
  const [posts, setPosts] = useState([]);
  const [searchInput, setSearchInput] = useState(""); // State to manage search input
  const { theme } = useContext(ThemeContext);
  // Recommended Profiles State
  const [recommendedProfiles, setRecommendedProfiles] = useState([]);

  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const [favorites, setFavorites] = useState([]);
  const [crypto, setCrypto] = useState([]);
  const [isTrendingCurrenciesTab, setIsTrendingCurrenciesTab] = useState(true);
  const [isCommunityTab, setIsCommunityTab] = useState(true);

  const auth = getAuth();

  // UseEffect Trending Coins
  useEffect(() => {
    setCrypto(TrendingCoins.coins);
    // console.log("There are your coins", TrendingCoins);
  }, []);

  const TrendingCurrencies = () => {
    setIsTrendingCurrenciesTab(true);
    setIsCommunityTab(false);
  };

  const CommunityTab = () => {
    setIsCommunityTab(true);
    setIsTrendingCurrenciesTab(false);
  };

  // UseEffect for fetching User Posts
  useEffect(() => {
    const fetchPosts = async () => {
      if (user && user.uid) {
        const postsRef = collection(db, "posts");
        const q = query(postsRef, where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs
          .map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
          .sort((a, b) => b.createdAt - a.createdAt); // Sorting posts in descending order
        setPosts(postsData);
        // console.log(postsData)
      }
    };

    fetchPosts();
  }, [user]); // Depend on `user` to re-fetch posts when the user changes

  //   UseEffect for fetching banner url
  useEffect(() => {
    const fetchBannerImageUrl = async () => {
      if (user && user.uid) {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists() && docSnap.data().bannerImage) {
          setBannerImage(docSnap.data().bannerImage);
        }
      }
    };

    fetchBannerImageUrl();
  }, [user]);

  const handleBannerImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    try {
      const storageRef = ref(
        getStorage(),
        `bannerImages/${user.uid}/${file.name}`
      );
      const snapshot = await uploadBytes(storageRef, file);
      const bannerURL = await getDownloadURL(snapshot.ref);

      await setDoc(
        doc(db, "users", user.uid),
        { bannerImage: bannerURL },
        { merge: true }
      );
      setBannerImage(bannerURL);
    } catch (error) {
      console.error("Error uploading banner image:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  // Filter posts based on search input
  const filteredPosts = posts.filter((post) => {
    return post.text.toLowerCase().includes(searchInput.toLowerCase());
  });

  // Fetching Recommended Profiles
  useEffect(() => {
    const fetchRecommendedProfiles = async () => {
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);
      const usersData = querySnapshot.docs
        .map((doc) => ({ ...doc.data(), id: doc.id })) // `id` is now correctly mapped from the document
        .filter((profile) => profile.id !== user.uid); // Compare `id` with `user.uid` to exclude the current user

      // console.log("Recommended Profiles:", usersData); // Log the recommended profiles to the console

      setRecommendedProfiles(usersData);
      // console.log(usersData);
    };

    if (user && user.uid) {
      fetchRecommendedProfiles();
    }
  }, [user]);

  // Fetching Favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const querySnapshot = await getDocs(
        collection(db, "users", user.uid, "favorites")
      );
      const fetchedFavorites = [];
      querySnapshot.forEach((doc) => {
        fetchedFavorites.push({ id: doc.id, ...doc.data() });
      });
      setFavorites(fetchedFavorites);
      // console.log(favorites);
    };

    fetchFavorites();
  }, []);

  return (
    <div
      className={`w-full h-screen ${theme === "dark" ? "body-14 " : "body-14"}`}
    >
      {/* Container */}
      <div className="w-full h-full md:flex md:flex-row flex flex-col-reverse">
        {/* Left Side */}
        {/* --------------- */}
        {/* Left Side Container */}

        <div
          className={`w-full h-[200px] md:h-auto md:flex flex flex-col md:w-[30%] p-4 md:p-8 overflow-y-scroll border-r border-zinc-800 ${
            theme == "dark"
              ? "border-primary-900  bg-gradient-to-l from-[#07172b]"
              : "bg-primary-50 shadow-primary-100 border-primary-200"
          }`}
        >
          <div className="h-[300px] md:h-auto flex flex-col overflow-y-scroll ">
            <h2 className="headline-semibold-28 ">Trending</h2>
            <div className="w-full flex flex-shrink-0 gap-4 md:flex md:flex-col md:gap-4 md:overflow-y-scroll pt-7">
              {crypto.map((crypto) => (
                <Link to={`/cryptopage/${crypto.item.symbol}`} key={crypto.id}>
                  <div
                    className={`flex w-[200px] md:w-full min-h-[70px] flex-shrink-0 border rounded-xl shadow-lg shadow-black pl-2 ${
                      theme === "dark"
                        ? "border-primary-900 rounded-xl bg-gradient-to-r from-[#07172b]"
                        : "bg-primary-50 shadow-primary-100 border-primary-200"
                    }`}
                  >
                    <div className="flex items-center md:p-2">
                      <img
                        className="rounded-full"
                        src={
                          crypto.item.small || "https://via.placeholder.com/50"
                        }
                        alt={crypto.item.name}
                      />
                      <div className="flex flex-col justify-center ml-2">
                        <h2 className="label-semibold-14">
                          {crypto.item.name}
                        </h2>
                        <h3 className="label-semibold-12 text-gray-400">
                          {crypto.item.symbol.toUpperCase()}
                        </h3>
                        <p className="text-sm flex gap-3">
                          <span>
                            {crypto.item.data.price_change_percentage_24h.usd.toLocaleString(
                              1
                            )}
                            %
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        {/* --------------- */}

        {/* Right Container*/}
        <div className="w-full  h-screen overflow-x-scroll p-3 md:p-8">
          {/* Currencies Followed */}
          <div className={`w-full  flex flex-col overflow-x-scroll rounded-xl`}>
            <h2 className="headline-semibold-28">Currencies Followed</h2>
            <div className="w-full h-auto flex  gap-3 overflow-x-scroll">
              <div className="w-full flex gap-3 overflow-x-scroll pt-6">
                {favorites.map((crypto) => (
                  <Link to={`/cryptopage/${crypto.symbol}`} key={crypto.id}>
                    <div
                      className={`flex w-[240px] min-h-[100px] border rounded-xl shadow-lg shadow-black  ${
                        theme === "dark"
                          ? "border-primary-900 rounded-xl bg-gradient-to-r from-[#07172b]"
                          : "bg-primary-50 shadow-primary-100 border-primary-200"
                      }`}
                    >
                      <div className="flex items-center p-2">
                        <img
                          className="w-[50px] h-[50px] object-cover rounded-full m-2"
                          src={crypto.image || "https://via.placeholder.com/50"}
                          alt={crypto.name}
                        />
                        <div className="flex flex-col justify-center ml-2">
                          <h2 className="text-sm font-semibold">
                            {crypto.name}
                          </h2>
                          <h3 className="text-sm text-gray-400">
                            {crypto.symbol.toUpperCase()}
                          </h3>
                          <p className="text-sm flex gap-3">
                            ${crypto.price}{" "}
                            <span>{crypto.change24h.toLocaleString(2)}%</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content Container */}
          <div className="w-full pt-8  relative">
            {/* ProfilePage Banner Image*/}
            <div
              className="relative w-full h-[300px]"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <div
                className={`absolute inset-0 flex rounded-xl justify-center items-center ${
                  hover ? "bg-black bg-opacity-50" : ""
                }`}
                onClick={() => fileInputRef.current.click()}
              >
                {hover && <CameraIcon className="h-12 w-12 text-white" />}
              </div>
              <img
                src={bannerImage || "https://via.placeholder.com/800x300"}
                alt="Banner"
                className="w-full h-full object-cover rounded-xl"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleBannerImageChange}
                className="hidden"
              />
            </div>

            <div className="w-full h-[100px] flex gap-24 items-center py-4 px-4 sm:px-20 ">
              {/* Left Avatar Side */}
              <div className="flex-none w-[150px] sm:w-[200px] h-[150px] sm:h-[200px] relative">
                <img
                  className="absolute left-1/2 transform -translate-x-1/2 -translate-y-[50px] sm:-translate-y-20 w-[150px] sm:w-[200px] h-[150px] sm:h-[200px] object-cover rounded-full border-4 border-primary-700"
                  src={user?.photoURL || "https://via.placeholder.com/200"}
                  alt={user?.displayName || "User Avatar"}
                />
              </div>
              {/* User Info */}
              <div className="flex-1 w-auto ml-4  translate-x-[-92px] md:translate-x-0 pt-3">
                <h2 className="text-xl font-semibold truncate">
                  {user?.displayName}
                </h2>
                <h3 className="text-lg text-gray-400 truncate">
                  @{user?.displayName}
                </h3>
                <div className="flex gap-3">
                  <span>12 Followers</span>
                  <span>1 Following</span>
                </div>
              </div>
            </div>

            {/* Joined and Settings Icon */}
            <div className="flex justify-between items-center pt-3">
              <span className="flex items-center gap-4 text-gray-400">
                <CiCalendarDate className="translate-y-[-2px]" size={20} />{" "}
                Joined {user?.metadata.creationTime.slice(7, 16)}
              </span>
              <Link to="/account">
                <button className="pt-1 ">
                  <IconSettings />
                </button>
              </Link>
            </div>
            {/* Line Divider */}
            <div className="w-full h-[10px] flex justify-center pt-5">
              <div className="w-[98%] border-b border-zinc-700"></div>
            </div>
          </div>
          {/* Recommended Profiles Sections */}
          {/* ------------------------------ */}
          <div className="w-[98%] mt-2">
            <div className="w-full flex justify-between">
              <div className="w-[50%]">
                <h2 className="headline-semibold-24 p-2 md:pl-9  ">
                  Recommended Profiles
                </h2>
              </div>
              <div
                className="cursor-pointer w-[50%] flex justify-end text-lg md:pr-7 "
                onClick={toggleCollapse}
              >
                {isCollapsed ? (
                  <IconPlus strokeWidth={2} size={28} />
                ) : (
                  <IconMinus size={28} />
                )}
              </div>
            </div>

            {/*Profile Cards Section  */}
            {!isCollapsed && (
              <div className="flex gap-4 p-2 md:ml-4 md:p-4 md:px-5 w-full h-[200px] overflow-x-scroll">
                {/* Profile Cards Container */}
                {recommendedProfiles.map((profile) => (
                  <div
                    key={profile.id}
                    className={`flex flex-col flex-shrink-0  w-[200px] h-[110px] border rounded-xl shadow-lg shadow-black  ${
                      theme == "dark"
                        ? "border-primary-900 rounded-xl bg-gradient-to-r from-[#07172b]"
                        : "bg-primary-50 shadow-primary-100 border-primary-200"
                    }`}
                  >
                    <Link
                      to={`/community/userprofile/${profile.id}`}
                      className="flex items-center"
                    >
                      <div className="w-[200px] h-[100px]">
                        {/* Profile Card Content */}
                        <div className="w-full h-[100%]">
                          <img
                            className="w-full h-[60%] object-cover rounded-tl-xl rounded-tr-xl border-b-2 border-primary-800"
                            src={profile.bannerImage}
                          />
                        </div>
                        <div className="w-full h-[50%] flex translate-y-[-50px]">
                          <img
                            className="w-[50px] h-[50px] object-cover rounded-full border-4 border-zinc-700 m-2 translate-y-[-20px]"
                            src={profile.photoURL}
                            alt={profile.displayName}
                          />
                          {/* User Info */}
                          <div className="flex flex-col justify-center ml-2 pt-3">
                            {/* <h2 className="text-sm font-semibold">
                              {profile.displayName}
                            </h2> */}
                            <h3 className="text-sm text-gray-400">
                              @{profile.displayName}
                            </h3>
                            <div className="text-sm flex gap-3">
                              <span>12 Followers</span>
                              {/* <span>1 Following</span> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom-Center Content Container */}
          {/* ---------------------------------------- */}
          <div className="w-full h-full ">
            <div className="w-full h-[70px]">
              <div className="w-full flex justify-center ">
                <input
                  className={`search-input w-[96%] md:w-[91%] h-[48px] p-2 focus:outline-none text-sm rounded-lg border border-primary-200  ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-[#07172b] border border-primary-200  to-[#031021] "
                      : "bg-primary-50 shadow-primary-100"
                  }`}
                  placeholder="Search Posts"
                  value={searchInput}
                  onChange={handleSearchInputChange}
                />
              </div>
            </div>
            {/* Posts */}
            <div className="px-1 md:px-5 pt-4">
              {filteredPosts.map((post) => (
                <>
                  <div className="w-full flex justify-center">
                    <div
                      key={post.id}
                      className={`w-full md:w-[90%] p-3 flex justify-center px-10 pt-5  mb-4 shadow-md  rounded-xl border ${
                        theme === "dark"
                          ? "bg-gradient-to-r from-[#07172b]/90 shadow-black border-primary-900"
                          : "bg-primary-50 shadow-primary-100 border-primary-200"
                      }`}
                    >
                      <div className="w-[70px] h-[64px] mr-4 ">
                        <img
                          src={
                            post.photoURL || "https://via.placeholder.com/60"
                          }
                          className="w-[64px] h-[64px] rounded-full border-2 border-zinc-600 object-cover"
                          alt={post.displayName || "User"}
                        />
                      </div>
                      {/* Content Text */}
                      <div className="w-full ">
                        <div className="w-full md:w-[95%] flex justify-center ">
                          <div className="mb-2 w-full  flex justify-between">
                            <div>
                              <h2 className="font-bold">{post.displayName}</h2>
                              <span className="text-sm text-gray-500">
                                @{post.displayName}
                              </span>
                            </div>
                            <div className="md:flex md:gap-2">
                              <p className="label-14">
                                {post.createdAt?.toDate().toDateString() ??
                                  "Unknown date"}
                              </p>
                              <p className="label-14">
                                {post.createdAt
                                  ?.toDate()
                                  .toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  }) ?? "Unknown time"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="mb-2 ">
                          <p className="label-14 ">{post.text}</p>
                        </div>
                        {post.imageUrl && (
                          <div className="max-w-full h-auto mt-2 flex justify-center">
                            <img
                              src={post.imageUrl}
                              alt="Post"
                              className="w-[95%] h-[200px] md:h-[400px] rounded-xl object-contain"
                            />
                          </div>
                        )}
                        {post.gifUrl && (
      <div className="max-w-full h-auto mt-2 flex justify-center">
        <img
        src={post.gifUrl}
        alt="GIF in post"
        className="w-full max-w-xs mt-2 rounded-xl"
      />
      </div>
    )}
                      </div>
                      
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side */}
        {/* --------------- */}
      </div>
    </div>
  );
}

export default CommunityProfile;
