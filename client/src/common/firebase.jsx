import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCJb7xA3a9lhj5F5Cdf2-Y4MZPNyj4Y_jw",
  authDomain: "blogapp-bdcc8.firebaseapp.com",
  projectId: "blogapp-bdcc8",
  storageBucket: "blogapp-bdcc8.appspot.com",
  messagingSenderId: "365750264382",
  appId: "1:365750264382:web:f2ca9fae35bfb9e773676f",
};

const app = initializeApp(firebaseConfig);

// Google Auth

const provider = new GoogleAuthProvider();
const auth = getAuth();

export const authWithGoogle = async () => {
  let user = null;

  await signInWithPopup(auth, provider)
    .then((result) => {
      user = result.user;
    })
    .catch((err) => {
      console.log(err);
    });
  return user;
};
