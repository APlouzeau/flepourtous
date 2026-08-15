interface FilterDateProps {
    label: string;
    value: string;
    onChange: (date: string) => void;
    className?: string; // ← Ajouter cette prop
}

export default function FilterDate({ label, value, onChange, className = "" }: FilterDateProps) {
    return (
        <div className={`mb-6 bg-gray-50 p-4 rounded-lg ${className}`}>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
    );
}
