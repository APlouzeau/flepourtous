"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";

interface CancelConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
    message: string;
    code: number; // Le code de retour de checkDeleteEvent
    appointmentTitle?: string;
}

export default function CancelConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading = false,
    message,
    code,
    appointmentTitle,
}: CancelConfirmationModalProps) {
    // Déterminer l'icône et la couleur selon le code de retour
    const getModalStyle = () => {
        switch (code) {
            case 1: // Plus de 24h - pas de pénalité
                return {
                    icon: CheckCircle2,
                    iconColor: "text-green-600",
                    bgColor: "bg-green-50",
                    borderColor: "border-green-200",
                    title: "Annulation sans frais",
                    confirmVariant: "default" as const,
                };
            case 2: // Moins de 24h - avec pénalité
                return {
                    icon: AlertTriangle,
                    iconColor: "text-red-600",
                    bgColor: "bg-red-50",
                    borderColor: "border-red-200",
                    title: "Annulation avec frais",
                    confirmVariant: "destructive" as const,
                };
            default: // Erreur
                return {
                    icon: AlertTriangle,
                    iconColor: "text-gray-600",
                    bgColor: "bg-gray-50",
                    borderColor: "border-gray-200",
                    title: "Erreur",
                    confirmVariant: "destructive" as const,
                };
        }
    };

    const modalStyle = getModalStyle();
    const IconComponent = modalStyle.icon;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div
                        className={`flex items-center gap-3 p-3 rounded-lg ${modalStyle.bgColor} ${modalStyle.borderColor} border`}
                    >
                        <IconComponent className={`h-6 w-6 ${modalStyle.iconColor}`} />
                        <DialogTitle className="text-left">{modalStyle.title}</DialogTitle>
                    </div>
                    {appointmentTitle && (
                        <DialogDescription className="text-base font-medium text-gray-900 mt-2">
                            {appointmentTitle}
                        </DialogDescription>
                    )}
                </DialogHeader>

                <div className="py-4">
                    <DialogDescription className="text-gray-700 leading-relaxed">{message}</DialogDescription>
                </div>

                <DialogFooter className="gap-2 sm:gap-2">
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Annuler
                    </Button>
                    <Button variant={modalStyle.confirmVariant} onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Clock className="h-4 w-4 animate-spin mr-2" />
                                Annulation...
                            </>
                        ) : (
                            "Confirmer l'annulation"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
