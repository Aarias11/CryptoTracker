import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // If you're using React Router and username is in the URL
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

function PostsComponent() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { username } = useParams(); // Assuming you're using the username to fetch user's posts

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Adjust your query here to match the user's identifier, e.g., their username or userID
        const postsRef = collection(db, "posts");
        const q = query(postsRef, where("displayName", "==", username)); // Adjust this line based on how user identifier is stored in posts
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        setPosts(postsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (username) { // Ensure username is not undefined
      fetchPosts();
    }
  }, [username]); // Rerun when username changes

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='w-full'>
      <h2>{username}'s Posts</h2>
      {posts.length > 0 ? (
        <ul>
          {posts.map(post => (
            <li key={post.id}>
              <h3>{post.displayName}</h3>
              <p>{post.text}</p>
              {post.photoUrl && <img src={post.photoUrl} alt="Post" />}
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts found for {username}.</p>
      )}
    </div>
  );
}

export default PostsComponent;
