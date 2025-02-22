// src/components/MyInfo.jsx
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase/config";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { updatePassword } from "firebase/auth";

const MyInfo = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    age: "",
    address: "",
  });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(collection(db, "customers"), user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserInfo(userDoc.data());
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      try {
        const userDocRef = doc(collection(db, "customers"), user.uid);
        await updateDoc(userDocRef, userInfo);
        setEditing(false);
      } catch (error) {
        console.error("Error updating user info:", error);
      }
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user && newPassword === confirmPassword) {
      try {
        await updatePassword(user, newPassword);
        alert("Password updated successfully!");
        setNewPassword("");
        setConfirmPassword("");
      } catch (error) {
        console.error("Error updating password:", error);
      }
    } else {
      alert("Passwords do not match or user is not authenticated.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">My Info</h2>
      <div className="mb-6 p-6 bg-white border rounded-lg shadow-md">
        <h3 className="text-2xl font-bold mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold">Name</label>
            <input
              type="text"
              value={userInfo.username}
              onChange={(e) =>
                setUserInfo({ ...userInfo, name: e.target.value })
              }
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              disabled={!editing}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Age</label>
            <input
              type="number"
              value={userInfo.age}
              onChange={(e) =>
                setUserInfo({ ...userInfo, age: e.target.value })
              }
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              disabled={!editing}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Address</label>
            <input
              type="text"
              value={userInfo.address}
              onChange={(e) =>
                setUserInfo({ ...userInfo, address: e.target.value })
              }
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              disabled={!editing}
            />
          </div>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="mt-4 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
        >
          {editing ? "Cancel" : "Edit"}
        </button>
        {editing && (
          <button
            onClick={handleUpdateInfo}
            className="ml-2 px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:bg-green-700"
          >
            Save
          </button>
        )}
      </div>
      <div className="p-6 bg-white border rounded-lg shadow-md">
        <h3 className="text-2xl font-bold mb-4">Change Password</h3>
        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default MyInfo;
