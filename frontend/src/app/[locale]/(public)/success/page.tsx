import Link from "next/link";

export default function SuccessPage() {

  return (
    <div className="flex h-screen items-center justify-center">
        <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Bravo !</h1>
            <p className="text-lg">Votre adresse a été vérifiée !</p>
            <div className="mt-8">
                <Link
                href="/connexion"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                Connexion
                </Link>
            </div>
        </div>
    </div>
  );
}