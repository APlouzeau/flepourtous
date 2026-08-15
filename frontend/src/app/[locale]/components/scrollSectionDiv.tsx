"use client";

import { cn } from "@/lib/utils";
import { ReactNode, useContext } from "react";
import { Context } from "./scrollSectionContext";

type ScrollDivProps = {
    className?: string;
    children?: ReactNode;
};

/**
 * `ScrollDiv` uses the `useScrollAnimation` state provided by the `context` of its parent `ScrollSection`
 */
export default function ScrollDiv(props: ScrollDivProps) {
    const { className, children } = props;

    const { scrollRef } = useContext(Context);

    return (
        <div className={cn(scrollRef.isVisible && "visible", className)}>
            {children}
        </div>
    );
}
