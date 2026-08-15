interface StatCardProps {
    number: string;
    description: string;
}

export default function StatCard({ number, description }: StatCardProps) {
    return (
        <div className="text-center text-white">
            <div className="text-4xl md:text-5xl font-bold mb-2">{number}</div>
            <div className="text-sm md:text-base text-gray-300">{description}</div>
        </div>
    );
} 