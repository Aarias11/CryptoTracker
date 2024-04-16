import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useParams } from 'react-router-dom';
import ThemeContext from "../components/ThemeContext/ThemeContext";
import Avatar from "@mui/material/Avatar";
import { BiHappyBeaming } from "react-icons/bi";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from '../firebase'; // Adjust the path as per your project structure
import { collection, doc, setDoc, getDocs, getFirestore } from "firebase/firestore";
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


// UseEffect for fetching and displaying posts
  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, "posts"));
      const postsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
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
      const fileRef = ref(getStorage(), `posts/${user.uid}/${selectedFile.name}`);
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




  console.log(user);

  return (
    <div
      className={`w-full h-screen ${
        theme === "dark" ? "body-14" : "body-14"
      }`}
    >
      {/* Container */}
      <div className="w-full h-full flex">
        {/* Left Side */}
        {/* Left Side Container */}
        <div className={`hidden w-[280px] h-full border-r border-zinc-700 lg:flex lg:justify-center p-4 ${
        theme === "dark" ? "" : ""
      }`}>
          {/* Left Side Content Container */}
          <div className={` w-full ${
        theme === "dark" ? "label-semibold-16" : "label-semibold-16"
      }`}>
        <h2 className="headline-semibold-28 text-center">Community</h2>
            {/* Community Content */}
            <ul className="w-full flex flex-col  gap-5 pt-10 ml-4">
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
        {/* Center Container*/}
        <div className="w-[800px] h-full overflow-y-scroll border-r border-zinc-700 ">
          {/* Center Content Container */}
          <div className="w-full h-[275px] p-3 flex">
            {/* Left Avatar Side */}
            <div className="w-[120px] h-full flex justify-center px-2 pt-6">
                {/* CHange user.email to user.uid */}
              <Link to={`/community/profile/${user?.displayName}`}> 
              <img className="w-[80px] h-[80px] rounded-full object-cover" src={user?.photoURL} /></Link>
            </div>
            {/* TEXT AREA AND POST */}
            <div className="w-full h-full pt-7 flex flex-col gap-2 leading-3 tracking-tighter ">
              {/* User Email */}
              <h2 className="title-bold-20">{user?.displayName}</h2>
              <h2 className="title-semibold-20">@{user?.displayName}</h2>

              {/* Text Area */}
              <textarea
                className={`search-input w-[95%] h-[100px] rounded-lg p-2 border border-primary-200 text-sm ${ theme === "dark"
                ? "bg-gradient-to-r from-[#07172b] border border-primary-200  to-[#031021] "
                : "" }`}
                placeholder="How do you feel about the markets today? Share your ideas here!"
                value={postText}
  onChange={(e) => setPostText(e.target.value)}
              />
              <div className="w-[95%] flex justify-between">
                <BiHappyBeaming className="text-slate-400" size={25} />
                <input className="border rounded-lg p-2" type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} />

                <button className="w-[100px] h-[40px] border rounded-lg"
                onClick={handlePostSubmit}>
                  Post
                </button>
              </div>
              {/* Image Preview */}
    {imagePreviewUrl && (
        <img src={imagePreviewUrl} alt="Preview" className="mt-2 w-[150px] h-[150px] rounded-lg" />
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
                  className={`search-input w-[91%] h-[48px] border border-primary-200  p-2  text-sm rounded-lg ${ theme === "dark"
                  ? "bg-gradient-to-r from-[#07172b] border border-primary-200  to-[#031021] "
                  : "" }`}
                  placeholder="Search Users or Posts.."
                />
              </div>
              {/* For You / Following */}
              <div className="w-[92%] flex gap-12 text-2xl px-10 pt-4 ">
                <span>For You</span>
                <span>Following</span>
              </div>
            </div>
            {/* Posts Container*/}
            <div className="w-full h-full">
              {/* Posts Content */}
              <div className="w-full h-[250px] p-3 flex">
                {/* Left Avatar Side */}
                <div className="w-[100px] h-full flex justify-center pt-6">
                  <Avatar className="border-2 border-zinc-600  ">
                    {/* {user.email[0]} */}
                  </Avatar>{" "}
                </div>
                <div>
                </div>
                {/* TEXT AREA AND POST */}
                <div className="w-full h-full pt-7 flex flex-col gap-4">
                  {/* Poster Content */}
                  {/* Poster */}
                  <div className="flex gap-4 items-center">
                    <h2 className="title-bold-20">Poster Email</h2>
                    <span className="title-16">@PosterUsername</span>
                    <span className="translate-x-[340px] title-16">14h ago</span>
                  </div>
                  {/* Poster Comment */}
                  <div className="">
                    <p className="h-auto font-light body-14">
                      Mogul talk. They will try to close the door on you, just
                      open it. The key to more success is to have a lot of
                      pillows. Special cloth alert. They key is to have every
                      key, the key to open every door
                    </p>
                  </div>
                  {/* Poster Image */}
                  <div className="h-[300px]">
                    <img
                      className="w-[95%] h-[300px] bg-slate-600 rounded-lg text-sm object-cover"
                      src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNyeXB0b3xlbnwwfHwwfHx8MA%3D%3D"
                    />
                  </div>
                  <div className="w-[95%] flex justify-between">
                    <BiHappyBeaming className="text-slate-400" size={25} />
                    <button className="w-[100px] h-[40px] border rounded-lg">
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right Side */}
        {/* Right Side Content Container*/}
        <div className="hidden xl:flex"></div>
      </div>
    </div>
  );
}

export default CommunityPage;
