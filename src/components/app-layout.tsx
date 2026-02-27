"use client";

import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AppSidebarContent, NavGroup } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";

interface AppLayoutProps {
    children: React.ReactNode;
    pageTitle: string;
    brandName: string;
    brandIcon: string;
    navGroups: NavGroup[];
    userName?: string;
    userRole?: string;
    userInitials?: string;
    notificationCount?: number;
}

export function AppLayout({
    children,
    pageTitle,
    brandName,
    brandIcon,
    navGroups,
    userName,
    userRole,
    userInitials,
    notificationCount = 18,
}: AppLayoutProps) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Desktop Sidebar — hidden on mobile */}
            <aside className="hidden lg:flex lg:flex-col lg:w-60 xl:w-64 shrink-0 border-r border-slate-200 bg-white shadow-sm">
                <AppSidebarContent
                    brandName={brandName}
                    brandIcon={brandIcon}
                    navGroups={navGroups}
                />
            </aside>

            {/* Mobile Sidebar — Sheet drawer */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetContent side="left" className="w-64 p-0 border-r border-slate-200">
                    <AppSidebarContent
                        brandName={brandName}
                        brandIcon={brandIcon}
                        navGroups={navGroups}
                        onLinkClick={() => setMobileOpen(false)}
                    />
                </SheetContent>
            </Sheet>

            {/* Main content */}
            <div className="flex flex-1 flex-col min-w-0">
                <AppHeader
                    pageTitle={pageTitle}
                    userName={userName}
                    userRole={userRole}
                    userInitials={userInitials}
                    notificationCount={notificationCount}
                    onMenuClick={() => setMobileOpen(true)}
                />
                <main className="flex-1 p-4 sm:p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
