import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const isProtectedRoute = ["/calendrier", "/profil"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const authStatus = (await cookies()).get("session")?.value;
    console.log("Auth status:", authStatus);
    if (isProtectedRoute.includes(pathname)) {
        if (!authStatus) {
            return NextResponse.redirect(new URL("/connexion", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
