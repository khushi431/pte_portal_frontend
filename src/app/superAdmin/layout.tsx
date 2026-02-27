"use client";

import { ReactNode } from "react";
import { AppLayout } from "@/components/app-layout";
import { LayoutDashboard, Building2, CreditCard, Settings2, Users } from "lucide-react";

const navGroups = [
    {
        groupLabel: "Dashboard",
        items: [
            { label: "Dashboard", href: "/superAdmin/dashboard", icon: LayoutDashboard },
        ],
    },
    {
        groupLabel: "Management",
        items: [
            {
                label: "Tenants",
                icon: Building2,
                children: [
                    { label: "All Tenants", href: "/superAdmin/tenants" },
                    { label: "Add Tenant", href: "/superAdmin/tenants/new" },
                ],
            },
            { label: "Users", href: "/superAdmin/users", icon: Users },
        ],
    },
    {
        groupLabel: "Finance",
        items: [
            { label: "Billing", href: "/superAdmin/billing", icon: CreditCard },
        ],
    },
    {
        groupLabel: "System",
        items: [
            { label: "Settings", href: "/superAdmin/settings", icon: Settings2 },
        ],
    },
];

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
    return (
        <AppLayout
            pageTitle="Super Admin"
            brandName="PTE Portal"
            brandIcon="P"
            navGroups={navGroups}
            userName="Platform Admin"
            userRole="Super Admin"
            userInitials="PA"
        >
            {children}
        </AppLayout>
    );
}
