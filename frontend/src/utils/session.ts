"use client";

import axios from "axios";
import { useLoginStore } from "@/store/auth";

export const checkLoginStatus = async () => {
    const { setIsLoggedIn } = useLoginStore();
    try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/verifyConnect`).then((response) => {
            if (response.data.message == "Utilisateur connecté") {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        });
    } catch (error) {
        console.error("Erreur lors de la vérification de la connexion :", error);
    }
};
