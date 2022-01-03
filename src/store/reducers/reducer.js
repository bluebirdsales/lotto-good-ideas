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
        category1: [{ locked: false, result: "" }],
        category2: [{ locked: false, result: "" }, { locked: false, result: "" }],
    },
    favorites: {
        textField: "",
        saving: false,
        deleting: false,
        savedIdeas: {
            "da67d2f1-adeb-4b6d-8bdb-71d022691749": {
                idea: "a pretty good idea...",
                rating: 4,
                category1: [""],
                category2: ["", ""],
                created: {
                    nanoseconds: 0,
                    seconds: 1640199289,
                },
            },
        },
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
        case TYPES.SET_TEXTFIELD:
            return {
                ...state,
                favorites: {
                    ...state.favorites,
                    textField: action.payload,
                },
            };
        case TYPES.CLEAR_TEXTFIELD:
            return {
                ...state,
                favorites: {
                    ...state.favorites,
                    textField: "",
                },
            };
        case TYPES.SAVE_START:
            return {
                ...state,
                favorites: {
                    ...state.favorites,
                    saving: true,
                },
            };
        case TYPES.SAVE_SUCCESS:
            return {
                ...state,
                favorites: {
                    savedIdeas: action.payload,
                    saving: false,
                    textField: "",
                    deleting: false,
                },
            };
        case TYPES.DELETE_FAVORITE_START:
            return {
                ...state,
                favorites: {
                    ...state.favorites,
                    deleting: true,
                }
            };
        case TYPES.DELETE_FAVORITE_FAILURE:
            return {
                ...state,
                favorites: {
                    ...state.favorites,
                    deleting: false,
                }
            };
        case TYPES.TOGGLE_LOCK_CATEGORY:
            const { category, index } = action.payload;
            const clonedState = {...state};
            clonedState.selections[category][index].locked = !clonedState.selections[category][index].locked
            return clonedState;
        default:
            return state;
    }
};
