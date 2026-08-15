import Link from "next/link";

interface ButtonProps {
    children: React.ReactNode;
    variant?: "black" | "white";
    href?: string;
    onClick?: () => void;
    className?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
}

export default function Button({ 
    children, 
    variant = "black", 
    href, 
    onClick, 
    className = "",
    type = "button",
    disabled = false
}: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 transform hover:scale-105";
    
    const variantStyles = {
        black: "bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl",
        white: "bg-white text-black hover:bg-gray-100 shadow-lg hover:shadow-xl border border-gray-200"
    };

    const disabledStyles = disabled ? "opacity-50 cursor-not-allowed transform-none hover:scale-100" : "";

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${disabledStyles} ${className}`;

    if (href && !disabled) {
        return (
            <Link href={href} className={combinedClassName}>
                {children}
            </Link>
        );
    }

    return (
        <button 
            type={type}
            onClick={disabled ? undefined : onClick}
            className={combinedClassName}
            disabled={disabled}
        >
            {children}
        </button>
    );
} 