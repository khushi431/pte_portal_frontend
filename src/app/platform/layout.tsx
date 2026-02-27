"use client";

import { ReactNode } from "react";
import { AppLayout } from "@/components/app-layout";
import { LayoutDashboard, GraduationCap, TrendingUp } from "lucide-react";

const navGroups = [
    {
        groupLabel: "Dashboard",
        items: [
            { label: "Dashboard", href: "/platform/dashboard", icon: LayoutDashboard },
        ],
    },
    {
        groupLabel: "Students",
        items: [
            { label: "Students", href: "/platform/student", icon: GraduationCap },
        ],
    },
    {
        groupLabel: "Analytics",
        items: [
            { label: "Reports", href: "/platform/reports", icon: TrendingUp },
        ],
    },
];

export default function PlatformLayout({ children }: { children: ReactNode }) {
    return (
        <AppLayout
            pageTitle="Platform Console"
            brandName="PTE Portal"
            brandIcon="P"
            navGroups={navGroups}
            userName="Platform Owner"
            userRole="Platform"
            userInitials="PO"
        >
            {children}
        </AppLayout>
    );
}
