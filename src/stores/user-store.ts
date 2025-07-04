import { createStore } from "zustand/vanilla";

import { User } from "@/types/user.types";

export type UserState = {
    user: User | null;
    isFetching: boolean;
    error: Error | null;
};

export type UserActions = {
    setUser: (user: User | null) => void;
    clearUser: () => void;
    setFetching: (isFetching: boolean) => void;
    setError: (error: Error | null) => void;
};

export type UserStore = UserState & UserActions;

export const initUserStore = (): UserState => {
    return {
        user: null,
        isFetching: false,
        error: null,
    };
};

export const defaultInitState: UserState = initUserStore();

export const createUserStore = (initState: UserState = defaultInitState) => {
    return createStore<UserStore>((set) => ({
        ...initState,
        isFetching: false,
        error: null,
        setUser: (user: User | null) =>
            set((state) => ({ ...state, user, isFetching: false, error: null })),
        setFetching: (isFetching: boolean) => set((state) => ({ ...state, isFetching })),
        setError: (error: Error | null) => set((state) => ({ ...state, error, isFetching: false })),
        clearUser: () => set((state) => ({ ...state, user: null, isFetching: false, error: null })),
    }));
};
