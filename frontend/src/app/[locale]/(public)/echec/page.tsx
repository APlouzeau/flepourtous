import Link from "next/link";

export default function EchecPage() {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Échec de la vérification</h1>
                <p className="text-lg">Votre adresse n a pas pu être vérifiée.</p>
                
                <div className="mt-8">
                    <Link
                        href="/connexion"
                        className="inline-block px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                        Retour à la connexion
                    </Link>
                </div>
            </div>  
        </div>        
    );
}