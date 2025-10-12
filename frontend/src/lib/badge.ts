export const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();

    if (statusLower.includes("payé") || statusLower.includes("paye")) {
        return {
            badgeColor: "bg-green-500",
            textColor: "text-green-700",
            bgColor: "bg-green-50",
        };
    } else if (statusLower.includes("non payé") || statusLower.includes("non paye") || statusLower.includes("impayé")) {
        return {
            badgeColor: "bg-red-500",
            textColor: "text-red-700",
            bgColor: "bg-red-50",
        };
    } else if (statusLower.includes("en attente") || statusLower.includes("attente")) {
        return {
            badgeColor: "bg-yellow-500",
            textColor: "text-yellow-700",
            bgColor: "bg-yellow-50",
        };
    } else if (statusLower.includes("à voir") || statusLower.includes("a voir")) {
        return {
            badgeColor: "bg-orange-500",
            textColor: "text-orange-700",
            bgColor: "bg-orange-50",
        };
    } else {
        return {
            badgeColor: "bg-gray-500",
            textColor: "text-gray-700",
            bgColor: "bg-gray-50",
        };
    }
};
