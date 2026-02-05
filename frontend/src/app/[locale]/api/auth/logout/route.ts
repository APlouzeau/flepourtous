import { logout } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        await logout();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erreur lors de la déconnexion:", error);
        return NextResponse.json(
            { error: "Erreur lors de la déconnexion" },
            { status: 500 }
        );
    }
} 