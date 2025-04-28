import { cookies } from "next/headers";
import axios from "axios";

export async function checkLoginStatus() {
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
            return res.data.data; // ou ce que tu veux afficher dans Header
        }
        return null;
    } catch {
        return null;
    }
}
