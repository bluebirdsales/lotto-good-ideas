import * as TYPES from "./types";
import { signInWithGoogle } from "../../firebase/firebase_config";
import {
    getDoc,
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    setDoc,
    addDoc,
    collection,
} from "firebase/firestore";
import { db } from "../../firebase/firebase_config";

export const addIdea = (string) => ({
    type: TYPES.ADD_IDEA,
    payload: string,
});

export const deleteIdea = (number) => ({
    type: TYPES.DELETE_IDEA,
    payload: number,
});

export const signInStart = (user) => ({
    type: TYPES.SIGNIN_SUCCESS,
    payload: user,
});

export const signInSuccess = (user) => ({
    type: TYPES.SIGNIN_SUCCESS,
    payload: user,
});

export const signOutSuccess = () => ({
    type: TYPES.SIGNOUT_SUCCESS,
});

export const setStoredIdeas = (array) => ({
    type: TYPES.SET_STORED_IDEAS,
    payload: array,
});

export const thunkedSignIn = (user) => async (dispatch) => {
    dispatch(signInSuccess(user));

    try {
        const docRef = doc(db, `users/${user.uid}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            dispatch(setStoredIdeas(docSnap.data().state.ideas));
        } else {
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                state: {
                    ideas: ["your ideas here..."],
                },
            });
            const newDoc = await getDoc(docRef);
            console.log('data', newDoc.data())
            dispatch(setStoredIdeas(newDoc.data().state.ideas));
        }
    } catch (e) {
        console.log(e);
    }
};

export const googleSignIn = () => async (dispatch) => {
    const user = await signInWithGoogle();
    console.log("user", user);

    dispatch(thunkedSignIn(user));
};

export const thunkedAddIdea = (string) => async (dispatch, getState) => {
    const state = getState();

    if (state.ideas.includes(string)) return; //TODO show warning message

    try {
        const docRef = doc(db, `users/${state.user.uid}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const { ideas } = docSnap.data().state;
            ideas.push(string);
            await updateDoc(docRef, {
                state: {
                    ideas,
                },
            });
            dispatch(setStoredIdeas(ideas));
        }
    } catch (e) {
        console.log(e);
    }
};

export const thunkedDeleteIdea = (index) => async (dispatch, getState) => {
    const state = getState();
    try {
        const docRef = doc(db, `users/${state.user.uid}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const { ideas } = docSnap.data().state;
            const clonedIdeas = [...ideas];
            clonedIdeas.splice(index, 1);
            await updateDoc(docRef, {
                state: {
                    ideas: clonedIdeas,
                },
            });
            dispatch(setStoredIdeas(clonedIdeas));
        }
    } catch (e) {
        console.log(e);
    }
};
