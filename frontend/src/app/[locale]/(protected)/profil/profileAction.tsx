import { UserDataProps } from "@/app/[locale]/types/userData";
import apiClient from "@/lib/axios";

export async function changeUserProfile(editedUser: UserDataProps) {
    // Le mot de passe est optionnel

    const updateData: {
        nickName: string;
        firstName: string;
        lastName: string;
        mail: string;
        address?: string;
        address2?: string;
        address3?: string;
        zip?: string;
        city?: string;
        country?: string;
        password?: string;
    } = {
        nickName: editedUser.nickName,
        firstName: editedUser.firstName,
        lastName: editedUser.lastName,
        mail: editedUser.mail,
        address: editedUser?.address,
        address2: editedUser?.address2,
        address3: editedUser?.address3,
        zip: editedUser?.zip,
        city: editedUser?.city,
        country: editedUser?.country,
        password: editedUser?.password || "",
    };

    const response = await apiClient.post("/api/updateUserProfile", updateData, {
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,
    });
    return response.data; // Retourner les données mises à jour
}

export async function changeUserPassword(oldPassword: string, newPassword: string, confirmNewPassword: string) {
    if (newPassword !== confirmNewPassword) {
        return { code: 0, message: "Les nouveaux mots de passe ne correspondent pas." };
    }

    const updateData = {
        oldPassword: oldPassword,
        newPassword: newPassword,
        confirmNewPassword: confirmNewPassword,
    };

    const response = await apiClient.post("/api/updateUserPassword", updateData, {
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,
    });

    return response.data;
}
