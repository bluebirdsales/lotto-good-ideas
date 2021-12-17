import React from "react";
import { useCustomReducer } from './utils/hooks';
import Context from "./utils/context";
import * as ACTIONS from "./store/actions/actions";
import * as Reducer from "./store/reducers/reducer";
import App from "./App";



const ContextState = () => {
    const [stateReducer, dispatchReducer] = useCustomReducer(Reducer.Reducer, Reducer.initialState, true);

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
    }

    const handleGoogleSignIn = () => {
        dispatchReducer(ACTIONS.googleSignIn())
    }

    const handleSpin = () => {
        dispatchReducer(ACTIONS.thunkedSpin())
    }

    return (
        <Context.Provider
            value={{
                ideas: stateReducer.ideas,
                user: stateReducer.user,
                selections: stateReducer.selections,
                handleAddIdea: (cat, val) => handleAddIdea(cat, val),
                handleDeleteIdea: (cat, index) => handleDeleteIdea(cat, index),
                handleSignIn: (user) => handleSignIn(user),
                handleSignOutSuccess: () => handleSignOutSuccess(),
                googleSignIn: () => handleGoogleSignIn(),
                handleSpin: () => handleSpin(),
            }}
        >
            <App />
        </Context.Provider>
    );
};

export default ContextState;
