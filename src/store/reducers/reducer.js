import * as TYPES from "../actions/types";
import { v4 as uuidv4 } from "uuid";

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
        category1: {
            locked: false,
            results: [""],
        },
        category2: {
            locked: false,
            results: ["", ""],
        },
    },
    favorites: {
        textField: "",
        saving: false,
        savedIdeas: {
            "da67d2f1-adeb-4b6d-8bdb-71d022691749": {
                idea: "a pretty good idea...",
                rating: 4,
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
                },
            };
        case TYPES.TOGGLE_LOCK_CATEGORY:
            return {
                ...state,
                selections: {
                    ...state.selections,
                    [action.payload]: {
                        ...state.selections[action.payload],
                        locked: !state.selections[action.payload].locked,
                    },
                },
            };
        default:
            return state;
    }
};
