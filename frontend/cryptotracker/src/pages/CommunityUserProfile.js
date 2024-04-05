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
import ThemeContext from "../components/ThemeContext";
import Avatar from "@mui/material/Avatar";

function CommunityUserProfile() {
  const [userProfile, setUserProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false); // Correctly declare isFollowing state
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { theme } = useContext(ThemeContext);
  const auth = getAuth();

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
      <div className="w-full h-full flex">
        <div
          className={`hidden w-[280px] h-full border-r border-zinc-700 lg:flex lg:justify-center ${
            theme === "dark" ? "label-semibold-16" : "label-semibold-16"
          }`}
        >
          <div className="p-4">
            <h2 className="text-2xl font-semibold">Community</h2>
            {/* Sidebar content here */}
          </div>
        </div>

        <div className="w-[800px] h-full overflow-y-scroll border-r border-zinc-700">
          <div className="w-full h-[500px] pt-8 px-8 relative">
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

                <div className="w-full h-[100px] flex">
                  <div className="w-[200px] h-full flex justify-center translate-x-[30px] translate-y-[-70px] sm:translate-y-[-100px]">
                    <img
                      className="w-[150px] sm:w-[200px] h-[150px] sm:h-[200px] object-cover rounded-full border-4 border-primary-700"
                      src={userProfile.photoURL}
                      alt="Profile"
                    />
                  </div>
                  <div className="pt-4 px-20">
                    <h2 className="text-xl font-semibold">
                      {userProfile.displayName}
                    </h2>
                    <h3 className="text-lg text-gray-400">
                      @{userProfile.displayName}
                    </h3>
                    <p>
                      Followers: {followersCount} | Following: {followingCount}
                    </p>
                  </div>
                  <div className="flex">
                    {/* User details and follow/unfollow button */}
                    {currentUser && (
                      <div className="mt-5">
                        {isFollowing ? (
                          <button
                            onClick={() => unfollowUser(id)}
                            className="button-primary-small-dark"
                          >
                            Unfollow
                          </button>
                        ) : (
                          <button
                            onClick={() => followUser(id)}
                            className="button-primary-small-dark"
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

            <div className="w-full mt-10 border-b  border-zinc-700"></div>

            <div className="px-5 pt-4">
              {posts.map((post) => (
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
                      src={
                        userProfile.photoURL || "https://via.placeholder.com/60"
                      }
                      className="w-full h-auto rounded-full object-cover"
                      alt={userProfile.displayName || "User"}
                    />
                  </div>

                  <div className="flex-1">
                    <h2 className="font-bold">{post.displayName}</h2>
                    <p>{post.text}</p>
                    {post.imageUrl && (
                      <div className="mt-2">
                        <img
                          src={post.imageUrl}
                          alt="Post content"
                          className="max-w-full h-auto object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Adjust as per your layout */}
        <div className="hidden h-screen xl:flex xl:flex-col gap-3 overflow-y-scroll p-4">
          {/* Right side content similar to CommunityProfile can be added here */}
        </div>
      </div>
    </div>
  );
}

export default CommunityUserProfile;
