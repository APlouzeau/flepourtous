"use client";

import { useContext } from "react";
import { Context } from "./provider";

export default function Toggle() {
    const { setIsOpen } = useContext(Context);

    const handleClick = async () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <div>
            <button type="button" onClick={handleClick}>
                Toggle
            </button>
        </div>
    );
}
