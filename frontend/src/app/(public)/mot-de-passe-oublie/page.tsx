import Link from "next/link";
import ForgetedPasswordForm from "./ForgetedPasswordForm";
import apiClient from "@/lib/axios";
import Image from "next/image";

export async function forgetedPassword(mail: string) {
    const response = await apiClient.post(
        "/api/forgetedPassword",
        { mail },
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    if (response.data.code !== 0) {
        throw new Error(
            response.data.message || "Une erreur est survenue lors de la réinitialisation du mot de passe."
        );
    }
    return response.data;
}

export default function ForgetedPasswordPage() {
    return (
        <div className="w-full">
            <div className="text-center mb-6 sm:mb-8">
                <Link
                    href="/"
                    className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4 sm:mb-6 hover:opacity-80 transition-opacity group"
                >
                    <Image
                        src="/images/logo.png"
                        alt="Logo FLE Pour Tous"
                        width={48}
                        height={48}
                        className="object-contain w-6 h-6 sm:w-8 sm:h-8"
                    />

                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">FLE pour tous</h3>
                </Link>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Mot de passe oublié ?</h2>
                <p className="text-sm sm:text-base text-gray-600">
                    Si vous avez oublié votre mot de passe, veuillez entrer votre mail dans le champ ci-dessous. Si
                    votre adresse existe, vous recevrez un lien pour réinitialiser votre mot de passe.
                </p>
            </div>

            <ForgetedPasswordForm />
        </div>
    );
}
