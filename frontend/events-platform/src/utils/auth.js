import { auth } from "../firebase/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export const signUp = async (email, password) => {
  try {
    console.log("calling Firebase signUp:", { email, password });
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("calling Firebase successful:", userCredential);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.log("Firebase signUp error:", error.message);
    return { success: false, error: error.message };
  }
};

export const logIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.essage };
  }
};
