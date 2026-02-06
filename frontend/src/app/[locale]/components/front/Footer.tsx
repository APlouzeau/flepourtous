"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/locales/client";

export default function Footer() {
    const trad = useI18n();
    return (
        <div className="w-full px-[5%] py-8">
            <footer className="bg-[#1D1E1C]  text-white w-full rounded-[50px]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Logo et nom */}
                        <div className="md:col-span-1">
                            <div className="flex items-center space-x-3 mb-4">
                                <Image
                                    src="/images/logo.png"
                                    alt="Logo FLE Pour Tous"
                                    width={72}
                                    height={72}
                                    className="object-contain"
                                />

                                <h3 className="text-xl font-bold text-white">FLE Pour Tous</h3>
                            </div>
                        </div>

                        {/* Navigation principale */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                                {trad("footer.navigation.title")}
                            </h4>
                            <ul className="space-y-3">
                                <li>
                                    <Link
                                        href="/"
                                        className="text-gray-300 hover:text-white transition-colors duration-200"
                                    >
                                        {trad("footer.navigation.home")}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/offre-de-cours"
                                        className="text-gray-300 hover:text-white transition-colors duration-200"
                                    >
                                        {trad("footer.navigation.courses")}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/ressources-utilisees"
                                        className="text-gray-300 hover:text-white transition-colors duration-200"
                                    >
                                        {trad("footer.navigation.resourcesUsed")}
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Liens utilisateur */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                                {trad("footer.account.title")}
                            </h4>
                            <ul className="space-y-3">
                                <li>
                                    <Link
                                        href="/profil"
                                        className="text-gray-300 hover:text-white transition-colors duration-200"
                                    >
                                        {trad("footer.account.profile")}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/calendrier"
                                        className="text-gray-300 hover:text-white transition-colors duration-200"
                                    >
                                        {trad("footer.account.calendar")}
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact et légal */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                                {trad("footer.support.title")}
                            </h4>
                            <ul className="space-y-3">
                                <li>
                                    <a
                                        href="mailto:flepourtous.online@gmail.com?subject=Demande%20d'information&body=Bonjour,%0D%0A%0D%0AJe%20souhaiterais%20obtenir%20plus%20d'informations%20sur%20vos%20cours%20de%20français.%0D%0A%0D%0AMerci."
                                        className="text-gray-300 hover:text-white transition-colors duration-200"
                                    >
                                        {trad("footer.support.contact")}
                                    </a>
                                </li>
                                <li>
                                    <Link
                                        href="/cgv"
                                        className="text-gray-300 hover:text-white transition-colors duration-200"
                                    >
                                        {trad("footer.support.cgv")}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/reglement-interieur"
                                        className="text-gray-300 hover:text-white transition-colors duration-200"
                                    >
                                        {trad("footer.support.rules")}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/rgpd"
                                        className="text-gray-300 hover:text-white transition-colors duration-200"
                                    >
                                        {trad("footer.support.rgpd")}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Ligne de séparation */}
                    <div className="border-t border-gray-700 mt-8 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="text-gray-400 text-sm">©{trad("footer.out.copyright")}</div>
                            <div className="flex space-x-6 mt-4 md:mt-0">
                                <Link
                                    href="/politique-confidentialite"
                                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                                >
                                    {trad("footer.out.confidentiality")}
                                </Link>
                                <Link
                                    href="/conditions-utilisation"
                                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                                >
                                    {trad("footer.out.termsOfUse")}
                                </Link>
                                <Link
                                    href="/cookies"
                                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                                >
                                    {trad("footer.out.cookie")}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
