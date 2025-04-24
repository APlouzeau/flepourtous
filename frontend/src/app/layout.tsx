import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/front/Header";
import Footer from "./components/front/Footer";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
    title: "FLE pour tous",
    description: "Cours de français langue étrangère pour tous les niveaux",
};

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
            <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
                <Header />
                <main className="">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
