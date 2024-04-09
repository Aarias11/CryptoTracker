import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ThemeContext from "../components/ThemeContext";
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

  const auth = getAuth();

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

      console.log("Recommended Profiles:", usersData); // Log the recommended profiles to the console

      setRecommendedProfiles(usersData);
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
      console.log(favorites);
    };

    fetchFavorites();
  }, []);

  return (
    <div
      className={`w-full h-screen ${theme === "dark" ? "body-14 " : "body-14"}`}
    >
      {/* Container */}
      <div className="w-full h-full flex">
        {/* Left Side */}
        {/* --------------- */}
        {/* Left Side Container */}
        <div
          className={`hidden w-[280px] h-full border-r border-zinc-700 lg:flex lg:justify-center ${
            theme === "dark" ? "label-semibold-16" : "label-semibold-16"
          }`}
        >
          {/* Left Side Content Container */}
          <div className="p-4 ">
            <h2 className="text-2xl font-semibold">Community</h2>
            {/* Community Content */}
            <ul className="flex flex-col justify-center items-center gap-5 pt-10">
              <li className="cursor-pointer hover:bg-slate-800 w-[120px] h-[30px] pt-1 text-center rounded-full">
                Feed
              </li>
              <li className="cursor-pointer hover:bg-slate-800 w-[120px] h-[30px] pt-1 text-center rounded-full">
                Topics
              </li>
              <li className="cursor-pointer hover:bg-slate-800 w-[120px] h-[30px] pt-1 text-center rounded-full">
                Lives
              </li>
              <li className="cursor-pointer hover:bg-slate-800 w-[130px] h-[40px] pt-2 text-center rounded-full">
                Notifications
              </li>
              <li className="cursor-pointer hover:bg-slate-800 w-[120px] h-[30px] pt-1 text-center rounded-full">
                My Page
              </li>
              <li className="cursor-pointer hover:bg-slate-800 w-[120px] h-[30px] pt-1 text-center rounded-full">
                ... More
              </li>
            </ul>
          </div>
        </div>
        {/* Center */}
        {/* --------------- */}

        {/* Center Container*/}
        <div className="w-[800px] h-full overflow-y-scroll border-r border-zinc-700 ">
          {/* Center Content Container */}
          <div className="w-full h-[500px] pt-8 px-8 relative ">
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

            <div className="w-full h-[100px] flex">
              {/* Left Avatar Side */}
              <div className="w-[200px] h-full flex justify-center translate-x-[30px] translate-y-[-70px] sm:translate-y-[-100px]">
                {/* Change user.email to user.uid */}
                <img
                  className="w-[150px] sm:w-[200px] h-[150px] sm:h-[200px] object-cover rounded-full border-4 border-primary-700 "
                  src={user?.photoURL}
                />
              </div>
              {/* User Info */}
              <div className="pt-4 px-20">
                <h2 class="text-xl font-semibold">{user?.displayName}</h2>
                <h3 class="text-lg text-gray-400">@{user?.displayName}</h3>
                <div className="flex gap-3">
                  <span>12 Followers</span>
                  <span>1 Following</span>
                </div>
              </div>
            </div>
            <div className="px-5 pt-4">
              <span className="flex items-center gap-4 text-gray-400">
                <CiCalendarDate size={20} /> Joined{" "}
                {user?.metadata.creationTime.slice(7, 16)}
              </span>
            </div>
            <Link to="/account">
              <button className="absolute bottom-10 right-8  p-2 font-semibold rounded-lg bg-teal-700">
                <IconSettings />
              </button>
            </Link>
            {/* Line Divider */}
            <div className="w-full h-[10px] flex justify-center pt-5">
              <div className="w-[98%] border-b border-zinc-700"></div>
            </div>
          </div>
          {/* Recommended Profiles Sections */}
          {/* ------------------------------ */}
          <div className="w-full mt-2">
            <div className="w-full flex justify-between">
              <div className="w-[50%]">
                <h2 className="headline-semibold-24 pl-9  ">
                  Recommended Profiles
                </h2>
              </div>
              <div
                className="cursor-pointer w-[50%] flex justify-end text-lg pr-7"
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
              <div className="flex gap-4 ml-4 p-4 w-full h-[200px] overflow-x-auto">
                {/* Profile Cards Container */}
                {recommendedProfiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="flex  w-[250px] h-[110px] border border-primary-900 rounded-xl bg-gradient-to-r from-[#07172b] shadow-lg shadow-black pl-2"
                  >
                    <Link
                      to={`/community/userprofile/${profile.id}`}
                      className="flex items-center"
                    >
                      {/* Profile Card Content */}
                      <img
                        className="w-[50px] h-[50px] object-cover rounded-full border-4 border-primary-700 m-2"
                        src={profile.photoURL}
                        alt={profile.displayName}
                      />
                      {/* User Info */}
                      <div className="flex flex-col justify-center">
                        <h2 className="text-sm font-semibold">
                          {profile.displayName}
                        </h2>
                        <h3 className="text-sm text-gray-400">
                          @{profile.displayName}
                        </h3>
                        <div className="text-sm flex gap-3">
                          <span>12 Followers</span>
                          <span>1 Following</span>
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
          <div className="w-full h-full mt-4">
            <div className="w-full h-[70px]">
              <div className="w-full flex justify-center ">
                <input
                  className={`search-input w-[91%] h-[48px] p-2 focus:outline-none text-sm rounded-lg ${ theme === "dark"
                  ? "bg-gradient-to-r from-[#07172b] border border-primary-200  to-[#031021] "
                  : "" }`}
                  placeholder="Search Posts..."
                  value={searchInput}
                  onChange={handleSearchInputChange}
                />
              </div>
            </div>
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className={`w-[96%] p-3 flex justify-center px-10 pt-5 m-4 mb-4 shadow-lg shadow-black rounded-xl ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-[#07172b]/90"
                    : "bg-primary-200"
                }`}
              >
                <div className="w-[60px] mr-4">
                  <Avatar
                    src={post.photoURL || "https://via.placeholder.com/60"}
                    className="w-full h-auto rounded-full object-cover"
                    alt={post.displayName || "User"}
                  />
                </div>
                <div className="flex-1">
                  <div className="mb-2">
                    <h2 className="font-bold">{post.displayName}</h2>
                    <span className="text-sm text-gray-500">
                      @{post.displayName}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      {post.createdAt?.toDate?.().toDateString() ??
                        "Unknown date"}
                    </span>
                  </div>
                  <div className="mb-2">
                    <p>{post.text}</p>
                  </div>
                  {post.imageUrl && (
                    <div className="max-w-full h-auto mt-2">
                      <img
                        src={post.imageUrl}
                        alt="Post"
                        className="max-w-full h-[200px] object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Right Side */}
        {/* --------------- */}

        {/* Right Side Content Container*/}
        <div className="hidden w-[390px] h-screen xl:flex xl:flex-col gap-3 overflow-y-scroll p-4 ">
          <h2 className="headline-semibold-28 text-center">
            Currencies Followed
          </h2>

          <div className="flex flex-col justify-center items-center gap-4 p-4 w-full overflow-y-scroll">
            {favorites.map((crypto) => (
              <Link to={`/cryptopage/${crypto.symbol}`}>
              <div
                key={crypto.id}
                className="flex w-[240px] min-h-[100px] border border-primary-900 rounded-xl bg-gradient-to-r from-[#07172b] shadow-lg shadow-black"
              >
                {/* Crypto Card Content */}
                <div className="flex items-center p-2">
                  <img
                    className="w-[50px] h-[50px] object-cover rounded-full m-2"
                    src={crypto.image || "https://via.placeholder.com/50"}
                    alt={crypto.name}
                  />
                  <div className="flex flex-col justify-center ml-2">
                    <h2 className="text-sm font-semibold">{crypto.name}</h2>
                    <h3 className="text-sm text-gray-400">{crypto.symbol.toUpperCase()}</h3>
                    <p className="text-sm flex gap-3">
                      ${crypto.price} <span>{crypto.change24h.toLocaleString(2)}%</span>
                    </p>
                  </div>
                </div>
              </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityProfile;
