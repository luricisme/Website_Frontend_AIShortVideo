import { VideoCreationProvider } from './_context/VideoCreationContext';
import { ReactNode } from 'react';
import { UserStoreProvider } from "@/providers/user-store-provider";
import WrapperSessionProvider from "@/app/(user)/_components/wrapper-session-provider";

interface LayoutProps {
    children: ReactNode;
}

export default function CreateVideoLayout({ children }: LayoutProps) {
    return (
        <VideoCreationProvider>
            <WrapperSessionProvider>
                <UserStoreProvider>
                    {children}
                </UserStoreProvider>
            </WrapperSessionProvider>
        </VideoCreationProvider>
    );
}