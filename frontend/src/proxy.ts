import { NextRequest, NextResponse } from "next/server";
import { verifyToken, generateRefreshedToken } from "./lib/session";
import createMiddleware from "next-intl/middleware"; // 👈 nouveau
import { routing } from "./i18n/routing";

const I18nMiddleware = createMiddleware(routing); // 👈 nouveau

const isProtectedRoute = [
    "/calendrier",
    "/profil",
    "/calendrier/nouveau-rendez-vous",
    "/calendrier/nouveau-rendez-vous/paiement",
    "/calendrier/packs",
    "/calendrier/admin-dashboard",
    "/retour-paiement",
];

const ONE_HOUR_IN_MS = 1 * 60 * 60 * 1000;
const REFRESH_IF_OLDER_THAN_MS = ONE_HOUR_IN_MS / 2;

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Bloquer les tentatives d'injection malveillantes — identique
    const url = request.url;
    const suspiciousPatterns = [
        /curl.*\|.*bash/i,
        /wget.*\|.*sh/i,
        /eval\(/i,
        /base64.*\|/i,
        /\/bin\/(sh|bash)/i,
        /\$\(.*\)/,
    ];

    if (suspiciousPatterns.some((pattern) => pattern.test(url))) {
        const clientIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "IP inconnue";
        console.warn(`🚨 Tentative d'attaque bloquée depuis ${clientIp}: ${pathname}`);
        return new NextResponse("Forbidden", { status: 403 });
    }

    // Middleware i18n
    const i18nResponse = I18nMiddleware(request);

    if (i18nResponse.status === 307 || i18nResponse.status === 308) {
        return i18nResponse;
    }

    const response = i18nResponse;

    // Auth — identique, rien ne change ici
    if (isProtectedRoute.includes(pathname)) {
        const sessionCookie = request.cookies.get("session");
        const sessionToken = sessionCookie?.value;

        if (!sessionToken) {
            return NextResponse.redirect(new URL("/connexion", request.url));
        }

        try {
            const currentPayload = await verifyToken(sessionToken);

            if (
                !currentPayload ||
                typeof currentPayload.iat !== "number" ||
                typeof currentPayload.cookiePHP !== "string" ||
                typeof currentPayload.role !== "string"
            ) {
                const redirectResponse = NextResponse.redirect(new URL("/connexion", request.url));
                redirectResponse.cookies.delete("session");
                return redirectResponse;
            }

            const issuedAtMs = currentPayload.iat * 1000;
            const currentTimeMs = Date.now();

            if (currentTimeMs - issuedAtMs > REFRESH_IF_OLDER_THAN_MS) {
                const { token: newJwt, expires: newExpires } = await generateRefreshedToken({
                    cookiePHP: currentPayload.cookiePHP,
                    role: currentPayload.role,
                });

                response.cookies.set("session", newJwt, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    path: "/",
                    expires: newExpires,
                });
            }
            return response;
        } catch (error) {
            console.error("Middleware token verification error:", error);
            const redirectResponse = NextResponse.redirect(new URL("/connexion", request.url));
            redirectResponse.cookies.delete("session");
            return redirectResponse;
        }
    }

    return response;
}

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
};
