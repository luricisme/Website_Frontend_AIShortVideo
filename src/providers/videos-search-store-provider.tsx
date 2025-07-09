"use client";

import { useStore } from "zustand";
import { createContext, useRef, useContext, ReactNode } from "react";

import {
    createVideosSearchStore,
    initVideosSearchStore,
    type VideosSearchStore,
} from "@/stores/video-search-store";

export type VideosSearchStoreApi = ReturnType<typeof createVideosSearchStore>;

export const VideosSearchStoreContext = createContext<VideosSearchStoreApi | undefined>(undefined);

export interface VideosSearchStoreProviderProps {
    children: ReactNode;
}

export const VideosSearchStoreProvider = ({ children }: VideosSearchStoreProviderProps) => {
    const storeRef = useRef<VideosSearchStoreApi | null>(null);
    if (!storeRef.current) {
        storeRef.current = createVideosSearchStore(initVideosSearchStore());
    }

    return (
        <VideosSearchStoreContext.Provider value={storeRef.current}>
            {children}
        </VideosSearchStoreContext.Provider>
    );
};

export const useVideosSearchStore = <T,>(selector: (store: VideosSearchStore) => T): T => {
    const userStoreContext = useContext(VideosSearchStoreContext);
    if (!userStoreContext)
        throw new Error("useVideosSearchStore must be used within VideosSearchStoreProvider");
    return useStore(userStoreContext, selector);
};
