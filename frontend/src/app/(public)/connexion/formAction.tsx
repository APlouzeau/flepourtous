import axios from "axios";

export async function connexionAction(formData: FormData) {
    const mail = formData.get("mail");
    const password = formData.get("password");

    try {
        const response = await axios
            .post(
                `${process.env.NEXT_PUBLIC_API_URL}/login`,
                {
                    mail,
                    password,
                },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((response) => {
                if (response.data.code === 1) {
                    console.log("Connexion réussie");
                } else {
                    console.error("Erreur lors de la connexion", response.data.message);
                }
            });
    } catch (error) {
        console.error("Erreur lors de la connexion", error);
    }
}
