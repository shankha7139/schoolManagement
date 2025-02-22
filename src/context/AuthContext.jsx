import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase/config";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Register new user
  const register = async (email, password, username, phone) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUser = userCredential.user;

      // Update Firebase Auth profile
      await updateProfile(newUser, { displayName: username });

      // Send verification email
      await sendEmailVerification(newUser);

      // Create user document in Firestore
      try {
        await setDoc(doc(db, "customers", newUser.uid), {
          username,
          email,
          phone,
          emailVerified: false,
          joinedAt: serverTimestamp(),
          uid: newUser.uid,
          role: "user", // Add a default role
        });
      } catch (firestoreError) {
        console.error("Firestore error:", firestoreError);
        // If Firestore fails, delete the auth user to maintain consistency
        await newUser.delete();
        throw new Error("Failed to create user profile. Please try again.");
      }

      console.log("User registered successfully");
      return userCredential;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const loggedInUser = userCredential.user;

      if (loggedInUser.emailVerified) {
        try {
          const userRef = doc(db, "customers", loggedInUser.uid);
          await updateDoc(userRef, { emailVerified: true });
        } catch (firestoreError) {
          console.error(
            "Error updating email verification status:",
            firestoreError
          );
          // Continue since this is not critical
        }
      }

      return userCredential;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          const userRef = doc(db, "customers", currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            if (currentUser.emailVerified && !userData.emailVerified) {
              try {
                await updateDoc(userRef, { emailVerified: true });
              } catch (updateError) {
                console.error(
                  "Error updating email verification:",
                  updateError
                );
              }
            }
            setUser({ ...currentUser, ...userData });
          } else {
            setUser(currentUser);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
        setUser(null);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
