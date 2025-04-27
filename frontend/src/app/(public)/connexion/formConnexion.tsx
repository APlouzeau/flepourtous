"use client";
import { connexionAction } from "./formAction";

export default function FormConnexion() {
    return (
        <div>
            <form action={connexionAction}>
                <div className="mb-4">
                    <input
                        type="email"
                        name="mail"
                        placeholder="Mail"
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        name="password"
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <button type="submit" className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700">
                    Se connecter
                </button>
            </form>
        </div>
    );
}
