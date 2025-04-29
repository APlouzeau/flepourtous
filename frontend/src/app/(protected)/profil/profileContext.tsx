"use client";

import { userDataProps } from "@/app/types/userData";
import { createContext, Dispatch, SetStateAction, ReactNode, useState } from "react";

// Context
export type ContextType = {
    dataUser: userDataProps | null;
    setDataUser: Dispatch<SetStateAction<userDataProps | null>>;
};

export const Context = createContext<ContextType>({} as ContextType);

// Provider
type ProviderProps = {
    children: ReactNode;
    initialUser?: userDataProps | null;
};

export default function Provider({ children, initialUser = null }: ProviderProps) {
    const [dataUser, setDataUser] = useState(initialUser);

    // Objet valeur à fournir aux enfants
    const value = { dataUser, setDataUser };

    return <Context.Provider value={value}>{children}</Context.Provider>;
}
