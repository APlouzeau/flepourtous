"use client";

import { createContext, Dispatch, SetStateAction } from "react";

// Context
export type ContextType = {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const Context = createContext<ContextType>({} as ContextType);
