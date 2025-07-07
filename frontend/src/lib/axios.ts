import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            if (typeof window !== "undefined") {
                window.location.href = "/connexion";
            }
        }
        // On propage l'erreur pour que le composant qui a fait l'appel puisse la gérer aussi.
        return Promise.reject(error);
    }
);

export default apiClient;
