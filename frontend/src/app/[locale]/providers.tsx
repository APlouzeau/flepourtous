// providers.tsx
"use client";

import { NextIntlClientProvider } from "next-intl";
import { PropsWithChildren } from "react";

export const Providers = (props: PropsWithChildren<{ locale: string; messages: Record<string, unknown> }>) => {
    return (
        <NextIntlClientProvider locale={props.locale} messages={props.messages}>
            {props.children}
        </NextIntlClientProvider>
    );
};
