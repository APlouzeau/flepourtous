import apiClient from "./axios";

export async function forgetedPassword(mail: string) {
    const response = await apiClient.post(
        "/api/forgetedPassword",
        { mail },
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    if (response.data.code !== 0) {
        throw new Error(
            response.data.message || "Une erreur est survenue lors de la réinitialisation du mot de passe."
        );
    }
    return response.data;
}


export async function resetPassword(newPassword: string, confirmNewPassword: string) {
    const response = await apiClient.post(
        "/api/resetPassword",
        { newPassword, confirmNewPassword },
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    return response.data;
}