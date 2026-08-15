import apiClient from "@/lib/axios";

export async function orderPacks(selectedLesson: string, selectedDuration: string, selectedPack: string) {
    try {
        const response = await apiClient("/api/orderPacks", {
            method: "POST",
            data: {
                idLesson: selectedLesson,
                duration: selectedDuration,
                pack: selectedPack,
            },
        });

        if (response.data) {
            return response.data;
        }
    } catch (error) {
        console.error("Erreur lors de la création du pack :", error);
    }
}
