import React, { useState } from "react";
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword, updateEmail, sendEmailVerification } from "firebase/auth";

const AccountSecurity = ({ theme }) => {
  const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState("");
  const [currentPasswordForPassword, setCurrentPasswordForPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);

    const credential = EmailAuthProvider.credential(user.email, currentPasswordForPassword);

    try {
      // Reauthenticate the user
      await reauthenticateWithCredential(user, credential);

      // Update the password
      await updatePassword(user, newPassword);

      setSuccess("Password updated successfully.");
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
  
    setLoading(true);
  
    const credential = EmailAuthProvider.credential(user.email, currentPasswordForEmail);
  
    try {
      // Reauthenticate the user
      await reauthenticateWithCredential(user, credential);
  
      // Update the email
      await updateEmail(user, newEmail);
  
      // Send verification email to the new email address
      await sendEmailVerification(user);
  
      setSuccess("Email updated and verification email sent.");
    } catch (error) {
      setError(error.message);
    }
  
    setLoading(false);
  };

  return (
    <div>
      <h2 className="headline-semibold-24">Account Security</h2>
      <p className="mt-4">Here you can manage your account security settings.</p>

      {/* Update Email Form */}
      <form onSubmit={handleEmailChange} className="mt-8 max-w-md">
        <div className="mb-4">
          <label className="block">New Email Address</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder={user.email}
            className={`search-input w-[300px] h-full border border-primary-200 rounded-xl font-semibold focus:outline-none text-sm p-3 relative px-[40px] ${
              theme === "dark" ? "bg-[#031021] text-primary-200" : ""
            }`}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block">Current Password</label>
          <input
            type="password"
            value={currentPasswordForEmail}
            onChange={(e) => setCurrentPasswordForEmail(e.target.value)}
            className={`search-input w-[300px] h-full border border-primary-200 rounded-xl font-semibold focus:outline-none text-sm p-3 relative px-[40px] ${
              theme === "dark" ? "bg-[#031021] text-primary-200" : ""
            }`}
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <button
          type="submit"
          className={`mt-4 px-4 py-2 rounded ${
            theme === "dark" ? "bg-primary-600 text-white" : "bg-primary-500 text-black"
          }`}
        >
          {loading ? "Updating..." : "Update Email"}
        </button>
      </form>

      {/* Update Password Form */}
      <form onSubmit={handlePasswordChange} className="mt-8 max-w-md">
        <div className="mb-4">
          <label className="block">Current Password</label>
          <input
            type="password"
            value={currentPasswordForPassword}
            onChange={(e) => setCurrentPasswordForPassword(e.target.value)}
            className={`search-input w-[300px] h-full border border-primary-200 rounded-xl font-semibold focus:outline-none text-sm p-3 relative px-[40px] ${
              theme === "dark" ? "bg-[#031021] text-primary-200" : ""
            }`}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={`search-input w-[300px] h-full border border-primary-200 rounded-xl font-semibold focus:outline-none text-sm p-3 relative px-[40px] ${
              theme === "dark" ? "bg-[#031021] text-primary-200" : ""
            }`}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`search-input w-[300px] h-full border border-primary-200 rounded-xl font-semibold focus:outline-none text-sm p-3 relative px-[40px] ${
              theme === "dark" ? "bg-[#031021] text-primary-200" : ""
            }`}
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <button
          type="submit"
          className={`mt-4 px-4 py-2 rounded ${
            theme === "dark" ? "bg-primary-600 text-white" : "bg-primary-500 text-black"
          }`}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default AccountSecurity;