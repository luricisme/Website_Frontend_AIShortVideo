"use client";
// import { useEffect } from "react";
// import { useUserStore } from "@/store/user-store"; // nếu bạn dùng Zustand

export default function UserInitializer({ children }: { children: React.ReactNode }) {
    // const fetchUser = useUserStore((state) => state.fetchUser);

    // useEffect(() => {
    //     fetchUser();
    // }, [fetchUser]);

    return <>{children}</>;
}
