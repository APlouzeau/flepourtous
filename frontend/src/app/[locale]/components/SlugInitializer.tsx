"use client";
import { useSlugStore } from "@/store/useSlugStore";
import { useEffect } from "react";

export function SlugInitializer({ slugs }: { slugs: Record<string, string> }) {
    const setSlugs = useSlugStore((state) => state.setSlugs);

    useEffect(() => {
        setSlugs(slugs);
    }, [slugs, setSlugs]);

    return null;
}
