export type AppointmentStatusCode =
    | "paid"
    | "paid_admin"
    | "unpaid"
    | "pending"
    | "google"
    | "unknown"
    | "cancelled_refunded"
    | "cancelled_not_refunded"
    | "cancelled_admin"
    | "cancelled_google_not_refunded"
    | "cancelled_google_refunded"
    | "cancelled_unpaid";

const STATUS_STYLES: Record<AppointmentStatusCode, { badgeColor: string; textColor: string; bgColor: string }> = {
    paid: { badgeColor: "bg-green-500", textColor: "text-green-700", bgColor: "bg-green-50" },
    paid_admin: { badgeColor: "bg-green-500", textColor: "text-green-700", bgColor: "bg-green-50" },
    unpaid: { badgeColor: "bg-red-500", textColor: "text-red-700", bgColor: "bg-red-50" },
    pending: { badgeColor: "bg-yellow-500", textColor: "text-yellow-700", bgColor: "bg-yellow-50" },
    google: { badgeColor: "bg-blue-500", textColor: "text-blue-700", bgColor: "bg-blue-50" },
    cancelled_refunded: { badgeColor: "bg-gray-500", textColor: "text-gray-700", bgColor: "bg-gray-50" },
    cancelled_not_refunded: { badgeColor: "bg-gray-500", textColor: "text-gray-700", bgColor: "bg-gray-50" },
    cancelled_admin: { badgeColor: "bg-gray-500", textColor: "text-gray-700", bgColor: "bg-gray-50" },
    cancelled_google_not_refunded: { badgeColor: "bg-gray-500", textColor: "text-gray-700", bgColor: "bg-gray-50" },
    cancelled_google_refunded: { badgeColor: "bg-gray-500", textColor: "text-gray-700", bgColor: "bg-gray-50" },
    cancelled_unpaid: { badgeColor: "bg-gray-500", textColor: "text-gray-700", bgColor: "bg-gray-50" },
    unknown: { badgeColor: "bg-gray-500", textColor: "text-gray-700", bgColor: "bg-gray-50" },
};

export function getStatusBadgeData(status: string) {
    const code = (status in STATUS_STYLES ? status : "unknown") as AppointmentStatusCode;
    return { code, labelKey: `calendar.status.${code}`, ...STATUS_STYLES[code] };
}
