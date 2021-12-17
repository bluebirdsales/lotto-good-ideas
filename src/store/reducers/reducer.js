import * as TYPES from "../actions/types";

export const initialState = {
    ideas: {
        category1: {
            name: "",
            entries: ["your ideas here..."],
        },
        category2: {
            name: "",
            entries: ["your ideas here..."],
        },
    },
    selections: {
        category1: [""],
        category2: ["", ""],
    },
    user: null,
};

export const Reducer = (state = initialState, action) => {
    switch (action.type) {
        case TYPES.UPDATE_CATEGORY:
            return {
                ...state,
                ideas: {
                    ...state.ideas,
                    [action.payload.category]: {
                        ...state.ideas[action.payload.category],
                        entries: action.payload.entries,
                    },
                },
            };
        // case TYPES.DELETE_IDEA:
        //     const clonedIdeas = [...state.ideas];
        //     clonedIdeas.splice(action.payload, 1);
        //     return {
        //         ...state,
        //         ideas: [...clonedIdeas],
        //     };
        case TYPES.SET_STORED_IDEAS:
            return {
                ...state,
                ideas: action.payload,
            };
        case TYPES.SET_SELECTIONS:
            return {
                ...state,
                selections: action.payload,
            };
        case TYPES.SIGNIN_SUCCESS:
            return {
                ...state,
                user: action.payload,
            };
        case TYPES.SIGNOUT_SUCCESS:
            return {
                ...initialState,
            };
        default:
            return state;
    }
};
