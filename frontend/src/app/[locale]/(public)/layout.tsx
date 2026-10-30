import type { Metadata } from "next";
import PublicShell from "./PublicShell";

// Pages techniques (connexion, inscription, mot de passe oublié, réinitialisation, succès, échec) :
// accessibles mais jamais indexées, et absentes du sitemap (FLE-84).
export const metadata: Metadata = {
    robots: { index: false, follow: true },
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return <PublicShell>{children}</PublicShell>;
}
