import Image from "next/image";
import Link from "next/link";
import Button from "./Button";

interface FormulaCardProps {
    image: string;
    title: string;
    description: string;
    price: string;
    duration: string;
    link: string;
}

export default function FormulaCard({ image, title, description, price, duration, link }: FormulaCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-48">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
                <p className="text-gray-600 mb-4">{description}</p>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-red-600">{price}</span>
                    <span className="text-sm text-gray-500">{duration}</span>
                </div>
                <Button variant="black" href={link} className="w-full text-sm py-2">
                    En savoir plus
                </Button>
            </div>
        </div>
    );
} 