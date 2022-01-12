import * as TYPES from "./types";
import { signInWithGoogle } from "../../firebase/firebase_config";
import {
    collection,
    getDoc,
    doc,
    updateDoc,
    setDoc,
    Timestamp,
    query,
    where,
    getDocs,
    deleteField,
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

export const signInStart = () => ({
    type: TYPES.SIGNIN_START,
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

export const setSharedLists = (sharedLists) => ({
    type: TYPES.SET_SHARED_LISTS,
    payload: sharedLists,
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

export const setVisibleLists = (visibleLists) => ({
    type: TYPES.SET_VISIBLE_LISTS,
    payload: visibleLists,
});

export const thunkedSignIn = (user) => async (dispatch) => {
    dispatch(signInSuccess(user));

    try {
        const userRef = doc(db, `users/${user.uid}`);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const { favorites, session } = userSnap.data();

            const ownLists = await getOwnLists(user.uid);

            const sharedLists = await getSharedLists(user.uid);

            dispatch(setStoredIdeas(ownLists));
            dispatch(setSharedLists(sharedLists));
            dispatch(saveSuccess(favorites));
            dispatch(setSession(session));
        } else {
            const listRef = doc(collection(db, "lists"));
            await setDoc(listRef, {
                ideas: initialState.ideas.myLists.placeholder,
                name: "",
                owner: { uid: user.uid, email: user.email },
                sharedWith: {},
                updated: Timestamp.now(),
            });
            const listSnap = await getDoc(listRef);
            if (listSnap.exists()) {
                await setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    favorites: initialState.favorites.savedIdeas,
                    session: {
                        activeIds: [],
                        visibleLists: {
                            [listSnap.id]: {
                                show: true,
                            },
                        },
                    },
                });
                const newUser = await getDoc(userRef);
                dispatch(setVisibleLists(newUser.data().session.visibleLists));

                const ownLists = await getOwnLists(user.uid);

                dispatch(setStoredIdeas(ownLists));
            }
        }
    } catch (e) {
        console.log(e);
    }
};

export const thunkedSessionSignIn = (user) => async (dispatch, getState) => {
    dispatch(signInSuccess(user));

    try {
        const userRef = doc(db, `users/${user.uid}`);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const { favorites, session } = userSnap.data();

            const ownLists = await getOwnLists(user.uid);

            const sharedLists = await getSharedLists(user.uid);

            dispatch(setStoredIdeas(ownLists));
            dispatch(setSharedLists(sharedLists));
            dispatch(saveSuccess(favorites));
            dispatch(setSession(session));
        }
    } catch (e) {
        console.log(e);
    }
};

const getOwnLists = async (uid) => {
    const listsRef = collection(db, `lists`);
    const own = query(listsRef, where("owner.uid", "==", uid));

    const querySnapshotOwnList = await getDocs(own);
    if (querySnapshotOwnList.docs[0].exists()) {
        const listId = querySnapshotOwnList.docs[0].id;
        const { ideas, sharedWith } = querySnapshotOwnList.docs[0].data();
        const { category1, category2 } = ideas;

        return {
            [listId]: {
                sharedWith,
                category1,
                category2,
            },
        };
    }
    return initialState.ideas.myLists.placeholder;
};

const getSharedLists = async (uid) => {
    const listsRef = collection(db, `lists`);

    const shared = query(listsRef, where(`sharedWith.${uid}`, "!=", false));
    const querySnapshotShared = await getDocs(shared);
    const sharedLists = {};

    querySnapshotShared.forEach((doc) => {
        const { owner, ideas, sharedWith } = doc.data();
        const { category1, category2 } = ideas;
        const { accepted, level } = sharedWith[uid];
        sharedLists[doc.id] = {
            category1,
            category2,
            owner: owner.email,
            accepted,
            level,
        };
    });
    return sharedLists;
};

export const googleSignIn = () => async (dispatch) => {
    try {
        const user = await signInWithGoogle();
        dispatch(signInStart());
        dispatch(thunkedSignIn(user));
    } catch (e) {
        console.log(e);
        dispatch(signOutSuccess());
    }
};

export const thunkedAddIdea = (category, value) => async (dispatch, getState) => {
    const state = getState();

    // if (state.ideas.myLists[???][category].entries.includes(value)) return; // block repeat entries?

    try {
        const listsRef = collection(db, `lists`);
        const q = query(listsRef, where("owner.uid", "==", state.user.uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.docs[0].exists()) {
            const { entries } = querySnapshot.docs[0].data().ideas[category];
            entries.push(value);

            await updateDoc(querySnapshot.docs[0].ref, {
                [`ideas.${category}.entries`]: entries,
            });

            const ownLists = await getOwnLists(state.user.uid);
            dispatch(setStoredIdeas(ownLists));
        }
    } catch (e) {
        console.log(e);
    }
};

export const thunkedDeleteIdea = (category, index) => async (dispatch, getState) => {
    const { user } = getState();
    try {
        const listsRef = collection(db, `lists`);
        const q = query(listsRef, where("owner.uid", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.docs[0].exists()) {
            const { entries } = querySnapshot.docs[0].data().ideas[category];
            const clonedEntries = [...entries];
            clonedEntries.splice(index, 1);
            await updateDoc(querySnapshot.docs[0].ref, {
                [`ideas.${category}.entries`]: clonedEntries,
            });

            const ownLists = await getOwnLists(user.uid);
            dispatch(setStoredIdeas(ownLists));
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
                let compiledList = [];

                for (let key in state.ideas.myLists) {
                    if (state.session.visibleLists?.[key]?.show) {
                        compiledList = [...state.ideas.myLists[key][category].entries];
                    }
                }
                for (let key in state.ideas.sharedLists) {
                    if (
                        state.ideas.sharedLists?.[key]?.accepted &&
                        state.session.visibleLists?.[key]?.show
                    ) {
                        compiledList = [
                            ...compiledList,
                            ...state.ideas.sharedLists[key][category].entries,
                        ];
                    }
                }

                newSelections[category][index].result = randomlySelect(compiledList);
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
                "session.activeIds": ids,
            };
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

export const thunkedAcceptList = (id) => async (dispatch, getState) => {
    const { user } = getState();
    try {
        const docRef = doc(db, `lists/${id}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            await updateDoc(docRef, {
                [`sharedWith.${user.uid}.accepted`]: true,
            });
            const userRef = doc(db, `users/${user.uid}`);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                await updateDoc(userRef, {
                    [`session.visibleLists.${id}`]: {
                        show: true,
                    },
                });

                const newSnap = await getDoc(userRef);
                if (newSnap.exists()) {
                    const { visibleLists } = newSnap.data().session;
                    dispatch(setVisibleLists(visibleLists));

                    const sharedLists = await getSharedLists(user.uid);
                    dispatch(setSharedLists(sharedLists));
                }
            }
        }
    } catch (e) {
        console.log(e);
    }
};

export const thunkedRejectList = (id) => async (dispatch, getState) => {
    const { user } = getState();
    try {
        const docRef = doc(db, `lists/${id}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            await updateDoc(docRef, {
                [`sharedWith.${user.uid}`]: deleteField(),
            });

            const sharedLists = await getSharedLists(user.uid);
            dispatch(setSharedLists(sharedLists));
        }
    } catch (e) {
        console.log(e);
    }
};

export const thunkedShareList = (email, listId) => async (dispatch, getState) => {
    const { user } = getState();
    if (email === user.email) return;
    try {
        const usersRef = collection(db, `users`);
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.docs[0].exists()) {
            const docRef = doc(db, `lists/${listId}`);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                await updateDoc(docRef, {
                    [`sharedWith.${querySnapshot.docs[0].id}`]: {
                        email,
                        accepted: false,
                        level: "view",
                    },
                });
                const ownLists = await getOwnLists(user.uid);
                dispatch(setStoredIdeas(ownLists));
            }
        }
    } catch (e) {
        console.log(e);
    }
};

export const thunkedUnshareList = (email, listId) => async (dispatch, getState) => {
    const { user } = getState();
    try {
        const usersRef = collection(db, `users`);
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.docs[0].exists()) {
            const docRef = doc(db, `lists/${listId}`);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                await updateDoc(docRef, {
                    [`sharedWith.${querySnapshot.docs[0].id}`]: deleteField(),
                });

                const userRef = doc(db, `users/${querySnapshot.docs[0].id}`);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    await updateDoc(userRef, {
                        [`session.visibleLists.${listId}`]: deleteField(),
                    });
                }

                const ownLists = await getOwnLists(user.uid);

                dispatch(setStoredIdeas(ownLists));
            }
        }
    } catch (e) {
        console.log(e);
    }
};

export const thunkedToggleVisibleList = (listId) => async (dispatch, getState) => {
    const { user } = getState();
    try {
        const docRef = doc(db, `users/${user.uid}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const { show } = docSnap.data().session.visibleLists[listId];
            await updateDoc(docRef, {
                [`session.visibleLists.${listId}.show`]: !show,
            });

            const newSnap = await getDoc(docRef);
            if (newSnap.exists()) {
                const { visibleLists } = newSnap.data().session;
                dispatch(setVisibleLists(visibleLists));
            }
        }
    } catch (e) {
        console.log(e);
    }
};
