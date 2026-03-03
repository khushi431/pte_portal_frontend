"use client";

import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AppSidebarContent, NavGroup } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { cn } from "@/lib/utils";

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
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const handleMenuClick = () => {
        // On small screens: open/close mobile drawer only
        if (typeof window !== "undefined" && window.innerWidth < 1024) {
            setMobileOpen((prev) => !prev);
            return;
        }

        // On desktop: collapse / expand sidebar
        setSidebarCollapsed((prev) => !prev);
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Desktop Sidebar — hidden on mobile */}
            <aside
                className={cn(
                    "hidden lg:flex lg:flex-col shrink-0 border-r border-slate-200 bg-white transition-[width] duration-200",
                    sidebarCollapsed ? "lg:w-20" : "lg:w-64 xl:w-72"
                )}
            >
                <AppSidebarContent
                    brandName={brandName}
                    brandIcon={brandIcon}
                    navGroups={navGroups}
                    collapsed={sidebarCollapsed}
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
                    onMenuClick={handleMenuClick}
                />
                <main className="flex-1 p-4 sm:p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
