import * as TYPES from './types';

export const addIdea = (string) => ({
    type: TYPES.ADD_IDEA,
    payload: string
});

export const deleteIdea = (number) => ({
    type: TYPES.DELETE_IDEA,
    payload: number
});