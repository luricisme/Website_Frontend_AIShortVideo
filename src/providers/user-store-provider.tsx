"use client";

import { useStore } from "zustand";
import { createContext, useRef, useContext, ReactNode } from "react";

import { createUserStore, initUserStore, type UserStore } from "@/stores/user-store";

export type UserStoreApi = ReturnType<typeof createUserStore>;

export const UserStoreContext = createContext<UserStoreApi | undefined>(undefined);

export interface UserStoreProviderProps {
    children: ReactNode;
}

export const UserStoreProvider = ({ children }: UserStoreProviderProps) => {
    const storeRef = useRef<UserStoreApi | null>(null);
    if (!storeRef.current) {
        storeRef.current = createUserStore(initUserStore());
    }

    return (
        <UserStoreContext.Provider value={storeRef.current}>{children}</UserStoreContext.Provider>
    );
};

export const useUserStore = <T,>(selector: (store: UserStore) => T): T => {
    const userStoreContext = useContext(UserStoreContext);
    if (!userStoreContext) throw new Error("useUserStore must be used within UserStoreProvider");
    return useStore(userStoreContext, selector);
};
