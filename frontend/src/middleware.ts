import { NextRequest, NextResponse } from "next/server";
import { verifyToken, generateRefreshedToken } from "./lib/session";

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
// Rafraîchir si le token a plus de 30 minutes (la moitié de sa durée de vie de 1h)
const REFRESH_IF_OLDER_THAN_MS = ONE_HOUR_IN_MS / 2;

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    // Commencer par une réponse par défaut qui continue la chaîne des middlewares
    const response = NextResponse.next();

    if (isProtectedRoute.includes(pathname)) {
        const sessionCookie = request.cookies.get("session");
        const sessionToken = sessionCookie?.value;

        if (!sessionToken) {
            return NextResponse.redirect(new URL("/connexion", request.url));
        }

        try {
            const currentPayload = await verifyToken(sessionToken);
            // verifyToken retourne le payload qui inclut 'iat' (issued at) et 'exp' (expiration time) en secondes

            if (
                !currentPayload ||
                typeof currentPayload.iat !== "number" ||
                typeof currentPayload.cookiePHP !== "string" ||
                typeof currentPayload.role !== "string"
            ) {
                // Payload invalide ou incomplet, traiter comme non authentifié
                const redirectResponse = NextResponse.redirect(new URL("/connexion", request.url));
                redirectResponse.cookies.delete("session"); // Supprimer le cookie potentiellement corrompu
                return redirectResponse;
            }

            const issuedAtMs = currentPayload.iat * 1000;
            const currentTimeMs = Date.now();

            // Vérifier si le token a besoin d'être rafraîchi
            if (currentTimeMs - issuedAtMs > REFRESH_IF_OLDER_THAN_MS) {
                const { token: newJwt, expires: newExpires } = await generateRefreshedToken({
                    cookiePHP: currentPayload.cookiePHP,
                    role: currentPayload.role,
                });

                // Mettre à jour la réponse pour définir le nouveau cookie
                response.cookies.set("session", newJwt, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production", // Utiliser true en production
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

    return response; // Pour les routes non protégées
}

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
