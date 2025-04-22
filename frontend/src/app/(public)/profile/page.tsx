"use client";
import { userDataProps } from "@/app/types/userData";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const [dataUser, setDataUser] = useState<userDataProps | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user`);
                setDataUser(response.data.data);
                if (response.data.message == "error") {
                    router.push("/connexion");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [router]);

    useEffect(() => {
        // Rediriger seulement quand le chargement est terminé et les données sont nulles
        if (!loading && dataUser === null) {
            router.push("/connexion");
        }
    }, [loading, dataUser, router]);

    return (
        <>
            <h2 className="mt-12 text-5xl font-bold text-center">Profil</h2>
            <p>Bienvenue sur votre profil !</p>
            <p>Voici vos informations :</p>
            {dataUser && (
                <>
                    <p>ID : {dataUser.idUser}</p>
                    <p>Mail : {dataUser.mail}</p>
                    <p>Prénom : {dataUser.firstName}</p>
                    <p>Nom : {dataUser.lastName}</p>
                    <p>Rôle : {dataUser.role}</p>
                </>
            )}
            <p>Vous êtes connecté !</p>
        </>
    );
}
