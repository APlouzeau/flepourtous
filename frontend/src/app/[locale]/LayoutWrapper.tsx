"use client";

import { usePathname } from "next/navigation";
import Header from "./components/front/Header";
import Footer from "./components/front/Footer";
import { Slugs } from "./types/lessons";

interface LayoutWrapperProps {
    children: React.ReactNode;
    isLoggedIn: boolean;
    slugs: Slugs;
}

export default function LayoutWrapper({ children, isLoggedIn, slugs }: LayoutWrapperProps) {
    const pathname = usePathname();

    // Routes publiques où on ne veut pas afficher le Header et Footer
    const isPublicRoute =
        pathname?.startsWith("/connexion") ||
        pathname?.startsWith("/inscription") ||
        pathname?.startsWith("/mot-de-passe-oublie");

    return (
        <>
            {!isPublicRoute && <Header isLoggedIn={isLoggedIn} slugs={slugs} />}
            <main className={isPublicRoute ? "" : ""}>{children}</main>
            {!isPublicRoute && <Footer />}
        </>
    );
}
