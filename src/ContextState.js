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

    const handleSignInStart = () => {
        dispatchReducer(ACTIONS.signInStart());
    }

    const handleSignedInSession = (user) => {
        dispatchReducer(ACTIONS.thunkedSessionSignIn(user))
    }

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

    const handleAcceptList = (id) => {
        dispatchReducer(ACTIONS.thunkedAcceptList(id));
    };

    const handleRejectList = (id) => {
        dispatchReducer(ACTIONS.thunkedRejectList(id));
    };

    const handleShareList = (email, listId) => {
        dispatchReducer(ACTIONS.thunkedShareList(email, listId));
    };

    const handleUnshareList = (email, listId) => {
        dispatchReducer(ACTIONS.thunkedUnshareList(email, listId));
    };

    const handleToggleView = (id) => {
        dispatchReducer(ACTIONS.thunkedToggleVisibleList(id));
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
                handleSignInStart: () => handleSignInStart(),
                handleSignedInSession: (user) => handleSignedInSession(user),
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
                handleAcceptList: (id) => handleAcceptList(id),
                handleRejectList: (id) => handleRejectList(id),
                handleShareList: (email, listId) => handleShareList(email, listId),
                handleUnshareList: (email, listId) => handleUnshareList(email, listId),
                handleToggleView: (id) => handleToggleView(id),
            }}
        >
            <App />
        </Context.Provider>
    );
};

export default ContextState;
