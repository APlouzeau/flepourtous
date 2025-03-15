"use client";

import { useEffect, useState } from "react";
export default function MyComponent() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch("http://flepourtous.localhost/users")
            .then((response) => response.json())
            .then((data) => setData(data));
    }, []);
    console.log(data);
    return <div>{data ? <p>{data[0].mail}</p> : <p>Loading...</p>}</div>;
}
