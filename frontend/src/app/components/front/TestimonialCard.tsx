import Image from "next/image";

interface TestimonialCardProps {
    quote: string;
    author: string;
    nationality: string;
    bgColor: string;
    image?: string;
}

export default function TestimonialCard({ quote, author, nationality, bgColor, image }: TestimonialCardProps) {
    return (
        <div className={`${bgColor} p-6 rounded-lg shadow-lg`}>
            {/*             <div className="flex items-start mb-4">
                {image && (
                    <div className="w-12 h-12 bg-gray-300 rounded-full mr-4 flex-shrink-0 overflow-hidden relative">
                        <Image src={image} alt={author} fill className="object-cover" />
                    </div>
                )}
            </div> */}
            <div className="text-2xl text-gray-600">{/* &quot; */}</div>
            <p className="font-semibold text-gray-800">{author}</p>
            <p className="text-sm text-gray-600">{nationality}</p>
            <div className="border-t border-gray-300 pt-4">
                <p className="text-gray-800 mb-4 leading-relaxed">{quote}</p>
            </div>
        </div>
    );
}
