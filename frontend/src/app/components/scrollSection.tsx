"use client";

import { useScrollAnimation } from "@/lib/useScrollAnimation";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type ScrollSectionProps = {
    className?: string;
    children?: ReactNode;
};

export default function ScrollSection(props: ScrollSectionProps) {
    const { className, children } = props;

    const scrollRef = useScrollAnimation();

    return (
        <section
            ref={scrollRef.elementRef}
            className={cn(scrollRef.isVisible && "visible", className)}
        >
            {children}
        </section>
    );
}
