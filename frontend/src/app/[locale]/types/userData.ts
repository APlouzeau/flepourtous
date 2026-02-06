export interface UserDataProps {
    idUser: number;
    nickName: string;
    firstName: string;
    mail: string;
    lastName: string;
    role: string;
    wallet: number;
    address?: string;
    address2?: string;
    address3?: string;
    zip?: string;
    city?: string;
    country?: string;
    password?: string; // Le mot de passe est optionnel
}
