// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBij-e9YUI321ll2Uk1cRnr0wU_u6eMiZk",
    authDomain: "sourcexpet.firebaseapp.com",
    projectId: "sourcexpet",
    storageBucket: "sourcexpet.appspot.com",
    messagingSenderId: "316123300602",
    appId: "1:316123300602:web:e107a1b17690c2e4eeff43",
    measurementId: "G-8E8W3VNMYV"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage, ref, uploadBytes, getDownloadURL };
