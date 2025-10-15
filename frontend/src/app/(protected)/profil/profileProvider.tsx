"use client";

import { UserDataProps } from "@/app/types/userData";
import { ReactNode, useState } from "react";
import { Context } from "./profileContext";

// Provider
type ProviderProps = {
    children: ReactNode;
    initialUser?: UserDataProps | null;
};

export default function Provider({ children, initialUser = null }: ProviderProps) {
    const [dataUser, setDataUser] = useState(initialUser);

    // Objet valeur à fournir aux enfants
    const value = { dataUser, setDataUser };

    return <Context.Provider value={value}>{children}</Context.Provider>;
}
