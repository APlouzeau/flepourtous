"use server";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import { redirect } from "next/navigation";

export async function createSession(request: NextRequest) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = request.cookies?.get("PHPSESSID")?.value;
    console.log("getSession :", session);

    const cookieStore = await cookies();

    if (!session) {
        console.log("No session found");
        return null;
    }
    cookieStore.set("session", session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: "lax",
        path: "/",
    });
    return cookieStore.get("session");
}

export async function getSession() {
    return await cookies();
}

export async function logout() {
    const session = (await cookies()).get("session")?.value;
    if (session) {
        await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/logout`,
            {},
            {
                headers: {
                    Cookie: `PHPSESSID=${session}`,
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            }
        );
    }
    // Supprime le cookie côté Next.js si besoin
    (await cookies()).delete("session");
    redirect("/");
}
