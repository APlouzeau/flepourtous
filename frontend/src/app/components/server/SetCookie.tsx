"use server";

import { userDataProps } from "@/app/types/userData";
import { cookies } from "next/headers";

export async function setCookie(userData: userDataProps) {
    const session = JSON.stringify(userData);
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    (await cookies()).set("session", session, { expires, httpOnly: true });
}

export async function getCookie() {
    const cookie = (await cookies()).get("session");
    return cookie;
}
