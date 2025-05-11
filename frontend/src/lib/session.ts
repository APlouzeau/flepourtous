"use server";
import { cookies, headers } from "next/headers";
import axios from "axios";
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

export async function getRole() {
    const sessionCookie = (await cookies()).get("session");
    if (!sessionCookie) {
        console.log("No session found");
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
        console.log("No IP address found");
        return null;
    }
    try {
        const response = await axios.get(`https://ipapi.co/${userIP}/country/`);
        if (response.data) {
            return response.data;
        } else {
            console.log("No country name found in the response");
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
    const jwtSessionCookie = (await cookies()).get("session");
    if (!jwtSessionCookie) {
        console.log("No JWT session cookie found in getCookieBackend");
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
