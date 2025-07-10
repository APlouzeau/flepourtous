import apiClient from "@/lib/axios";
import ResetPasswordForm from "./ResetPasswordForm";

export async function resetPassword(newPassword: string, confirmNewPassword: string) {
    const response = await apiClient.post(
        `${process.env.NEXT_PUBLIC_API_URL}/resetPassword`,
        { newPassword, confirmNewPassword },
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    return response.data;
}

export default function ResetPasswordPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Réinitialisation du mot de passe</h1>
            <ResetPasswordForm />
        </div>
    );
}
