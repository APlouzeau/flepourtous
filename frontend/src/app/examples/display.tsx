"use client";

import { useContext } from "react";
import { Context } from "./provider";

export type DisplayProps = {
    data: string;
};

export default function Display(props: DisplayProps) {
    const { data } = props;

    const { isOpen } = useContext(Context);

    return <div>{isOpen ? <div>{data}</div> : ""}</div>;
}
