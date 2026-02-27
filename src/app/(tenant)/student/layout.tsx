"use client";

import { ReactNode } from "react";
import { AppLayout } from "@/components/app-layout";
import { LayoutDashboard, PenLine, BarChart3, User } from "lucide-react";

const navGroups = [
    {
        groupLabel: "Dashboard",
        items: [
            { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
        ],
    },
    {
        groupLabel: "Practice",
        items: [
            {
                label: "Practice Tests",
                icon: PenLine,
                children: [
                    { label: "All Tests", href: "/student/practice" },
                    { label: "Mock Exams", href: "/student/practice/mock" },
                ],
            },
            { label: "Results", href: "/student/results", icon: BarChart3 },
        ],
    },
    {
        groupLabel: "Account",
        items: [
            { label: "My Profile", href: "/student/profile", icon: User },
        ],
    },
];

export default function StudentLayout({ children }: { children: ReactNode }) {
    return (
        <AppLayout
            pageTitle="Student Dashboard"
            brandName="PTE Portal"
            brandIcon="P"
            navGroups={navGroups}
            userName="Student"
            userRole="Student"
            userInitials="ST"
        >
            {children}
        </AppLayout>
    );
}