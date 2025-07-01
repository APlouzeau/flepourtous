"use client";

import { useState, useEffect } from "react";
import TestimonialCard from "./TestimonialCard";

interface Testimonial {
    quote: string;
    author: string;
    nationality: string;
    bgColor: string;
}

interface TestimonialsSliderProps {
    testimonials: Testimonial[];
    isVisible: boolean;
}

export default function TestimonialsSlider({ testimonials, isVisible }: TestimonialsSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
        }, 4000); // Change slide every 4 seconds

        return () => clearInterval(interval);
    }, [isAutoPlaying, testimonials.length]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
        setIsAutoPlaying(false);
        // Resume auto-play after 10 seconds of inactivity
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const goToPrevious = () => {
        const newIndex = currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1;
        goToSlide(newIndex);
    };

    const goToNext = () => {
        const newIndex = (currentIndex + 1) % testimonials.length;
        goToSlide(newIndex);
    };

    // Touch handlers for swipe functionality
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            goToNext();
        } else if (isRightSwipe) {
            goToPrevious();
        }
    };

    return (
        <div className="w-full">
            {/* Desktop Grid Layout - Hidden on Mobile */}
            <div className="hidden md:block">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <div className={`scroll-animate-right scroll-animate-delay-1 ${isVisible ? "visible" : ""}`}>
                        <TestimonialCard {...testimonials[0]} />
                    </div>
                    <div className={`scroll-animate-right scroll-animate-delay-2 ${isVisible ? "visible" : ""}`}>
                        <TestimonialCard {...testimonials[1]} />
                    </div>
                    <div
                        className={`sm:col-span-2 lg:col-span-1 scroll-animate-right scroll-animate-delay-3 ${
                            isVisible ? "visible" : ""
                        }`}
                    >
                        <TestimonialCard {...testimonials[2]} />
                    </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
                    <div className={`scroll-animate-right scroll-animate-delay-4 ${isVisible ? "visible" : ""}`}>
                        <TestimonialCard {...testimonials[3]} />
                    </div>
                    <div className={`scroll-animate-right scroll-animate-delay-5 ${isVisible ? "visible" : ""}`}>
                        <TestimonialCard {...testimonials[4]} />
                    </div>
                </div>
            </div>

            {/* Mobile Slider Layout */}
            <div className="md:hidden relative">
                {/* Slider Container */}
                <div
                    className="relative overflow-hidden rounded-lg testimonials-slider cursor-grab"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="w-full flex-shrink-0 px-2">
                                <div className={`scroll-animate-scale ${isVisible ? "visible" : ""}`}>
                                    <TestimonialCard {...testimonial} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dots Indicators */}
                <div className="flex justify-center mt-6 space-x-2">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full nav-dot ${
                                index === currentIndex ? "bg-red-600 scale-125 active" : "bg-gray-300 hover:bg-gray-400"
                            }`}
                            aria-label={`Aller au témoignage ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Progress Bar */}
                <div className="mt-4 w-full bg-gray-200 rounded-full h-1">
                    <div
                        className="bg-red-600 h-1 rounded-full transition-all duration-100 ease-linear"
                        style={{
                            width: `${((currentIndex + 1) / testimonials.length) * 100}%`,
                        }}
                    />
                </div>

                {/* Counter */}
                <div className="text-center mt-3 text-sm text-gray-500">
                    {currentIndex + 1} / {testimonials.length}
                </div>
            </div>
        </div>
    );
}
