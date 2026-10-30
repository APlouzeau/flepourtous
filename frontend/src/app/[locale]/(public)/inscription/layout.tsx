import { pageMetadata } from "@/lib/metadata";

// La page d'inscription est un composant client : ses metadata sont portées par ce layout.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    return pageMetadata(locale, "register");
}

export default function InscriptionLayout({ children }: { children: React.ReactNode }) {
    return children;
}
