import * as TYPES from "../actions/types";

export const initialState = {
    ideas: ["your ideas here"],
    user: null,
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
            clonedIdeas.splice(action.payload, 1);
            return {
                ...state,
                ideas: [...clonedIdeas],
            };
        case TYPES.SET_STORED_IDEAS:
            return {
                ...state,
                ideas: action.payload,
            };
        case TYPES.SIGNIN_SUCCESS:
            return {
                ...state,
                user: action.payload,
            };
        case TYPES.SIGNOUT_SUCCESS:
            return {
                ...initialState
            };
        default:
            return state;
    }
};
