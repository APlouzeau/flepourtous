import Image from "next/image";
import Button from "./Button";
import Link from "next/link";

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
        <div className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ">
            <div className="relative h-48">
                <Image src={image} alt={title} fill className="object-cover" />
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex-grow">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
                    <p className="text-gray-600 mb-4">{description}</p>
                </div>
                <div className="flex justify-between items-baseline">
                    <p className="text-gray-500 mb-4">A partir de </p>
                    <div className="flex justify-end items-center mb-4">
                        <span className="text-2xl font-bold text-red-600">{price}</span>
                        <span className="text-sm text-gray-500"> / {duration}</span>
                    </div>
                </div>
                <Link href={link}>
                    <Button variant="black" className="w-full text-sm py-2">
                        En savoir plus
                    </Button>
                </Link>
            </div>
        </div>
    );
}
