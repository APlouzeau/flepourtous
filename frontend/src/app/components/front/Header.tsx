import Link from "next/link";
import Navbar from "./Navbar";

export default function Header() {
    return (
        <header className="h-auto md:h-96 bg-pink-300 m-2 flex flex-col rounded-lg">
            <div className="flex-1 flex items-center justify-center p-4">
                <Link href="/" className="font-bold text-8xl shadow-black text-white text-center">
                    FLE pour tous
                </Link>
            </div>
            <Navbar />
        </header>
    );
}
