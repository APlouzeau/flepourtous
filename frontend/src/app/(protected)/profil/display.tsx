"use client";

import { useContext } from "react";
import { Context } from "./profileContext";

export default function DisplayUserprofil() {
    const { dataUser } = useContext(Context);

    return (
        <>
            <h2 className="mt-12 text-5xl font-bold text-center">Profil</h2>
            <p>Bienvenue sur votre profil !</p>
            <p>Voici vos informations :</p>
            {dataUser && (
                <>
                    <p>Pseudo : {dataUser.nickName}</p>
                    <p>Mail : {dataUser.mail}</p>
                    <p>Prénom : {dataUser.firstName}</p>
                    <p>Nom : {dataUser.lastName}</p>
                    <p>Porte-Monnaie disponible : {dataUser.wallet} $</p>
                </>
            )}
            <p>Vous êtes connecté !</p>
        </>
    );
}
