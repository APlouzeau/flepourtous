"use client";

import { useEffect, useState } from "react";

type User = {
    mail: string;
};

export default function MyComponent() {
    const [data, setData] = useState<User[]>();

    useEffect(() => {
        fetch("http://flepourtous.localhost/api/users", {
            credentials: "same-origin",
        })
            .then((response) => response.json())
            .then((data) => setData(data));
    }, []);

    return (
        <div>
            <p>{data ? data[0].mail : "Loading..."}</p>
        </div>
    );
}
