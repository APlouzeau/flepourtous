import Provider from "./profileContext";
import DisplayUserprofil from "./display";
import apiClient from "@/lib/axios";
import { getCookieBackend } from "@/lib/session";

export default async function profilPage() {
    const cookie = await getCookieBackend();
    const res = await apiClient.post(
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
            <Provider initialUser={userData}>
                <DisplayUserprofil />
            </Provider>
        </div>
    );
}
