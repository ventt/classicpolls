// app/components/CloseDetailsOnRouteChange.tsx
'use client';

import {usePathname} from 'next/navigation';
import {useEffect} from 'react';

export default function CloseDetailsOnRouteChange() {
    const pathname = usePathname();

    useEffect(() => {
        // Close all open details when the URL path changes
        document.querySelectorAll<HTMLDetailsElement>('details[open]')
            .forEach(d => d.removeAttribute('open'));
    }, [pathname]);

    return null;
}
