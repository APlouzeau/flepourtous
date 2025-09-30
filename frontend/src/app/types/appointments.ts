export interface showBasicAppointmentProps {
    idEvent: string;
    title: string;
    studentName: string;
    description: string;
    duration: string;
    status: string;
    visioLink: string;
    startDateTime: string;
    timezone: string;
}

export interface showInvoicableAppointmentProps extends showBasicAppointmentProps {
    status: string;
    price: number;
    isInvoiced: number | null;
}

export interface AppointmentRowProps {
    listAppointments: showBasicAppointmentProps[];
}

export interface InvoiceRowProps {
    invoiceList: showInvoicableAppointmentProps[];
}
