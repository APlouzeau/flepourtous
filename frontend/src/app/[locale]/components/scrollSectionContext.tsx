"use client";

import { UseScrollAnimationResponse } from "@/lib/useScrollAnimation";
import { createContext } from "react";

// Context
export type ContextType = {
    scrollRef: UseScrollAnimationResponse
};

export const Context = createContext<ContextType>({} as ContextType);
