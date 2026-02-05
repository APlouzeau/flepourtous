import Image from "next/image";

export default function ShowPassword({
    showPassword,
    setShowPassword
}: {
    showPassword: boolean;
    setShowPassword: (value: boolean) => void;
}) {
       return             <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity"
                    >
                        <Image 
                            src={showPassword ? "/images/oeil.png" : "/images/visible.png"}
                            alt={showPassword ? "Cacher le mot de passe" : "Voir le mot de passe"}
                            width={24}
                            height={24}
                            className="object-contain"
                        />
                    </button>
}