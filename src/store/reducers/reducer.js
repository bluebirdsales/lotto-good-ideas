import * as TYPES from "../actions/types";

export const initialState = {
    ideas: ["poopoo pee pee"],
};

export const Reducer = (state = initialState, action) => {
    switch (action.type) {
        case TYPES.ADD_IDEA:
            return {
                ...state,
                ideas: [...state.ideas, action.payload],
            };
        case TYPES.DELETE_IDEA:
            const clonedIdeas = [...state.ideas];
            clonedIdeas.splice(action.payload, 1)
            return {
                ...state,
                ideas: [...clonedIdeas]
            }
        default:
            return state;
    }
};
