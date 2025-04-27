import axios from "axios";
import { cookies } from "next/headers";

export async function getUserSession() {
    const cookie = (await cookies()).get("PHPSESSID");
    if (!cookie) return null;

    try {
        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/verifyConnect`,
            {},
            {
                headers: { Cookie: `PHPSESSID=${cookie.value}` },
                withCredentials: true,
            }
        );
        if (res.data.code === 1) {
            console.log("session ouverte");
            return res.data.data; // infos utilisateur
        }
        return null;
    } catch {
        return null;
    }
}
