'use client';

import {createPortal} from 'react-dom';
import {useEffect, useState} from 'react';

type Props = {
    open: boolean;
    onCancel: () => void;
    onConfirm: () => void;
};

export default function ConfirmDialog({open, onCancel, onConfirm}: Props) {
    // Avoid SSR mismatch
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    // Lock background scroll while open
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    if (!mounted || !open) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999]">
            {/* Dim entire site */}
            <div className="absolute inset-0 bg-black/50"/>

            {/* Center in the viewport */}
            <div className="fixed inset-0 flex items-center justify-center">
                <div className="bg-gray-900 text-white p-6 rounded-lg shadow-xl w-80">
                    <h2 className="text-lg font-semibold mb-2">Confirm Delete</h2>
                    <p className="text-sm mb-1">Are you sure you want to permanently delete this?</p>
                    <p className="text-sm font-bold text-red-500 mb-5">This action cannot be undone.</p>

                    <div className="flex justify-end gap-3">
                        <button
                            className="px-3 py-1 rounded-md bg-gray-600 hover:bg-gray-500 transition"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>

                        <button
                            className="px-3 py-1 rounded-md bg-red-700 hover:bg-red-600 transition cursor-pointer"
                            onClick={onConfirm}
                        >
                            Yes, Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
