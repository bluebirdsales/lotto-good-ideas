import React from "react";
import { useCustomReducer } from './utils/hooks';
import Context from "./utils/context";
import * as ACTIONS from "./store/actions/actions";
import * as Reducer from "./store/reducers/reducer";
import App from "./App";



const ContextState = () => {
    const [stateReducer, dispatchReducer] = useCustomReducer(Reducer.Reducer, Reducer.initialState, true);

    const handleAddIdea = (string) => {
        dispatchReducer(ACTIONS.thunkedAddIdea(string));
    };

    const handleDeleteIdea = (number) => {
        dispatchReducer(ACTIONS.thunkedDeleteIdea(number));
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

    return (
        <Context.Provider
            value={{
                ideas: stateReducer.ideas,
                user: stateReducer.user,
                handleAddIdea: (string) => handleAddIdea(string),
                handleDeleteIdea: (index) => handleDeleteIdea(index),
                handleSignIn: (user) => handleSignIn(user),
                handleSignOutSuccess: () => handleSignOutSuccess(),
                googleSignIn: () => handleGoogleSignIn(),
            }}
        >
            <App />
        </Context.Provider>
    );
};

export default ContextState;
