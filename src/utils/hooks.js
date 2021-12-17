import { useCallback, useMemo, useReducer, useRef } from "react";

export function useCustomReducer(reducerFunction, initialState, enableLogger) {
    const [state, dispatch] = useReducer(reducerFunction, initialState);

    const prevState = useRef();

    const dispatchWithLogger = useCallback((action) => {
        if (typeof action === "function") return action(dispatchWithLogger, () => prevState.current.state);

        const actionType = typeof action === "object" ? action.type : action;

        prevState.current.actions = prevState.current.actions || [];
        prevState.current.actions.push({ actionType, action });

        prevState.current = { ...prevState.current, actionType, action };

        dispatch(action);
    }, []);

    // const customDispatch = enableLogger ? dispatchWithLogger : dispatch;

    useMemo(
        function logStateAfterChange() {
            if (!enableLogger || !prevState.current) return;

            for (let i = 0; i < prevState.current.actions.length; i++) {
                const { actionType, state: previousState, action } = prevState.current;
                console.groupCollapsed(`${actionType}`);
                console.log("%c Previous State", "color: red", previousState);
                console.log("%c Action", "color: blue", action);
                console.log("%c Current State", "color: green", state);
                console.groupEnd();
            }

        prevState.current.actions = [];
        },
        [state, enableLogger]
    );

    prevState.current = { ...prevState.current, state };

    return [state, dispatchWithLogger];
}
