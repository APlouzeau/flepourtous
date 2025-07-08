export interface UserDataProps {
    idUser: number;
    nickName: string;
    firstName: string;
    mail: string;
    lastName: string;
    role: string;
    wallet: number;
    address?: string;
    country?: string;
    password?: string; // Le mot de passe est optionnel
}
