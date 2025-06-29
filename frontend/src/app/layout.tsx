import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { getSession } from "@/lib/session";
import LayoutWrapper from "./LayoutWrapper";

export const metadata: Metadata = {
    title: "FLE pour tous",
    description: "Cours de français langue étrangère pour tous les niveaux",
};

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    // Récupération de la session côté serveur
    const session = await getSession();
    const isLoggedIn = !!session.get("session")?.value;

    return (
        <html lang="fr">
            <body
                className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}
                suppressHydrationWarning={true}
            >
                <LayoutWrapper isLoggedIn={isLoggedIn}>{children}</LayoutWrapper>
            </body>
        </html>
    );
}
