// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCSZfVLsZatiiTFe6lMloD8TVWvkCmGjsk",
    authDomain: "nutri-140b8.firebaseapp.com",
    projectId: "nutri-140b8",
    storageBucket: "nutri-140b8.firebasestorage.app",
    messagingSenderId: "690346833947",
    appId: "1:690346833947:web:5c8f6eac58333888a460be",
    measurementId: "G-LZW5PKV1L5"
  };

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);

// Initialize Firebase Auth with Async Storage for React Native
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Firestore
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
