"use client";
import { useState, useRef, useEffect } from "react";

interface FAQItemProps {
    question: string;
    answer: string;
}

export default function FAQItem({ question, answer }: FAQItemProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [height, setHeight] = useState<number>(0);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            const scrollHeight = contentRef.current.scrollHeight;
            setHeight(isOpen ? scrollHeight : 0);
        }
    }, [isOpen]);

    return (
        <div className={`faq-item border-b border-gray-200 bg-white rounded-lg mb-2 shadow-sm overflow-hidden transition-shadow duration-200 hover:shadow-md ${isOpen ? 'open' : ''}`}>
            <button
                className="faq-button flex justify-between items-center w-full py-4 px-4 text-left hover:bg-gray-50 transition-all duration-200"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg font-medium text-gray-800 pr-4">{question}</span>
                <div className={`faq-icon flex-shrink-0 transform transition-transform duration-300 ease-in-out ${isOpen ? 'open' : ''}`}>
                    <svg 
                        className="w-6 h-6 text-red-600" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                        />
                    </svg>
                </div>
            </button>
            
            <div
                className="faq-content overflow-hidden transition-all duration-300 ease-in-out"
                style={{ height: `${height}px` }}
            >
                <div 
                    ref={contentRef}
                    className={`px-4 pb-4 text-gray-600 leading-relaxed transition-opacity duration-200 ${
                        isOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <div className="faq-answer-border pl-4 py-2">
                        {answer}
                    </div>
                </div>
            </div>
        </div>
    );
} 