import Link from "next/link";
import LoginForm from "./LoginForm";

export default function ConnexionPage() {
    return (
        <>
            <h2 className="mt-12 text-5xl font-bold text-center">Connexion</h2>
            <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
                <LoginForm />
                <Link
                    href="/inscription"
                    className="btn w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700 mt-2"
                >
                    Inscription
                </Link>
            </div>
        </>
    );
}
