import React, { useState, useContext, useEffect } from "react";
import { CameraIcon } from "@heroicons/react/solid";
import ThemeContext from "../components/ThemeContext/ThemeContext";
import { getAuth, updateProfile } from "firebase/auth";
import { db, doc, setDoc } from '../firebase';
import { ref, getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import AccountSecurity from "../components/AccountFeatures/AccountSecurity";  // Import the AccountSecurity component
import CryptoWallet from "../components/AccountFeatures/CryptoWallet";        // Import the CryptoWallet component
import LoadingComponent from "../components/LoadingComponent";

function Account({ user }) {
  const [displayName, setDisplayName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [uploading, setUploading] = useState(false); // Track upload status
  const { theme } = useContext(ThemeContext);
  const auth = getAuth();
  const storage = getStorage(); // Initialize Firebase Storage
  const [selectedTab, setSelectedTab] = useState("profile"); // State for managing selected tab
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setProfilePic(user.photoURL || "");
      setLoading(false); // Set loading to false once user data is loaded
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

  if (loading) {
    return <LoadingComponent theme={theme} />;
  }

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
                id="profilePicInput"
                className="hidden"
              />
              <label
                htmlFor="profilePicInput"
                className={`w-[100px] h-[40px] label-14 rounded-lg transition duration-300 ease-in-out shadow-lg shadow-primary-800 ${
                  theme === "dark"
                    ? "button-primary-medium-dark text-primary-50"
                    : "button-primary-medium-light text-primary-50"
                }`}
              >
                Browse
              </label>
            </div>
            <div className="mt-4">
              <label className="block mb-2">Display Name</label>
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
              className={`mt-4 px-4 py-2 w-[150px] h-[40px] label-14 rounded-lg transition duration-300 ease-in-out shadow-lg shadow-information-800 bg-information-700 ${uploading ? "text-primary-50" : " text-primary-50"} text-white rounded hover:bg-information-600`}
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
      <div className={`w-full md:w-64 h-auto hidden md:flex md:h-screen ${
        theme === "dark"
          ? "border-zinc-700 bg-gradient-to-l from-[#07172b]"
          : "bg-primary-50 shadow-primary-100 border-primary-200"
      }`}>
        <div className="p-10 ">
          <h2 className="headline-semibold-28 ml-2">Account</h2>
          <nav className="mt-10 body-16">
            <button
              onClick={() => setSelectedTab("profile")}
              className={`block py-2.5 px-4 rounded hover:bg-gray-700 ${selectedTab === "profile" ? "rounded-none border-l-2 border-blue-500 transition duration-300 ease-in-out " : ""}`}
            >
              Profile
            </button>
            <button
              onClick={() => setSelectedTab("security")}
              className={`block py-2.5 px-4 rounded hover:bg-gray-700 ${selectedTab === "security" ? "rounded-none border-l-2 border-blue-500 transition duration-300 ease-in-out " : ""}`}
            >
              Account Security
            </button>
            <button
              onClick={() => setSelectedTab("wallet")}
              className={`block py-2.5 px-4 rounded hover:bg-gray-700 ${selectedTab === "wallet" ? "rounded-none border-l-2 border-blue-500 transition duration-700 ease-in-out " : ""}`}
            >
              Crypto Wallet
            </button>
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
