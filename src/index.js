import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { Grommet } from "grommet";
import ContextState from './ContextState';

const theme = {
    global: {
        colors: {
            primary: "#635380",
            secondary: "#A8D0DB",
            alert: "#FB5012",
            tertiary: "#F2C57C",
            "off-white": "#EEEEFF",
            "light-2": "#f5f5f5",
            text: {
                light: "rgba(0, 0, 0, 0.87)",
            },
        },
        edgeSize: {
            small: "14px",
        },
        elevation: {
            light: {
                medium: "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)",
            },
        },
        font: {
            family: "Roboto",
            size: "14px",
            height: "20px",
        },
    },
};

ReactDOM.render(
    <React.StrictMode>
        <Grommet theme={theme}>
            <ContextState />
        </Grommet>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
