"use client";
import Image from "next/image";
import Link from "next/link";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Layout Mobile - Portrait & Paysage */}
            <div className="lg:hidden min-h-screen relative">
                {/* Image de fond avec overlay */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/House.jpg"
                        alt="Maison FLE Pour Tous"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
                </div>
                
                {/* Contenu mobile */}
                <div className="relative z-10 flex flex-col min-h-screen">
                    {/* Header mobile avec lien retour */}
                    <div className="flex justify-start p-4 sm:p-6">
                        <Link 
                            href="/" 
                            className="inline-flex items-center space-x-2 text-white/90 hover:text-white transition-colors bg-white/10 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2 rounded-xl border border-white/20"
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="text-sm sm:text-base font-medium">Retour</span>
                        </Link>
                    </div>
                    
                    {/* Contenu du formulaire centré */}
                    <div className="flex-1 flex items-center justify-center px-4 sm:px-6 pb-8">
                        <div className="w-full max-w-sm sm:max-w-md">
                            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Layout Tablette et Desktop */}
            <div className="hidden lg:block min-h-screen">
                <div className="flex items-center justify-center min-h-screen p-4 xl:p-6">
                    <div className="w-full max-w-7xl relative">
                        {/* Lien retour desktop */}
                        <div className="mb-6">
                            <Link 
                                href="/" 
                                className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-all duration-200 bg-white px-5 py-3 rounded-2xl shadow-lg hover:shadow-xl border border-gray-200 hover:border-gray-300"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                <span className="font-medium">Retour à la page d&apos;accueil</span>
                            </Link>
                        </div>
                        
                        {/* Contenu principal desktop/tablette */}
                        <div className="grid lg:grid-cols-3 xl:grid-cols-5 gap-0 rounded-[3rem] overflow-hidden shadow-2xl bg-white border border-gray-200">
                            {/* Image côté gauche */}
                            <div className="lg:col-span-2 xl:col-span-3 relative min-h-[600px] xl:min-h-[700px]">
                                <Image
                                    src="/images/House.jpg"
                                    alt="Maison FLE Pour Tous"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20"></div>
                            </div>
                            
                            {/* Formulaire côté droit */}
                            <div className="lg:col-span-1 xl:col-span-2 flex items-center justify-center p-8 xl:p-12 bg-white">
                                <div className="w-full max-w-md">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 