"use client";

import { ReactNode } from "react";
import { Context } from "./scrollSectionContext";
import { UseScrollAnimationResponse } from "@/lib/useScrollAnimation";

// Provider
type ProviderProps = {
    scrollRef: UseScrollAnimationResponse;
    children: ReactNode;
};

export default function Provider(props: ProviderProps) {
    const { scrollRef, children } = props;

    // Objet valeur à fournir aux enfants
    const value = { scrollRef };

    return <Context.Provider value={value}>{children}</Context.Provider>;
}
