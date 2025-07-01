interface FeatureCardProps {
    icon: string;
    title: string;
    subtitle: string;
    description: string;
}

export default function FeatureCard({ icon, title, subtitle, description }: FeatureCardProps) {
    return (
        <div className="text-center p-6">
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
            <p className="text-gray-600 text-sm text- leading-relaxed pb-3">{subtitle}</p>
            <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>
    );
}
