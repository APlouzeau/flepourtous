"use client";
import Image from "next/image";
import Link from "next/link";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <style jsx global>{`
                body header,
                body footer {
                    display: none !important;
                }
                body main {
                    padding: 0 !important;
                    margin: 0 !important;
                }
            `}</style>
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="w-[85%] relative">
                    {/* Lien retour en haut à gauche */}
                    <Link 
                        href="/" 
                        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-4 bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Retour à la page d'accueil</span>
                    </Link>
                    
                    <div className="h-[85vh] flex rounded-[50px] overflow-hidden shadow-2xl">
                        {/* Image à gauche */}
                        <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative h-full">
                            <Image
                                src="/images/House.jpg"
                                alt="Maison FLE Pour Tous"
                                fill
                                className="object-cover h-full w-full"
                                priority
                            />
                        </div>
                        
                        {/* Formulaire à droite */}
                        <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-8 bg-white">
                            <div className="w-full max-w-md">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 