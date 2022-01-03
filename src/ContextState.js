import React from "react";
import { useCustomReducer } from "./utils/hooks";
import Context from "./utils/context";
import * as ACTIONS from "./store/actions/actions";
import * as Reducer from "./store/reducers/reducer";
import App from "./App";

const useLogger = process.env.NODE_ENV === "development";

const ContextState = () => {
    const [stateReducer, dispatchReducer] = useCustomReducer(
        Reducer.Reducer,
        Reducer.initialState,
        useLogger
    );

    const handleAddIdea = (cat, val) => {
        dispatchReducer(ACTIONS.thunkedAddIdea(cat, val));
    };

    const handleDeleteIdea = (cat, index) => {
        dispatchReducer(ACTIONS.thunkedDeleteIdea(cat, index));
    };

    const handleSignIn = (user) => {
        dispatchReducer(ACTIONS.thunkedSignIn(user));
    };

    const handleSignOutSuccess = () => {
        dispatchReducer(ACTIONS.signOutSuccess());
    };

    const handleGoogleSignIn = () => {
        dispatchReducer(ACTIONS.googleSignIn());
    };

    const handleSpin = () => {
        dispatchReducer(ACTIONS.thunkedSpin());
    };

    const handleSave = () => {
        dispatchReducer(ACTIONS.thunkedSaveFavorite());
    };

    const handleTextFieldChange = (string) => {
        dispatchReducer(ACTIONS.setTextField(string));
    };

    const handleClear = () => {
        dispatchReducer(ACTIONS.handleClear());
    };

    const handleToggleLock = (category, index) => {
        dispatchReducer(ACTIONS.toggleLockCategory(category, index));
    };

    const handleChangeRating = (id, rating) => {
        dispatchReducer(ACTIONS.thunkedChangeRating(id, rating));
    };

    const handleDeleteFavorite = (id) => {
        dispatchReducer(ACTIONS.thunkedDeleteFavorite(id));
    };

    const handleSetActiveIds = (ids) => {
        dispatchReducer(ACTIONS.thunkedSetActiveIds(ids));
    };

    return (
        <Context.Provider
            value={{
                ideas: stateReducer.ideas,
                user: stateReducer.user,
                selections: stateReducer.selections,
                favorites: stateReducer.favorites,
                session: stateReducer.session,
                handleAddIdea: (cat, val) => handleAddIdea(cat, val),
                handleDeleteIdea: (cat, index) => handleDeleteIdea(cat, index),
                handleSignIn: (user) => handleSignIn(user),
                handleSignOutSuccess: () => handleSignOutSuccess(),
                googleSignIn: () => handleGoogleSignIn(),
                handleSpin: () => handleSpin(),
                handleSave: () => handleSave(),
                handleTextFieldChange: (string) => handleTextFieldChange(string),
                handleClear: () => handleClear(),
                handleToggleLock: (category, index) => handleToggleLock(category, index),
                handleChangeRating: (id, rating) => handleChangeRating(id, rating),
                handleDeleteFavorite: (id) => handleDeleteFavorite(id),
                handleSetActiveIds: (ids) => handleSetActiveIds(ids),
            }}
        >
            <App />
        </Context.Provider>
    );
};

export default ContextState;
