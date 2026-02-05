import ResetPasswordForm from "./ResetPasswordForm";


export default function ResetPasswordPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Réinitialisation du mot de passe</h1>
            <ResetPasswordForm />
        </div>
    );
}
