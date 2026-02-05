import { useMemo } from "react";
import { showInvoicableAppointmentProps } from "@/app/[locale]/types/appointments";

export function useFilterOptions(invoiceList: showInvoicableAppointmentProps[]) {
    const statusOptions = useMemo(
        () =>
            [...new Set(invoiceList.map((element) => element.status))].map((status) => ({
                value: status,
                label: status,
            })),
        [invoiceList],
    );

    const invoicedOptions = useMemo(
        () => [
            { value: "0", label: "À facturer" },
            { value: "1", label: "Facturé" },
        ],
        [],
    );

    return { statusOptions, invoicedOptions };
}
