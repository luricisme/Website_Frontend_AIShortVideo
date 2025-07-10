import { createStore } from "zustand/vanilla";

export type VideosSearchState = {
    searchQuery: string;
    isSearchActive: boolean;
};

export type VideosSearchActions = {
    setSearchQuery: (query: string) => void;
    clearSearch: () => void;
};

export type VideosSearchStore = VideosSearchState & VideosSearchActions;

export const initVideosSearchStore = (): VideosSearchState => {
    return {
        searchQuery: "",
        isSearchActive: false,
    };
};

export const defaultInitState: VideosSearchState = initVideosSearchStore();

export const createVideosSearchStore = (initState: VideosSearchState = defaultInitState) => {
    return createStore<VideosSearchStore>((set) => ({
        ...initState,
        setSearchQuery: (query: string) =>
            set((state) => ({ ...state, searchQuery: query, isSearchActive: !!query })),
        clearSearch: () => set((state) => ({ ...state, searchQuery: "", isSearchActive: false })),
        isSearchActive: false,
    }));
};
