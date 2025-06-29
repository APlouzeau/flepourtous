import Link from "next/link";

interface ButtonProps {
    children: React.ReactNode;
    variant?: "black" | "white";
    href?: string;
    onClick?: () => void;
    className?: string;
    type?: "button" | "submit" | "reset";
}

export default function Button({ 
    children, 
    variant = "black", 
    href, 
    onClick, 
    className = "",
    type = "button"
}: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 transform hover:scale-105";
    
    const variantStyles = {
        black: "bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl",
        white: "bg-white text-black hover:bg-gray-100 shadow-lg hover:shadow-xl border border-gray-200"
    };

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

    if (href) {
        return (
            <Link href={href} className={combinedClassName}>
                {children}
            </Link>
        );
    }

    return (
        <button 
            type={type}
            onClick={onClick}
            className={combinedClassName}
        >
            {children}
        </button>
    );
} 