import Link from "next/link";
import Image from "next/image";
import LoginForm from "./LoginForm";
import Button from "../../components/front/Button";

export default function ConnexionPage() {
    return (
        <div className="w-full">
            <div className="text-center mb-8">
                <Link href="/" className="flex items-center justify-center space-x-3 mb-6 hover:opacity-80 transition-opacity">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center p-2">
                        <Image
                            src="/images/logo.png"
                            alt="Logo FLE Pour Tous"
                            width={32}
                            height={32}
                            className="object-contain"
                        />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">FLE pour tous</h3>
                </Link>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Content de vous retrouver</h2>
                <p className="text-gray-600">Authentification</p>
            </div>
            
            <LoginForm />
            
            <div className="mt-6 text-center">
                <p className="text-gray-600">
                    Vous n'avez pas de compte{" "}
                    <Link href="/inscription" className="text-red-600 hover:text-red-700 font-medium">
                        Créer votre compte
                    </Link>
                </p>
            </div>
        </div>
    );
}
