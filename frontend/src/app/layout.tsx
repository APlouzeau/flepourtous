import type { Metadata } from "next";
import { Roboto, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "./components/front/Header/Header";
import Footer from "./components/front/Footer/Footer";

const roboto = Roboto({
    weight: ["100", "300", "400", "500", "700"], // ajoutez les weights dont vous avez besoin
    subsets: ["latin"],
    variable: "--font-roboto",
});

const montserrat = Montserrat({
    weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-montserrat",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "FLE pour tous",
    description: "Cours de français langue étrangère pour tous les niveaux",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
            <body
                data-theme="synthwave"
                className={`${montserrat.variable} ${roboto.variable} font-sans antialiased min-h-screen flex flex-col justify-between`}
            >
                <Header />
                <main className="min-">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
