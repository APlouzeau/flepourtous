"use client";

import apiClient from "@/lib/axios";
import { useEffect } from "react";
import { useLoginStore } from "@/store/auth";

export function useVerifyConnect() {
    const { isLoggedIn, setIsLoggedIn } = useLoginStore();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await apiClient.post("/api/verifyConnect`);
                if (response.data.message === "Utilisateur connecté") {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error("Erreur lors de la vérification de la connexion :", error);
                setIsLoggedIn(false);
            }
        };
        checkLoginStatus();
    }, [setIsLoggedIn]);
    return isLoggedIn;
}
