"use client";

type acceptationProps = {
    document: string;
    version: string;
    slug: string;
    link: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
};

import { useTranslations } from "next-intl";

export default function Acceptation({ document, version, link, slug, checked, onChange }: acceptationProps) {
    const trad = useTranslations();
    const id = `${document}-${version}`;
    return (
        <div className="flex items-center mt-4">
            <input type="checkbox" name={id} id={id} checked={checked} onChange={(e) => onChange(e.target.checked)} />
            <div className="pl-4 text-right text-sm text-gray-500 dark:text-gray-400">
                {slug}
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-700 underline ml-1"
                >
                    {trad("common.view")}
                </a>
            </div>
        </div>
    );
}
