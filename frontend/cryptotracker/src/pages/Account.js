import React, { useState, useContext, useEffect } from "react";
import { CameraIcon } from "@heroicons/react/solid";
import { Link } from "react-router-dom";
import ThemeContext from "../components/ThemeContext/ThemeContext";
import { getAuth, updateProfile } from "firebase/auth";
import { db, doc, setDoc } from '../firebase';
import { ref, getStorage, uploadBytes, getDownloadURL } from "firebase/storage";

function Account({ user }) {
  const [displayName, setDisplayName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [uploading, setUploading] = useState(false); // Track upload status
  const { theme, toggleTheme } = useContext(ThemeContext);
  const auth = getAuth();
  const storage = getStorage(); // Initialize Firebase Storage

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setProfilePic(user.photoURL || "");
    }
  }, [user]);

  const handleDisplayNameChange = (e) => {
    setDisplayName(e.target.value);
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, `profilePics/${user.uid}/${file.name}`);
    setUploading(true);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(snapshot.ref);
      setProfilePic(photoURL);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    setUploading(false);
  };

  const saveChanges = async () => {
    if (!user) return;

    setUploading(true);
    try {
        // Update the auth profile
        await updateProfile(auth.currentUser, {
            displayName: displayName,
            photoURL: profilePic,
        });

        // Save additional information to Firestore
        const userRef = doc(db, "users", user.uid); // Reference to the user's document in Firestore
        await setDoc(userRef, {
            displayName: displayName, // Save the display name
            photoURL: profilePic, // Save the profile picture URL
        }, { merge: true }); // Merge with existing document to prevent overwriting other fields

        // console.log("Profile updated successfully");
    } catch (error) {
        console.error("Error updating profile:", error);
    }
    setUploading(false);
};


  console.log(user);

  return (
    <div className={`flex flex-col md:flex-row ${
      theme === "dark" ? "bg-[#031021] text-primary-50" : "bg-[#F5F9FE] text-primary-800"
    }`}>
    {/* Sidebar */}
    <div className={`w-full md:w-64 h-auto hidden md:flex md: md:h-screen ${
            theme == "dark"
              ? "border-zinc-700 bg-gradient-to-l from-[#07172b]"
              : "bg-primary-50 shadow-primary-100 border-primary-200"
          }`}>
      <div className="p-5">
        <h2 className="font-bold">Account Settings</h2>
        <nav className="mt-10">
          <Link to="#" className="block py-2.5 px-4 rounded hover:bg-gray-700">Profile</Link>
          
        </nav>
      </div>
    </div>

    {/* Main Content */}
    <div className="flex-1 p-10">
      <h1 className="text-2xl font-semibold">Edit Profile</h1>
      <div className="mt-8 max-w-md">
        <div className="flex flex-col gap-2 md:flex items-center">
          <span className="h-24 w-24 rounded-full overflow-hidden bg-gray-100">
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <CameraIcon className="h-full w-full text-gray-300" />
            )}
          </span>
          <input
            type="file"
            onChange={handleProfilePicChange}
            className={`search-input ml-5 p-2 ${
              theme === "dark" ? "bg-[#031021] border border-primary-300 text-primary-200" : "bg-white"
            }`}
          />
        </div>
        <div className="mt-4">
          <label className="block">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={handleDisplayNameChange}
            className={`search-input w-full p-2 ${
              theme === "dark" ? "bg-[#031021] border border-primary-300 text-primary-200" : ""
            }`}
          />
        </div>
        <button
          onClick={saveChanges}
          className={`mt-4 px-4 py-2 ${uploading ? "bg-gray-500" : "bg-blue-500"} text-white rounded hover:bg-blue-600`}
          disabled={uploading}
        >
          {uploading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  </div>
  );
}

export default Account;
