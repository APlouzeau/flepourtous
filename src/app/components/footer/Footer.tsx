import Link from "next/link";

export default function Footer() {
    return (
        <>
            <div className="flex flex-col md:flex-row bg-purple-700 m-2 rounded-box mt-8 justify-around items-center text-lg font-bold">
                <Link href="/">Me contacter</Link>
                <Link href="/">Copyright</Link>
                <Link href="/">RGPD</Link>
                <Link href="/">Accueil</Link>
            </div>
        </>
    );
}
