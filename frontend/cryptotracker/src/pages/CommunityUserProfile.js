import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // If you're using React Router and username is in the URL
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

function CommunityUserProfile() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { username } = useParams(); // Assuming you're using the username to fetch user's posts

  useEffect(() => {
    const fetchUserID = async () => {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("displayName", "==", username));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userID = querySnapshot.docs[0].id; // Assuming the first document is the correct user
        fetchPosts(userID); // Fetch posts after obtaining userID
      } else {
        setError("User not found.");
        setLoading(false);
      }
    };

    const fetchPosts = async (userID) => {
      try {
        const postsRef = collection(db, "posts");
        const q = query(postsRef, where("userID", "==", userID)); // Use the userID to query posts
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        setPosts(postsData);
        setError(null);
        console.log(postsData)
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserID(); // Initiate the chain by fetching userID based on username
  }, [username]); // Rerun when username changes

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='w-full'>
      <h2>{username}'s Posts</h2>
      {posts.length > 0 ? (
        <ul>
          {posts.map(post => (
            <li key={post.id} className="mb-4">
              <h3 className="text-xl font-bold">{post.displayName}</h3>
              <p className="text-md mb-2">{post.text}</p>
              {post.photoUrl && <img src={post.photoUrl} alt="Post" className="max-w-xs" />}
              {/* Add additional post details here */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts found for {username}.</p>
      )}
    </div>
  );
}

export default CommunityUserProfile;
