"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import { useEffect } from "react";

export default function CalendarPage() {
    console.log(`${process.env.NEXT_PUBLIC_API_URL}/getEvents`);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getEvents`);
                console.log("Events data:", response.data);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };
        fetchEvents();
    }, []);
    return (
        <>
            <div className="flex flex-col items-center justify-center  bg-gray-100">
                <h1 className="text-4xl font-bold mb-4">Calendrier</h1>
            </div>
            <Button asChild>
                <Link
                    href="/calendrier/ajouter-rendez-vous"
                    className="bg-blue-500 text-white hover:bg-blue-700 font-bold py-2 px-4 rounded"
                >
                    Nouveau RDV
                </Link>
            </Button>
        </>
    );
}
