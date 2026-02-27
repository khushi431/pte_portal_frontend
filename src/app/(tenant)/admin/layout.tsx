"use client";

import { ReactNode } from "react";
import { AppLayout } from "@/components/app-layout";
import {
    LayoutDashboard, GraduationCap, Users, BookOpen, GitBranch, ClipboardList,
} from "lucide-react";

const navGroups = [
    {
        groupLabel: "Dashboard",
        items: [
            { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        ],
    },
    {
        groupLabel: "Course",
        items: [
            {
                label: "Question Bank",
                icon: BookOpen,
                children: [
                    { label: "All Questions", href: "/admin/questionBank" },
                    { label: "Add Question", href: "/admin/questionBank/add" },
                ],
            },
            {
                label: "Tests",
                icon: ClipboardList,
                children: [
                    { label: "All Tests", href: "/admin/tests" },
                ],
            },
        ],
    },
    {
        groupLabel: "Student",
        items: [
            {
                label: "Students",
                icon: GraduationCap,
                children: [
                    { label: "All Students", href: "/admin/users" },
                    { label: "Enroll Student", href: "/admin/users/enroll" },
                ],
            },
        ],
    },
    {
        groupLabel: "Staff",
        items: [
            { label: "Teachers", href: "/admin/teachers", icon: Users },
            { label: "Branches", href: "/admin/branches", icon: GitBranch },
        ],
    },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <AppLayout
            pageTitle="Admin Panel"
            brandName="PTE Portal"
            brandIcon="P"
            navGroups={navGroups}
            userName="Institute Admin"
            userRole="Admin"
            userInitials="IA"
        >
            {children}
        </AppLayout>
    );
}