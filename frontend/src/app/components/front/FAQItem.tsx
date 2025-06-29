"use client";
import { useState } from "react";

interface FAQItemProps {
    question: string;
    answer: string;
}

export default function FAQItem({ question, answer }: FAQItemProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200">
            <button
                className="flex justify-between items-center w-full py-4 text-left hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg font-medium text-gray-800">{question}</span>
                <span className="text-2xl text-gray-500 ml-4">
                    {isOpen ? "−" : "+"}
                </span>
            </button>
            {isOpen && (
                <div className="pb-4 text-gray-600 leading-relaxed">
                    {answer}
                </div>
            )}
        </div>
    );
} 