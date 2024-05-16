import React, { useState, useContext, useEffect } from "react";
import { CameraIcon } from "@heroicons/react/solid";
import ThemeContext from "../components/ThemeContext/ThemeContext";
import { getAuth, updateProfile } from "firebase/auth";
import { db, doc, setDoc } from '../firebase';
import { ref, getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import AccountSecurity from "../components/AccountFeatures/AccountSecurity";  // Import the AccountSecurity component
import CryptoWallet from "../components/AccountFeatures/CryptoWallet";        // Import the CryptoWallet component

function Account({ user }) {
  const [displayName, setDisplayName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [uploading, setUploading] = useState(false); // Track upload status
  const { theme } = useContext(ThemeContext);
  const auth = getAuth();
  const storage = getStorage(); // Initialize Firebase Storage
  const [selectedTab, setSelectedTab] = useState("profile"); // State for managing selected tab
  
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

      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    setUploading(false);
  };

  // Render different components based on the selected tab
  const renderContent = () => {
    switch (selectedTab) {
      case "profile":
        return (
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
        );
      case "security":
        return <AccountSecurity theme={theme} />;
      case "wallet":
        return <CryptoWallet />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex flex-col md:flex-row ${
      theme === "dark" ? "bg-[#031021] text-primary-50" : "bg-[#F5F9FE] text-primary-800"
    }`}>
      {/* Sidebar */}
      <div className={`w-full md:w-64 h-auto hidden md:flex md: md:h-screen ${
        theme === "dark"
          ? "border-zinc-700 bg-gradient-to-l from-[#07172b]"
          : "bg-primary-50 shadow-primary-100 border-primary-200"
      }`}>
        <div className="p-10 ">
          <h2 className="headline-semibold-28 ml-2">Account</h2>
          <nav className="mt-10 body-16">
            <button onClick={() => setSelectedTab("profile")} className="block py-2.5 px-4 rounded hover:bg-gray-700">Profile</button>
            <button onClick={() => setSelectedTab("security")} className="block py-2.5 px-4 rounded hover:bg-gray-700">Account Security</button>
            <button onClick={() => setSelectedTab("wallet")} className="block py-2.5 px-4 rounded hover:bg-gray-700">Crypto Wallet</button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        {renderContent()}
      </div>
    </div>
  );
}

export default Account;
