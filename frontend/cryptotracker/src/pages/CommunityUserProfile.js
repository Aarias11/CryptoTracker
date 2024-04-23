import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ThemeContext from "../components/ThemeContext/ThemeContext";
import Avatar from "@mui/material/Avatar";
import TrendingCoins from "../API/TrendingCoins.json";

function CommunityUserProfile() {
  const [userProfile, setUserProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false); // Correctly declare isFollowing state
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [crypto, setCrypto] = useState(TrendingCoins);

  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { theme } = useContext(ThemeContext);
  const auth = getAuth();

  // UseEffect Trending Coins
  useEffect(() => {
    setCrypto(TrendingCoins.nfts);
    console.log("There are your coins", TrendingCoins.nfts);
  }, []);

  useEffect(() => {
    const fetchFollowStatusAndCount = async () => {
      if (!id) return; // id is the profile being viewed

      // Fetch followers count for the profile
      const followersRef = collection(db, `users/${id}/followers`);
      const followersSnap = await getDocs(followersRef);
      setFollowersCount(followersSnap.size);

      // Check if the current user is following the profile
      if (currentUser) {
        const userFollowingRef = doc(
          db,
          `users/${currentUser.uid}/following/${id}`
        );
        const userFollowingSnap = await getDoc(userFollowingRef);
        setIsFollowing(userFollowingSnap.exists());
      }
    };

    fetchFollowStatusAndCount();
  }, [id, currentUser]);

  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        checkFollowingStatus(user.uid, id);
      }
    });

    const fetchUserProfileAndPosts = async () => {
      setLoading(true);
      const userRef = doc(db, "users", id);
      const userDocSnap = await getDoc(userRef);
      if (userDocSnap.exists()) {
        setUserProfile(userDocSnap.data());
        const postsRef = collection(db, "posts");
        const postsQuery = query(postsRef, where("uid", "==", id));
        const querySnapshot = await getDocs(postsQuery);
        setPosts(
          querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      }
      setLoading(false);
    };

    fetchUserProfileAndPosts();

    return () => unsubscribe();
  }, [auth, id]);

  const checkFollowingStatus = async (currentUserId, profileId) => {
    const followRef = doc(db, `users/${currentUserId}/following/${profileId}`);
    const followSnap = await getDoc(followRef);
    setIsFollowing(followSnap.exists());
  };

  // Follow Function
  const followUser = async () => {
    if (!currentUser || !currentUser.uid) return;

    const followingRef = doc(db, `users/${currentUser.uid}/following/${id}`);
    try {
      await setDoc(followingRef, { userId: id });
      setIsFollowing(true); // Set following status optimistically
      setFollowersCount(followersCount + 1); // Update followers count optimistically
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  // Unfollow Function
  const unfollowUser = async () => {
    if (!currentUser || !currentUser.uid) return;

    const followingRef = doc(db, `users/${currentUser.uid}/following/${id}`);
    try {
      await deleteDoc(followingRef);
      setIsFollowing(false); // Set following status optimistically
      setFollowersCount(followersCount - 1); // Update followers count optimistically
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  if (loading)
    return <div className="w-full h-screen bg-primary-900">Loading...</div>;

  return (
    <div
      className={`w-full h-screen ${theme === "dark" ? "body-14" : "body-14"}`}
    >
      {/* Container */}
      <div className="w-full h-full lg:flex lg:flex-row flex flex-col-reverse">
        {/* Left Side */}
        <div
          className={`w-full  lg:h-auto lg:flex flex flex-col lg:w-[30%] p-8 overflow-y-scroll border-r border-zinc-800 ${
            theme == "dark"
              ? "border-primary-900  bg-gradient-to-l from-[#07172b]"
              : "bg-primary-50 shadow-primary-100 border-primary-200"
          }`}
        >
          <div className="h-auto flex flex-col overflow-y-scroll ">
            <h2 className="headline-semibold-28 ">Trending</h2>
            <div className="w-full flex flex-shrink-0 gap-4 lg:flex lg:flex-col lg:gap-4 lg:overflow-y-scroll pt-7">
              {crypto.map((crypto) => (
                <div
                  key={crypto.id}
                  className={`flex w-[200px] lg:w-full min-h-[70px] flex-shrink-0 border rounded-xl shadow-lg shadow-black pl-2 ${
                    theme === "dark"
                      ? "border-primary-900 rounded-xl bg-gradient-to-r from-[#07172b]"
                      : "bg-primary-50 shadow-primary-100 border-primary-200"
                  }`}
                >
                  <div className="flex items-center p-2">
                    <img
                      className="rounded-full"
                      src={crypto.thumb || "https://via.placeholder.com/50"}
                      alt={crypto.name}
                    />
                    <div className="flex flex-col justify-center ml-2">
                      <h2 className="label-semibold-14">{crypto.name}</h2>
                      <h3 className="label-semibold-12 text-gray-400">
                        {crypto.symbol.toUpperCase()}
                      </h3>
                      <p className="text-sm flex gap-3">
                        <span>
                          {crypto.floor_price_24h_percentage_change.toLocaleString(
                            1
                          )}
                          %
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Posts */}
        <div className="w-full  h-screen overflow-x-scroll md:p-8">
          <div
            className={`w-full h-full overflow-y-scroll ${
              theme === "dark"
                ? "label-semibold-16 border-zinc-700"
                : "label-semibold-16 border-primary-100"
            }`}
          >
            <div className="w-full h-[500px] pt-8 p-2 relative">
              {userProfile ? (
                <>
                  <div className="relative w-full h-[300px]">
                    <img
                      src={
                        userProfile.bannerImage ||
                        "https://via.placeholder.com/800x300"
                      }
                      alt="Banner"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>

                  <div className="w-full h-[100px] flex justify-center  items-center py-4 px-4 sm:px-20">
                    <div className="flex-none w-[150px] sm:w-[200px] h-[150px] sm:h-[200px] relative">
                      <img
                        className="absolute left-1/2 transform -translate-x-1/2 -translate-y-[50px] sm:-translate-y-20 w-[150px] sm:w-[200px] h-[150px] sm:h-[200px] object-cover rounded-full border-4 border-primary-700"
                        src={userProfile.photoURL}
                        alt="Profile"
                      />
                    </div>
                    {/* User Info */}
                    <div className="flex-1 w-auto ml-4  translate-x-[-2px] md:translate-x-0 pt-3">
                      <h2 className="text-xl font-semibold truncate">
                        {userProfile.displayName}
                      </h2>
                      <h3 className="text-lg text-gray-400 truncate">
                        @{userProfile.displayName}
                      </h3>
                      <p className="label-semibold-12">
                        Followers: {followersCount} | Following:{" "}
                        {followingCount}
                      </p>
                    </div>
                    <div className="flex">
                      {/* User details and follow/unfollow button */}
                      {currentUser && (
                        <div className="mt-5">
                          {isFollowing ? (
                            <button
                              onClick={() => unfollowUser(id)}
                              className="md:button-primary-small-dark md:title-20 button-primary-extra-small-dark label-12"
                            >
                              Unfollow
                            </button>
                          ) : (
                            <button
                              onClick={() => followUser(id)}
                              className="md:button-primary-small-dark button-primary-extra-small-dark label-12"
                            >
                              Follow
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div>No user profile data found</div>
              )}

              <div className="w-full mt-2 border-b  border-zinc-700"></div>
              {/* Posts */}
              <div className="px-5 pt-4">
                {posts.map((post) => (
                                    <div className="w-full flex justify-center">

                    <div
                    key={post.id}
                    className={`w-full md:w-[90%] p-3 flex justify-center px-10 pt-5  mb-4 shadow-md  rounded-xl border ${
                      theme === "dark"
                        ? "bg-gradient-to-r from-[#07172b]/90 shadow-black border-primary-900"
                        : "bg-primary-50 shadow-primary-100 border-primary-200"
                    }`}
                  >
                    <div className="w-[60px] mr-4">
                      <Avatar
                        src={
                          userProfile.photoURL ||
                          "https://via.placeholder.com/60"
                        }
                        className="w-12 h-12 rounded-full object-cover"
                        alt={userProfile.displayName || "User"}
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
                        <div className="mb-2">
                          <p>{post.text}</p>
                        </div>
                        {post.imageUrl && (
                          <div className="max-w-full h-auto mt-2 flex justify-center">
                            <img
                              src={post.imageUrl}
                              alt="Post"
                              className="w-[95%] h-[200px] md:h-[400px] rounded-lg text-sm object-contain"
                            />
                          </div>
                        )}
                      </div>
                  </div>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityUserProfile;
