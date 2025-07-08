import apiClient from "@/lib/axios";

interface UserProfileActionProps {
    nickName: string;
    firstName: string;
    lastName: string;
    mail: string;
    address: string;
    country: string;
    password?: string;
}

export async function changeUserProfile(editedUser: UserProfileActionProps) {
    // Le mot de passe est optionnel

    const updateData: {
        nickName: string;
        firstName: string;
        lastName: string;
        mail: string;
        address: string;
        country: string;
        password?: string; // Le mot de passe est optionnel
    } = {
        nickName: editedUser.nickName,
        firstName: editedUser.firstName,
        lastName: editedUser.lastName,
        mail: editedUser.mail,
        address: editedUser.address,
        country: editedUser.country,
        password: editedUser.password || "", // Assurez-vous que le mot de passe est inclus s'il est fourni
    };

    const response = await apiClient.post(`${process.env.NEXT_PUBLIC_API_URL}/updateUserProfile`, updateData, {
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,
    });
    return response.data; // Retourner les données mises à jour
}

export async function changeUserPassword(oldPassword: string, newPassword: string) {
    const updateData = {
        oldPassword: oldPassword,
        newPassword: newPassword,
    };

    const response = await apiClient.post(`${process.env.NEXT_PUBLIC_API_URL}/updateUserPassword`, updateData, {
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,
    });

    return response.data;
}
