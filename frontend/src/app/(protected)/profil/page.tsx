import Provider from "./profileContext";
import DisplayUserprofil from "./display";
import axios from "axios";
import { getCookieBackend, getCountry } from "@/lib/session";

export default async function profilPage() {
    const cookie = await getCookieBackend();
    const country = await getCountry();
    const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/userInformations`,
        {},
        {
            headers: {
                Cookie: `PHPSESSID=${cookie}`,
                "Content-Type": "application/json",
            },
            withCredentials: true,
        }
    );
    const userData = res.data.data;
    return (
        <div>
            <div>{country}</div>
            <Provider initialUser={userData}>
                <DisplayUserprofil />
            </Provider>
        </div>
    );
}
