"use client";

import { ReactNode } from "react";
import { AppLayout } from "@/components/app-layout";
import {
    LayoutDashboard,
    Building2,
    CreditCard,
    Settings2,
    Users,
    BookOpen,
    ListChecks,
} from "lucide-react";

const navGroups = [
    {
        groupLabel: "Dashboard",
        items: [
            { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        ],
    },
    {
        groupLabel: "Management",
        items: [
            {
                label: "Tenants",
                icon: Building2,
                children: [
                    { label: "All Tenants", href: "/tenants" },
                    { label: "Add Tenant", href: "/tenants/new" },
                ],
            },
            { label: "Users", href: "/users", icon: Users },
        ],
    },
    {
        groupLabel: "Content",
        items: [
            {
                label: "Question Bank",
                icon: BookOpen,
                children: [
                    { label: "All Questions", href: "/questionBank" },
                    { label: "Add Question", href: "/questionBank/create" },
                ],
            },
            {
                label: "Question Types",
                icon: ListChecks,
                children: [
                    { label: "All Types", href: "/questionTypes" },
                ],
            },
        ],
    },
    {
        groupLabel: "Finance",
        items: [
            { label: "Billing", href: "/billing", icon: CreditCard },
        ],
    },
    {
        groupLabel: "System",
        items: [
            { label: "Settings", href: "/settings", icon: Settings2 },
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
