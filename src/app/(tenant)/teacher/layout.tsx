"use client";

import { ReactNode } from "react";
import { AppLayout } from "@/components/app-layout";
import { LayoutDashboard, GraduationCap, ClipboardList, BookOpen } from "lucide-react";

const navGroups = [
    {
        groupLabel: "Dashboard",
        items: [
            { label: "Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
        ],
    },
    {
        groupLabel: "Students",
        items: [
            {
                label: "My Students",
                icon: GraduationCap,
                children: [
                    { label: "Student List", href: "/teacher/students" },
                    { label: "Progress Reports", href: "/teacher/students/progress" },
                ],
            },
        ],
    },
    {
        groupLabel: "Content",
        items: [
            {
                label: "Tests",
                icon: ClipboardList,
                children: [
                    { label: "All Tests", href: "/teacher/tests" },
                    { label: "Create Test", href: "/teacher/tests/create" },
                ],
            },
            { label: "Question Bank", href: "/teacher/questionBank", icon: BookOpen },
        ],
    },
];

export default function TeacherLayout({ children }: { children: ReactNode }) {
    return (
        <AppLayout
            pageTitle="Teacher Panel"
            brandName="PTE Portal"
            brandIcon="P"
            navGroups={navGroups}
            userName="Teacher"
            userRole="Teacher"
            userInitials="TC"
        >
            {children}
        </AppLayout>
    );
}
