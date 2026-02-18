"use client";

import { useState } from "react";
import { Sidebar } from "@/components/pages/dashboard/sidebar";
import { Header } from "@/components/pages/dashboard/header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen flex w-full">
            {/* Sidebar — handles both mobile (slide-in) and desktop (fixed) internally */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Content Area */}
            <div className="flex-1 min-w-0 lg:ml-60">
                <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                <main className="p-6 lg:p-4">{children}</main>
            </div>
        </div>
    );
}