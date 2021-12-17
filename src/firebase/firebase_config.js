import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCRzcrBtSg4KNjdHbBy_pPMXQDBJUHf_GI",
    authDomain: "lotto-app-40d25.firebaseapp.com",
    projectId: "lotto-app-40d25",
    storageBucket: "lotto-app-40d25.appspot.com",
    messagingSenderId: "758249634328",
    appId: "1:758249634328:web:a7d52180124b9b9c90216d",
    measurementId: "G-6KGRSK5NSC",
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
