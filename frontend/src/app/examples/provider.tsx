"use client";

import { createContext, Dispatch, SetStateAction, ReactNode, useState } from "react";

// Context
export type ContextType = {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const Context = createContext<ContextType>({} as ContextType);

// Provider
type ProviderProps = {
    children: ReactNode;
};

export default function Provider(props: ProviderProps) {
    const { children } = props;

    const [isOpen, setIsOpen] = useState(false);

    // Objet valeur à fournir aux enfants
    const value = { isOpen, setIsOpen };

    return <Context.Provider value={value}>{children}</Context.Provider>;
}
