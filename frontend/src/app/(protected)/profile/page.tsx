import Provider from "./profileContext";
import DisplayUserProfile from "./display";
import axios from "axios";
import { cookies } from "next/headers";

export default async function ProfilePage() {
    const cookie = (await cookies()).get("PHPSESSID");
    const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/userInformations`,
        {},
        {
            headers: {
                Cookie: `PHPSESSID=${cookie?.value}`,
                "Content-Type": "application/json",
            },
            withCredentials: true,
        }
    );
    const userData = res.data.data;
    console.log("ProfilePage UserData", userData);

    return (
        <Provider initialUser={userData}>
            <DisplayUserProfile />
        </Provider>
    );
}
