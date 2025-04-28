import axios from "axios";
import { cookies } from "next/headers";

export const checkLoginStatus = async () => {
    try {
        const cookie = (await cookies()).get("PHPSESSID");
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/verifyConnect`,
            {},
            {
                headers: {
                    Cookie: `PHPSESSID=${cookie?.value}`,
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            }
        );
        if (response.data.message == "Utilisateur connecté") {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Erreur lors de la vérification de la connexion :", error);
        return false;
    }
};
