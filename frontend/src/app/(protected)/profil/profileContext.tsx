"use client";

import { UserDataProps } from "@/app/types/userData";
import { createContext, Dispatch, SetStateAction, ReactNode, useState } from "react";

// Context
export type ContextType = {
    dataUser: UserDataProps | null;
    setDataUser: Dispatch<SetStateAction<UserDataProps | null>>;
};

export const Context = createContext<ContextType>({} as ContextType);

// Provider
type ProviderProps = {
    children: ReactNode;
    initialUser?: UserDataProps | null;
};

export default function Provider({ children, initialUser = null }: ProviderProps) {
    const [dataUser, setDataUser] = useState(initialUser);

    // Objet valeur à fournir aux enfants
    const value = { dataUser, setDataUser };
    console.log("Provider initialized with user data:", initialUser);

    return <Context.Provider value={value}>{children}</Context.Provider>;
}
