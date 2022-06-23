// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId,
} from '@env';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBx3ut6E34HNnG8wfHlZzZ7SfdpUaVptoc",
    authDomain: "randomproject-ba40e.firebaseapp.com",
    projectId: "randomproject-ba40e",
    storageBucket: "randomproject-ba40e.appspot.com",
    messagingSenderId: "48764125457",
    appId: "1:48764125457:web:b8ac2dac3611d8fdca0cb0",
};

// Initialize Firebase
// https://firebase.google.com/docs/web/setup
// https://docs.expo.dev/guides/using-firebase/
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore(app);
// const functions = require("firebase-functions");

// exports.newUser = functions.auth.user().onCreate((user) => {
//     return db
//     .collection("user")
//     .doc(user.uid)
//     .create(JSON.parse(JSON.stringify(user)))
// })

export { auth, db };
