import { createStore } from "zustand/vanilla";

import { User } from "@/types/user.types";

export type UserState = {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
};

export type UserActions = {
    setUser: (user: User) => void;
    clearUser: () => void;
};

export type UserStore = UserState & UserActions;

export const initUserStore = (): UserState => {
    return {
        user: null,
        setUser: () => {},
        clearUser: () => {},
    };
};

export const defaultInitState: UserState = initUserStore();

export const createUserStore = (initState: UserState = defaultInitState) => {
    return createStore<UserStore>((set) => ({
        ...initState,
        setUser: (user: User) => set((state) => ({ ...state, user })),
        clearUser: () => set((state) => ({ ...state, user: null })),
    }));
};
