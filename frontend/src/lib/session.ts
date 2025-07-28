"use server";
import { cookies, headers } from "next/headers";
import apiClient from "@/lib/axios";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";

export async function createSession(userRole: string) {
    const cookie = (await cookies()).get("PHPSESSID");
    const cookiePHP = cookie?.value;

    const jwt = await new SignJWT({ cookiePHP, role: userRole })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    const cookieStore = await cookies();

    if (!cookiePHP) {
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

export async function getRole() {
    const sessionCookie = (await cookies()).get("session");
    if (!sessionCookie) {
        return null;
    }
    const session = sessionCookie.value;
    const payload = await verifyToken(session);
    return payload.role;
}

export async function verifyToken(jwt: string) {
    const { payload } = await jwtVerify(jwt, new TextEncoder().encode(process.env.JWT_SECRET));
    return payload;
}

export async function generateRefreshedToken(payload: { cookiePHP: string; role: string }) {
    const newJwt = await new SignJWT({ cookiePHP: payload.cookiePHP, role: payload.role })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt() // Définit une nouvelle date d'émission
        .setExpirationTime("1h") // Définit une nouvelle expiration (1h à partir de maintenant)
        .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    return {
        token: newJwt,
        expires: new Date(Date.now() + 1 * 60 * 60 * 1000), // Calcule la nouvelle date d'expiration exacte
    };
}

export async function getCountry() {
    const forwardedFor = (await headers()).get("x-forwarded-for");
    const realIp = (await headers()).get("x-real-ip");

    let userIP: string | null = null;
    if (forwardedFor) {
        userIP = forwardedFor.split(",")[0];
    } else if (realIp) {
        userIP = realIp;
    } else {
        userIP = null;
    }
    if (!userIP) {
        return null;
    }
    try {
        const response = await apiClient.get(`https://ipapi.co/${userIP}/country/`);
        if (response.data) {
            return response.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching country information:", error);
        return null;
    }
}

export async function getSession() {
    return await cookies();
}

export async function logout() {
    const session = await getCookieBackend();
    if (session) {
        await apiClient.post(
            "/api/logout",
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
    const jwtSessionCookie = (await cookies()).get("session");
    if (!jwtSessionCookie) {
        return null;
    }
    try {
        const payload = await verifyToken(jwtSessionCookie.value);
        return payload.cookiePHP as string | null;
    } catch (error) {
        console.error("Error verifying token in getCookieBackend:", error);
        return null;
    }
}

export async function getWallet() {
    const session = await getCookieBackend();
    if (!session) {
        return null;
    }
    try {
        const response = await apiClient.post(
            "/api/getWallet",
            {},
            {
                headers: {
                    Cookie: `PHPSESSID=${session}`,
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            }
        );
        return response.data.data || "0";
    } catch (error) {
        console.error("Error fetching wallet:", error);
        return null;
    }
}
