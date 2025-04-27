"use server";
import Provider from "./profileContext";
import DisplayUserProfile from "./display";
import axios from "axios";

export default async function ProfilePage() {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/userInformations`, {
        withCredentials: true,
    });
    console.log("res", res.data);
    const userData = res.data;

    return (
        <Provider initialUser={userData}>
            <DisplayUserProfile />
        </Provider>
    );
}
