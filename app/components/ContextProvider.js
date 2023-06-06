import React, { createContext, useState, useRef } from "react";

export const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
    const [tracked, setTracked] = useState([]);
    const [intValue, setIntValue] = useState(3);
    const [inc, onChangeInc] = useState("5");
    const [movement, setMovement] = useState([
        { label: "Bench Press", value: "Bench Press" },
        { label: "Squat", value: "Squat" },
        { label: "Deadlift", value: "Deadlift" },
        { label: "Shoulder Press", value: "Shoulder Press" },
    ]);
    const [repRange, setRepRange] = useState([
        { label: "1 rep max", value: [1, 1] },
        { label: "2-5", value: [2, 5] },
        { label: "6-9", value: [6, 9] },
        { label: "10-13", value: [10, 13] },
        { label: "14-17", value: [14, 17] },
        { label: "18-21", value: [18, 21] },
    ]);
    const firstMount = useRef(false);

    return (
        <MyContext.Provider
            value={{
                tracked,
                setTracked,
                intValue,
                setIntValue,
                inc,
                onChangeInc,
                movement,
                setMovement,
                firstMount,
                repRange,
                setRepRange,
            }}
        >
            {children}
        </MyContext.Provider>
    );
};
