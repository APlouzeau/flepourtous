import { create } from "zustand";

type LoginStore = {
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
};

export const useLoginStore = create<LoginStore>((set) => ({
    isLoggedIn: false,
    setIsLoggedIn: (value: boolean) => set({ isLoggedIn: value }),
}));
