'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateVideoPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/create-video/script');
    }, [router]);

    return null;
}