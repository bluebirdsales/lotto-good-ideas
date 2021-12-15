import React, { useReducer } from "react";
import Context from "./utils/context";
import * as ACTIONS from "./store/actions/actions";
import * as Reducer from "./store/reducers/reducer";
import App from "./App";

const ContextState = () => {
  const [stateReducer, dispatchReducer] = useReducer(
    Reducer.Reducer,
    Reducer.initialState
  );

  const handleAddIdea = (string) => {
    dispatchReducer(ACTIONS.addIdea(string));
  };

  const handleDeleteIdea = (number) => {
    dispatchReducer(ACTIONS.deleteIdea(number));
  };

  return (
    <Context.Provider
      value={{
        ideas: stateReducer.ideas,
        handleAddIdea: (string) => handleAddIdea(string),
        handleDeleteIdea: (index) => handleDeleteIdea(index),
      }}
    >
      <App />
    </Context.Provider>
  );
};

export default ContextState;