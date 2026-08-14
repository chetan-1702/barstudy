"use client";

import Sidebar from "./Sidebar";

export default function AppShell({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-[#f6f7fb] text-slate-900">
            <Sidebar />

            <main className="min-w-0 flex-1">
                {children}
            </main>
        </div>
    );
}
