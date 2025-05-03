"use server";
import { cookies } from "next/headers";
import axios from "axios";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";

export async function createSession(cookieValue: string) {
    const jwt = await new SignJWT({ cookieValue })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(new TextEncoder().encode(process.env.JWT_SECRET));
    console.log("getSession :", cookieValue);

    const cookieStore = await cookies();

    if (!cookieValue) {
        console.log("No session found");
        return null;
    }
    cookieStore.set("session", jwt, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
    });
    return cookieStore.get("session");
}

export async function verifyToken(jwt: string) {
    const { payload } = await jwtVerify(jwt, new TextEncoder().encode(process.env.JWT_SECRET));
    return payload;
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

export async function getCookieBackend() {
    const cookie = (await cookies()).get("PHPSESSID");
    if (!cookie) {
        console.log("No session found");
        return null;
    }
    return cookie.value;
}
