import React from "react";

export default function ShortsLayout({ children }: { children: React.ReactNode }) {
    return <div className="overflow-hidden">{children}</div>;
}
