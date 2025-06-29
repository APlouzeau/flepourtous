"use client";

import { usePathname } from "next/navigation";
import Header from "./components/front/Header";
import Footer from "./components/front/Footer";

interface LayoutWrapperProps {
    children: React.ReactNode;
    isLoggedIn: boolean;
}

export default function LayoutWrapper({ children, isLoggedIn }: LayoutWrapperProps) {
    const pathname = usePathname();
    
    // Routes publiques où on ne veut pas afficher le Header et Footer
    const isPublicRoute = pathname?.startsWith("/connexion") || pathname?.startsWith("/inscription");
    
    return (
        <>
            {!isPublicRoute && <Header isLoggedIn={isLoggedIn} />}
            <main className={isPublicRoute ? "" : ""}>{children}</main>
            {!isPublicRoute && <Footer />}
        </>
    );
} 