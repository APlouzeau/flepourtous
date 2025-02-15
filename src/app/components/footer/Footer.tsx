import Link from "next/link";

export default function Footer() {
    return (
        <>
            <div className="flex bg-purple-700 m-2 h-24 rounded-box mt-8 justify-around items-center text-lg font-bold">
                <Link href="/">Me contacter</Link>
                <Link href="/">Copyright</Link>
                <Link href="/">RGPD</Link>
                <Link href="/">Accueil</Link>
            </div>
        </>
    );
}
