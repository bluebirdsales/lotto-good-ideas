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
import { initialState } from "../reducers/reducer";
import { v4 as uuidv4 } from "uuid";

export const updateCategory = (category, entries) => ({
    type: TYPES.UPDATE_CATEGORY,
    payload: { category, entries },
});

// export const deleteIdea = (number) => ({
//     type: TYPES.DELETE_IDEA,
//     payload: number,
// });

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

export const setStoredIdeas = (ideas) => ({
    type: TYPES.SET_STORED_IDEAS,
    payload: ideas,
});

export const setSelections = (selections) => ({
    type: TYPES.SET_SELECTIONS,
    payload: selections,
});

export const setTextField = (string) => ({
    type: TYPES.SET_TEXTFIELD,
    payload: string,
});

export const handleClear = () => ({
    type: TYPES.CLEAR_TEXTFIELD,
});

export const saveStart = () => ({
    type: TYPES.SAVE_START,
});

export const saveSuccess = (savedIdeas) => ({
    type: TYPES.SAVE_SUCCESS,
    payload: savedIdeas,
});

export const saveFailure = () => ({
    type: TYPES.SAVE_FAILURE,
});

export const toggleLockCategory = (category) => ({
    type: TYPES.TOGGLE_LOCK_CATEGORY,
    payload: category,
});

export const thunkedSignIn = (user) => async (dispatch) => {
    dispatch(signInSuccess(user));

    try {
        const docRef = doc(db, `users/${user.uid}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            dispatch(setStoredIdeas(docSnap.data().state.ideas));
            dispatch(saveSuccess(docSnap.data().favorites));
        } else {
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                state: {
                    ideas: initialState.ideas,
                },
            });
            const newDoc = await getDoc(docRef);
            dispatch(setStoredIdeas(newDoc.data().state.ideas));
        }
    } catch (e) {
        console.log(e);
    }
};

export const googleSignIn = () => async (dispatch) => {
    const user = await signInWithGoogle();
    dispatch(thunkedSignIn(user));
};

export const thunkedAddIdea = (category, value) => async (dispatch, getState) => {
    const state = getState();

    if (state.ideas[category].entries.includes(value)) return; //TODO show warning message

    try {
        const docRef = doc(db, `users/${state.user.uid}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const { entries } = docSnap.data().state.ideas[category];
            entries.push(value);
            await updateDoc(docRef, {
                [`state.ideas.${category}.entries`]: entries,
            });
            dispatch(updateCategory(category, entries));
        }
    } catch (e) {
        console.log(e);
    }
};

export const thunkedDeleteIdea = (category, index) => async (dispatch, getState) => {
    const state = getState();
    try {
        const docRef = doc(db, `users/${state.user.uid}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const { entries } = docSnap.data().state.ideas[category];
            const clonedEntries = [...entries];
            clonedEntries.splice(index, 1);
            await updateDoc(docRef, {
                [`state.ideas.${category}.entries`]: clonedEntries,
            });
            dispatch(updateCategory(category, clonedEntries));
        }
    } catch (e) {
        console.log(e);
    }
};

export const thunkedSpin = () => (dispatch, getState) => {
    const state = getState();

    const prevSelections = state.selections;

    const randomlySelect = (array) => {
        return array[Math.floor(Math.random() * array.length)];
    };

    const newSelections = { ...prevSelections };

    Object.keys(newSelections).forEach((category) => {
        if (!state.selections[category].locked) {
            const selects = [];
            for (let i = 0; i < newSelections[category].results.length; i++) {
                selects.push(randomlySelect(state.ideas[category].entries));
            }
            newSelections[category].results = selects;
        }
    });

    dispatch(setSelections(newSelections));
};

export const thunkedSaveFavorite = () => async (dispatch, getState) => {
    dispatch(saveStart());

    const state = getState();

    try {
        const docRef = doc(db, `users/${state.user.uid}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            await updateDoc(docRef, {
                [`favorites.${uuidv4()}`]: {
                    idea: state.favorites.textField,
                    rating: 0,
                },
            });
            const updatedDocSnap = await getDoc(docRef);
            dispatch(saveSuccess(updatedDocSnap.data().favorites));
        }
    } catch (e) {
        console.log(e);
    }
};

export const thunkedChangeRating = (id, newRating) => async (dispatch, getState) => {
    const state = getState();

    try {
        const docRef = doc(db, `users/${state.user.uid}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const { favorites } = docSnap.data();
            const newFavorites = {
                ...favorites,
                [id]: {
                    ...favorites[id],
                    rating: newRating,
                },
            };
            await updateDoc(docRef, {
                favorites: newFavorites,
            });
            const updatedDocSnap = await getDoc(docRef);
            dispatch(saveSuccess(updatedDocSnap.data().favorites));
        }
    } catch (e) {
        console.log(e);
    }
};
