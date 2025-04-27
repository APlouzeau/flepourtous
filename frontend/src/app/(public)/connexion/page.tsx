import FormConnexion from "./formConnexion";

export default async function ConnexionPage() {
    return (
        <>
            <h2 className="mt-12 text-5xl font-bold text-center">Connexion</h2>
            <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
                <FormConnexion />
            </div>
        </>
    );
}
