import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
} from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_API_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const auth = getAuth();

export const signInWithGoogle = async () => {
    return new Promise((resolve, reject) => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });

        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // ...
                resolve(user);
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
                reject(errorMessage);
            });
    });
};

export const logout = () => {
    return new Promise((res, rej) => {
        signOut(auth)
            .then(() => {
                res("success");
            })
            .catch((e) => {
                rej(e);
            });
    });
};
