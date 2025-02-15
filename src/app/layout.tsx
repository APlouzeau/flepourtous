import type { Metadata } from "next";
import { Roboto, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "./components/Header/page";
import Footer from "./components/footer/page";

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
            <body className={`${montserrat.variable} ${roboto.variable} font-sans antialiased`}>
                <Header />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}
