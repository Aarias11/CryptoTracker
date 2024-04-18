import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ThemeContext from "../components/ThemeContext/ThemeContext";
import Avatar from "@mui/material/Avatar";
import { BiHappyBeaming } from "react-icons/bi";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase"; // Adjust the path as per your project structure
import {
  collection,
  doc,
  setDoc,
  getDocs,
  getFirestore,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { ref, getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import { IconSettings } from "@tabler/icons-react";

function CommunityPage({ user }) {
  const [postText, setPostText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [uploading, setUploading] = useState(false); // Define the missing setUploading state
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const { username } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const { theme, toggleTheme } = useContext(ThemeContext); // Using ThemeContext
  const auth = getAuth();
  const [followedProfiles, setFollowedProfiles] = useState([]);

  // UseEffect for fetching and displaying posts
  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, "posts"));
      const postsData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setPosts(postsData);
    };

    fetchPosts();
  }, []);

  // Posting User Post to Firebase
  const handlePostSubmit = async () => {
    if (!postText && !selectedFile) return; // Don't proceed if there's no content

    setUploading(true);

    let imageUrl = ""; // Default to an empty string if no image is selected

    if (selectedFile) {
      // Define the storage path
      const fileRef = ref(
        getStorage(),
        `posts/${user.uid}/${selectedFile.name}`
      );
      const snapshot = await uploadBytes(fileRef, selectedFile);
      imageUrl = await getDownloadURL(snapshot.ref);
    }

    // Post structure
    const post = {
      text: postText,
      imageUrl: imageUrl,
      createdAt: new Date(),
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };

    // Save the post to Firestore
    await setDoc(doc(db, "posts", `${user.uid}_${new Date().getTime()}`), post);

    // Reset states after posting
    setPostText("");
    setSelectedFile(null);
    setUploading(false);
  };

  // Preview User Image Post
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      const previewUrl = URL.createObjectURL(e.target.files[0]);
      setImagePreviewUrl(previewUrl);
    }
  };

  useEffect(() => {
    const followedProfiles = async () => {
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);
      const usersData = querySnapshot.docs
        .map((doc) => ({ ...doc.data(), id: doc.id })) // `id` is now correctly mapped from the document
        .filter((profile) => profile.id !== user.uid); // Compare `id` with `user.uid` to exclude the current user

      console.log("Followed Profiles:", usersData); // Log the recommended profiles to the console

      setFollowedProfiles(usersData);
    };

    if (user && user.uid) {
      followedProfiles();
    }
  }, [user]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (followedProfiles.length > 0) {
        const followedIds = followedProfiles.map((profile) => profile.id); // Extract the IDs from followedProfiles
        const postsRef = collection(db, "posts");
        const postsQuery = query(
          postsRef,
          where("uid", "in", followedIds),
          orderBy("createdAt", "desc")
        ); // Ordering posts by createdAt in descending order
        const querySnapshot = await getDocs(postsQuery);

        let postsData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setPosts(postsData);
      } else {
        setPosts([]); // Clear posts if there are no followed profiles
      }
    };

    fetchPosts();
  }, [followedProfiles]); // Depend on followedProfiles to re-fetch whenever it changes

  console.log(user);

  return (
    <div
      className={`w-full h-screen ${theme === "dark" ? "body-14" : "body-14"}`}
    >
      {/* Container */}
      <div className="w-full h-full flex ">
        {/* Left Side */}
        {/* Left Side Container */}
        <div
          className={`hidden overflow-y-scroll w-[30%] h-full border-r border-zinc-700 xl:flex lg:justify-center p-4 ${
            theme == "dark"
              ? " bg-gradient-to-r from-[#07172b]"
              : "bg-primary-50 shadow-primary-100 border-primary-200"
          }`}
        >
          {/* Left Side Content Container */}
          <div
            className={` w-full h-screen  ${
              theme == "dark"
                ? "  bg-gradient-to-r from-[#07172b]"
                : "bg-primary-50 shadow-primary-100 border-primary-200"
            }`}
          >
            {/* Events Near By Container */}
            <div className="h-auto px-4  pt-4">
              <h2 className="headline-semibold-28 w-full  px-5">
                Events Nearby
              </h2>
              <div className="w-full h-full p-6 flex flex-col gap-14 ">
                <div
                  className={`w-full h-[200px] rounded-xl ${
                    theme == "dark"
                      ? "border-primary-900 rounded-xl bg-gradient-to-r from-[#07172b]"
                      : "bg-primary-50 shadow-primary-100 border-primary-200"
                  }`}
                >
                  <img
                    className="object-cover rounded-xl"
                    src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZXZlbnR8ZW58MHx8MHx8fDA%3D"
                  />
                </div>

                <div
                  className={`w-full h-[200px] border rounded-xl ${
                    theme == "dark"
                      ? "border-primary-900 rounded-xl bg-gradient-to-r from-[#07172b]"
                      : "bg-primary-50 shadow-primary-100 border-primary-200"
                  }`}
                >
                  <img
                    className="object-cover rounded-xl"
                    src="https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZXZlbnRzfGVufDB8fDB8fHww"
                  />
                </div>

                <div
                  className={`w-full h-[200px] border rounded-xl ${
                    theme == "dark"
                      ? "border-primary-900 rounded-xl bg-gradient-to-r from-[#07172b]"
                      : "bg-primary-50 shadow-primary-100 border-primary-200"
                  }`}
                >
                  <img
                    className="object-cover rounded-xl"
                    src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGV2ZW50c3xlbnwwfHwwfHx8MA%3D%3D"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Center */}
        {/* Center Container*/}
        <div className="w-[100%] xl:w-[70%] h-full overflow-y-scroll border-r border-zinc-700 p-10 ">
          <h2 className="headline-semibold-28 w-full  px-5">
            Profiles Followed
          </h2>

          <div className={` w-full h-auto flex gap-3 overflow-x-scroll p-4  `}>
            {/* Profile Followed Cards */}
            <div className="flex   items-center gap-4  w-full overflow-x-scroll">
              {/* Profiles Followed */}

              {followedProfiles.map((profile) => (
                <Link to={`/community/userprofile/${profile.id}`} key={profile.id}>
                  <div
                    key={crypto.id}
                    className={`flex w-[175px] min-h-[70px] border rounded-xl shadow-lg shadow-black pl-2 ${
                      theme == "dark"
                        ? "border-primary-900 rounded-xl bg-gradient-to-r from-[#07172b]"
                        : "bg-primary-50 shadow-primary-100 border-primary-200"
                    }`}
                  >
                    <div className="flex items-center p-2">
                      <img
                        className="w-[50px] h-[50px] object-cover rounded-full m-2"
                        src={
                          profile.photoURL || "https://via.placeholder.com/50"
                        }
                        alt={profile.displayName}
                      />
                      <div className="flex flex-col justify-center ml-2">
                        <h2 className="text-sm font-semibold">
                          {profile.displayName}
                        </h2>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <h2 className="headline-semibold-28 w-full  px-5 pt-4">Community </h2>

          {/* Center Content Container */}
          <div className="w-full h-[275px] p-3 flex">
            {/* Left Avatar Side */}
            <div className="w-[120px] h-full flex justify-center px-2 pt-6">
              {/* CHange user.email to user.uid */}
              <Link to={`/community/profile/${user?.displayName}`}>
                <img
                  className="w-[80px] h-[80px] rounded-full object-cover"
                  src={user?.photoURL}
                />
              </Link>
            </div>
            {/* TEXT AREA AND POST */}
            <div className="w-full h-full pt-7 flex flex-col gap-2 leading-3 tracking-tighter ">
              {/* User Email */}
              <h2 className="title-bold-20">{user?.displayName}</h2>
              <h2 className="title-semibold-20">@{user?.displayName}</h2>

              {/* Text Area */}
              <textarea
                className={`search-input w-[95%] h-[100px] rounded-lg p-2 border border-primary-200 text-sm ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-[#07172b] border border-primary-200  to-[#031021] "
                    : ""
                }`}
                placeholder="How do you feel about the markets today? Share your ideas here!"
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
              />
              <div className="w-[95%] flex justify-between">
                <BiHappyBeaming className="text-slate-400" size={25} />
                <input
                  className={`border rounded-lg p-2 ${
                    theme == "dark"
                      ? "border-primary-900 rounded-xl bg-gradient-to-r from-[#07172b]"
                      : "bg-primary-50 shadow-primary-100 border-primary-200"
                  }`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />

                <button
                  className={`w-[100px] h-[40px] border rounded-lg ${
                    theme == "dark"
                      ? "border-primary-900 rounded-xl bg-gradient-to-r from-[#07172b] hover:bg-primary-800"
                      : "bg-primary-50 shadow-primary-100 border-primary-200 hover:bg-primary-300"
                  }`}
                  onClick={handlePostSubmit}
                >
                  Post
                </button>
              </div>
              {/* Image Preview */}
              {imagePreviewUrl && (
                <img
                  src={imagePreviewUrl}
                  alt="Preview"
                  className="mt-2 w-[150px] h-[150px] rounded-lg"
                />
              )}
            </div>
          </div>
          {/* Line Divider */}
          <div className="w-full h-[10px] flex justify-center ">
            <div className="w-[92%] border-b border-zinc-700"></div>
          </div>
          {/* Bottom-Center Content Container */}
          <div className="w-full h-full">
            {/* Bottom-Center Content */}
            <div className="w-full h-[100px] ">
              {/* Search Users or Posts */}
              <div className="w-full flex justify-center pt-4">
                <input
                  className={`search-input w-[91%] h-[48px] border border-primary-200  p-2  text-sm rounded-lg ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-[#07172b] border border-primary-200  to-[#031021] "
                      : ""
                  }`}
                  placeholder="Search Users or Posts.."
                />
              </div>
              {/* For You / Following */}
              <div className="w-[92%] flex gap-12 text-2xl px-10 pt-4 ">
                <span>Posts</span>
              </div>
            </div>
            {/* Posts Container*/}
            <div className="w-full h-full p-10 flex flex-col gap-4 ">
              {posts.map((post) => (
                <Link to={`/community/userprofile/${post.uid}`} key={post.id}>
                  {" "}
                  {/* Update this path as needed */}
                  <div
                    className={`w-full h-auto p-6 flex border rounded-xl ${
                      theme === "dark"
                        ? "border-primary-900 rounded-xl bg-gradient-to-r from-[#07172b]"
                        : "bg-primary-50 shadow-primary-100 border-primary-200"
                    }`}
                  >
                    {/* Left Avatar Side */}
                    <div className="w-[100px] h-full flex justify-center ">
                      <Avatar
                        className="border-2 border-zinc-600"
                        src={post.photoURL || "https://via.placeholder.com/150"}
                      />
                    </div>
                    {/* TEXT AREA AND POST */}
                    <div className="w-full h-full  flex flex-col gap-4">
                      {/* Poster Content */}
                      <div className="flex gap-4 items-center">
                        <h2 className="title-bold-20">{post.displayName}</h2>
                        <span className="title-16">@{post.displayName}</span>
                        <span className="ml-auto title-16">
                          {new Date(
                            post.createdAt.seconds * 1000
                          ).toLocaleDateString("en-US")}
                        </span>
                      </div>
                      {/* Poster Comment */}
                      <div className="">
                        <p className="h-auto font-light body-14">{post.text}</p>
                      </div>
                      {/* Poster Image */}
                      {post.imageUrl && (
                        <div className="h-[300px]">
                          <img
                            className="w-[95%] h-full rounded-lg text-sm object-cover"
                            src={post.imageUrl}
                            alt="Post"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityPage;
