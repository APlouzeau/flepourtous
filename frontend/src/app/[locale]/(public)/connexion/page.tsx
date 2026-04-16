import Link from "next/link";
import Image from "next/image";
import LoginForm from "./LoginForm";
import { getI18n } from "@/locales/server";

export default async function ConnexionPage() {
    const trad = await getI18n();
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
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                    {trad("profile.auth.nice")}
                </h2>
                <p className="text-sm sm:text-base text-gray-600">{trad("profile.auth.sectionName")}</p>
            </div>

            <LoginForm />

            <div className="mt-4 sm:mt-6 text-center">
                <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                    {trad("profile.auth.noAccount")}{" "}
                    <Link
                        href="/inscription"
                        className="text-red-600 hover:text-red-700 font-medium transition-colors underline decoration-red-600/30 hover:decoration-red-600"
                    >
                        {trad("profile.auth.createAccount")}
                    </Link>
                </p>
            </div>
        </div>
    );
}
