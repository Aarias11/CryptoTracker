import React, { useContext, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import ThemeContext from "../components/ThemeContext";
import Avatar from "@mui/material/Avatar";
import { BiHappyBeaming } from "react-icons/bi";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc, getDocs, collection, query, where } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // For uploading banner image
import { db } from "../firebase"; // Adjust the import path as needed
import { CameraIcon } from "@heroicons/react/outline"; // Ensure correct import path
import { CiCalendarDate } from "react-icons/ci";


function CommunityProfile({ user }) {
  const [bannerImage, setBannerImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [hover, setHover] = useState(false);
  const [posts, setPosts] = useState([]);
  const [searchInput, setSearchInput] = useState(""); // State to manage search input
  const { theme } = useContext(ThemeContext);

  // UseEffect for fetching User Posts
  useEffect(() => {
  const fetchPosts = async () => {
    if (user && user.uid) {
      // Adjust the query to filter posts by the user's UID
      const postsRef = collection(db, "posts");
      const q = query(postsRef, where("uid", "==", user.uid)); // Assuming the field storing the user's UID in the posts collection is named "uid"
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
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

  // console.log(user);

  return (
    <div
      className={`w-full h-[600px] ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      {/* Container */}
      <div className="w-full h-full flex">
        {/* Left Side */}
        {/* --------------- */}
        {/* Left Side Container */}
        <div className="hidden w-[280px] h-full border-r border-zinc-700 bg-slate-700 lg:flex lg:justify-center">
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
              <div className="w-[200px] h-full flex justify-center translate-x-[30px] translate-y-[-100px]">
                {/* Change user.email to user.uid */}
                <img
                  className="w-[200px] h-[200px] object-cover rounded-full"
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
            <div className="px-5 pt-4 ">
              <span className="flex items-center gap-4 text-gray-400"><CiCalendarDate size={20} /> Joined {user?.metadata.creationTime.slice(7, 16)}</span>
            </div>
            <Link to="/account">
              <button className="absolute bottom-10 right-8  p-2 font-semibold rounded-lg bg-teal-700">
                Edit Profile
              </button>
            </Link>
            {/* Line Divider */}
            <div className="w-full h-[10px] flex justify-center pt-5">
              <div className="w-[98%] border-b border-zinc-700"></div>
            </div>
          </div>
          {/* Bottom-Center Content Container */}
          <div className="w-full h-full">
      <div className="w-full h-[70px]">
        <div className="w-full flex justify-center pt-4">
          <input
            className="w-[91%] h-[48px] bg-slate-600 p-2 text-sm rounded-lg"
            placeholder="Search Posts..."
            value={searchInput}
            onChange={handleSearchInputChange}
          />
        </div>
      </div>
      {filteredPosts.map((post) => (
        <div
          key={post.id}
          className="w-[96%] p-3 flex justify-center px-10 pt-5 border-b border-zinc-700 m-4 mb-4"
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
              <span className="text-sm text-gray-500">@{post.displayName}</span>
              <span className="text-sm text-gray-500 ml-2">
                {post.createdAt?.toDate?.().toDateString() ?? "Unknown date"}
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
                  className="max-w-full h-auto object-cover rounded-lg"
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
        <div className="hidden xl:flex"></div>
      </div>
    </div>
  );
}

export default CommunityProfile;
