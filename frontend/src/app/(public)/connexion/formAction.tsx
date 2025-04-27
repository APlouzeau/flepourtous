"use server";
import axios from "axios";

export async function connexionAction(formData: FormData) {
    const mail = formData.get("mail");
    const password = formData.get("password");
    console.log("Connexion formData", formData);
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/login`,
            { mail, password },
            { withCredentials: true, headers: { "Content-Type": "application/json" } }
        );
        if (response.data.code === 1) {
            console.log("Connexion réussie", response.data);
        } else {
            return { success: false, message: response.data.message };
        }
    } catch (error) {
        return { success: false, message: "Erreur lors de la connexion" };
    }
}
