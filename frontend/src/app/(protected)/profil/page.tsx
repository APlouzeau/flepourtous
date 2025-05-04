import Provider from "./profileContext";
import DisplayUserprofil from "./display";
import axios from "axios";
import { getCookieBackend } from "@/lib/session";

export default async function profilPage() {
    const cookie = await getCookieBackend();
    const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/userInformations`,
        {},
        {
            headers: {
                //Cookie: cookie,
                Cookie: `PHPSESSID=${cookie}`,
                "Content-Type": "application/json",
            },
            withCredentials: true,
        }
    );
    const userData = res.data.data;
    console.log("profilPage UserData", userData);

    return (
        <Provider initialUser={userData}>
            <DisplayUserprofil />
        </Provider>
    );
}
