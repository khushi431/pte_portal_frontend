"use client";

import { Input } from "@/components/ui/input";
import { TestStatus, PteModule } from "../types";
import { PTE_MODULES } from "@/modules/questionBank/constants/modules";

interface TestFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    status: TestStatus | "all";
    onStatusChange: (value: TestStatus | "all") => void;
    module: PteModule | "all";
    onModuleChange: (value: PteModule | "all") => void;
    isPublic: "all" | "public" | "private";
    onIsPublicChange: (value: "all" | "public" | "private") => void;
}

export function TestFilters({
    search,
    onSearchChange,
    status,
    onStatusChange,
    module,
    onModuleChange,
    isPublic,
    onIsPublicChange,
}: TestFiltersProps) {
    return (
        <div className="flex flex-wrap items-center gap-3">
            <Input
                placeholder="Search tests..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-9 w-full sm:w-[240px] text-sm"
            />

            <select
                value={status}
                onChange={(e) => onStatusChange(e.target.value as TestStatus | "all")}
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm text-slate-700 outline-none focus:border-primary focus:ring-primary/30 focus:ring-[3px]"
                aria-label="Filter by status"
            >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
            </select>

            <select
                value={module}
                onChange={(e) => onModuleChange(e.target.value as PteModule | "all")}
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm text-slate-700 outline-none focus:border-primary focus:ring-primary/30 focus:ring-[3px]"
                aria-label="Filter by module"
            >
                <option value="all">All Modules</option>
                {PTE_MODULES.map((mod) => (
                    <option key={mod.id} value={mod.id}>
                        {mod.label}
                    </option>
                ))}
            </select>

            <select
                value={isPublic}
                onChange={(e) => onIsPublicChange(e.target.value as "all" | "public" | "private")}
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm text-slate-700 outline-none focus:border-primary focus:ring-primary/30 focus:ring-[3px]"
                aria-label="Filter by visibility"
            >
                <option value="all">All Visibility</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
            </select>
        </div>
    );
}
