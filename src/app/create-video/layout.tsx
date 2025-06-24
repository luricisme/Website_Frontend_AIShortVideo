import { VideoCreationProvider } from './_context/VideoCreationContext';
import { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

export default function CreateVideoLayout({ children }: LayoutProps) {
    return (
        <VideoCreationProvider>
            {children}
        </VideoCreationProvider>
    );
}