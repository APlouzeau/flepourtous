"use client";

import { useScrollAnimation } from "@/lib/useScrollAnimation";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import Provider from "./scrollSectionProvider";

type ScrollSectionProps = {
    className?: string;
    children?: ReactNode;
};

/**
 * `ScrollSection` has its own `useScrollAnimation` state provided through `context` to its children like `ScrollDiv`
 */
export default function ScrollSection(props: ScrollSectionProps) {
    const { className, children } = props;

    const scrollRef = useScrollAnimation();

    return (
        <Provider scrollRef={scrollRef}>
            <section
                ref={scrollRef.elementRef}
                className={cn(scrollRef.isVisible && "visible", className)}
            >
                {children}
            </section>
        </Provider>
    );
}
