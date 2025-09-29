export interface showBasicAppointmentProps {
    idEvent: number;
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
    studentName: string;
    duration: string;
    status: string;
    startDateTime: string;
    price: number;
    isInvoiced: boolean;
}

export interface AppointmentRowProps {
    listAppointments: showBasicAppointmentProps[];
}

export interface InvoiceRowProps {
    invoiceList: showInvoicableAppointmentProps[];
}
