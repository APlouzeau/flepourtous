"use client";

import { UserDataProps } from "@/app/[locale]/types/userData";
import { createContext, Dispatch, SetStateAction } from "react";

// Context
export type ContextType = {
    dataUser: UserDataProps | null;
    setDataUser: Dispatch<SetStateAction<UserDataProps | null>>;
};

export const Context = createContext<ContextType>({} as ContextType);
