"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Difficulty } from "../types";

interface QuestionFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    difficulty: Difficulty | "all";
    onDifficultyChange: (value: Difficulty | "all") => void;
    status: "active" | "draft" | "archived" | "all";
    onStatusChange: (value: "active" | "draft" | "archived" | "all") => void;
}

const DIFFICULTY_OPTIONS: { value: Difficulty | "all"; label: string }[] = [
    { value: "all", label: "All Levels" },
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
];

const STATUS_OPTIONS: { value: "active" | "draft" | "archived" | "all"; label: string }[] = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "draft", label: "Draft" },
    { value: "archived", label: "Archived" },
];

export function QuestionFilters({
    search,
    onSearchChange,
    difficulty,
    onDifficultyChange,
    status,
    onStatusChange,
}: QuestionFiltersProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input
                    placeholder="Search questions..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9"
                />
            </div>

            {/* Difficulty filter */}
            <select
                value={difficulty}
                onChange={(e) => onDifficultyChange(e.target.value as Difficulty | "all")}
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm text-slate-700 outline-none focus:border-ring focus:ring-ring/50 focus:ring-[3px]"
            >
                {DIFFICULTY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>

            {/* Status filter */}
            <select
                value={status}
                onChange={(e) =>
                    onStatusChange(
                        e.target.value as "active" | "draft" | "archived" | "all"
                    )
                }
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm text-slate-700 outline-none focus:border-ring focus:ring-ring/50 focus:ring-[3px]"
            >
                {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
