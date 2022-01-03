import * as TYPES from "./types";
import { signInWithGoogle } from "../../firebase/firebase_config";
import { getDoc, doc, updateDoc, setDoc, Timestamp } from "firebase/firestore";
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

export const toggleLockCategory = (category, index) => ({
    type: TYPES.TOGGLE_LOCK_CATEGORY,
    payload: { category, index },
});

export const setSession = (session) => ({
    type: TYPES.SET_SESSION,
    payload: session,
});

export const setActiveIds = (ids) => ({
    type: TYPES.SET_ACTIVE_IDS,
    payload: ids,
});

export const thunkedSignIn = (user) => async (dispatch) => {
    console.log("user", user);
    dispatch(signInSuccess(user));

    try {
        const docRef = doc(db, `users/${user.uid}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const { favorites, state, session } = docSnap.data();
            dispatch(setStoredIdeas(state.ideas));
            dispatch(saveSuccess(favorites));
            dispatch(setSession(session));
        } else {
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                state: {
                    ideas: initialState.ideas,
                },
                favorites: initialState.favorites.savedIdeas,
                session: initialState.session,
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
    const { selections } = state;

    const prevSelections = state.selections;

    const randomlySelect = (array) => {
        return array[Math.floor(Math.random() * array.length)];
    };

    const newSelections = { ...prevSelections };

    Object.keys(newSelections).forEach((category) => {
        selections[category].forEach((el, index) => {
            if (!el.locked) {
                newSelections[category][index].result = randomlySelect(
                    state.ideas[category].entries
                );
            }
        });
    });

    dispatch(setSelections(newSelections));
};

export const thunkedSetActiveIds = (ids) => async (dispatch, getState) => {
    //update local state first, later undo change if request fails
    const state = getState();
    dispatch(setActiveIds(ids));

    try {
        const docRef = doc(db, `users/${state.user.uid}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const activeIds = {
                "session.activeIds": ids
            }
            await updateDoc(docRef, activeIds);
        }
    } catch (e) {
        //restore activeIds on failed request
        dispatch(setActiveIds(state.session.activeIds));
    }
};

export const thunkedSaveFavorite = () => async (dispatch, getState) => {
    dispatch(saveStart());

    const state = getState();

    try {
        const docRef = doc(db, `users/${state.user.uid}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const newFavorite = {
                [`favorites.${uuidv4()}`]: {
                    idea: state.favorites.textField,
                    rating: 0,
                    category1: [state.selections.category1[0].result],
                    category2: [
                        state.selections.category2[0].result,
                        state.selections.category2[1].result,
                    ],
                    created: Timestamp.now(),
                },
            };
            await updateDoc(docRef, newFavorite);
            const updatedDocSnap = await getDoc(docRef);
            dispatch(saveSuccess(updatedDocSnap.data().favorites));
        }
    } catch (e) {
        console.log(e);
    }
};

export const thunkedDeleteFavorite = (id) => async (dispatch, getState) => {
    dispatch(saveStart());

    const state = getState();
    try {
        const docRef = doc(db, `users/${state.user.uid}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const { favorites } = docSnap.data();
            const filteredFavorites = Object.keys(favorites).reduce((acc, cur) => {
                if (cur !== id) {
                    acc[cur] = favorites[cur];
                }
                return acc;
            }, {});
            await updateDoc(docRef, { favorites: filteredFavorites });
            const updatedDocSnap = await getDoc(docRef);
            dispatch(saveSuccess(updatedDocSnap.data().favorites));

            //cleanup activeIds in localStorage
            const activeIds = JSON.parse(window.localStorage.getItem("activeIds"));
            const idIndex = activeIds.indexOf(id);
            if (idIndex >= 0) {
                activeIds.splice(idIndex, 1);
                window.localStorage.setItem("activeIds", JSON.stringify(activeIds));
            }
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
