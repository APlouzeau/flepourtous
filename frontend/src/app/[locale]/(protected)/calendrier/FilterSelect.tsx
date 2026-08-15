"use client";

interface FilterOption {
    value: string;
    label: string;
}

interface FilterSelectProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[];
    placeholder?: string;
    className?: string;
}

export default function FilterSelect({
    label,
    value,
    onChange,
    options,
    placeholder = "Tous",
    className = "",
}: FilterSelectProps) {
    return (
        <div className={`mb-6 bg-gray-50 p-4 rounded-lg ${className}`}>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label} :</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
