"use client";

import { Test } from "../types";
import { AppTable, AppTableColumn } from "@/components/ui/app-table";
import { Badge } from "@/components/ui/badge";
import { ActionIconButton } from "@/components/ui/action-icon-button";
import { Eye, Pencil, Trash2, Clock, FileQuestion, Users, Award, Globe, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
// Simple date formatter
function formatTimeAgo(date: string): string {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return past.toLocaleDateString();
}
import { PTE_MODULES } from "@/modules/questionBank/constants/modules";

interface TestListViewProps {
    tests: Test[];
    basePath: string;
    onView: (test: Test) => void;
    onEdit: (test: Test) => void;
    onDelete: (test: Test) => void;
}

const STATUS_STYLES: Record<string, string> = {
    draft: "bg-slate-50 text-slate-600 border-slate-200",
    published: "bg-green-50 text-green-700 border-green-200",
    scheduled: "bg-blue-50 text-blue-700 border-blue-200",
    archived: "bg-gray-50 text-gray-600 border-gray-200",
};

export function TestListView({ tests, onView, onEdit, onDelete }: TestListViewProps) {
    const getModuleLabels = (modules: string[]) => {
        return modules.map((mod) => {
            const moduleInfo = PTE_MODULES.find((m) => m.id === mod);
            return moduleInfo?.label || mod;
        }).join(", ");
    };

    const columns: AppTableColumn<Test>[] = [
        {
            id: "title",
            header: "Test Title",
            thClassName: "min-w-[300px] max-w-[400px]",
            tdClassName: "min-w-[300px] max-w-[400px]",
            cell: (test) => (
                <div className="space-y-1.5 pr-2">
                    <div className="flex items-start gap-2">
                        <h4 className="font-semibold text-slate-900 break-words">{test.title}</h4>
                        <div className="shrink-0 mt-0.5" title={test.isPublic ? "Public" : "Private"}>
                            {test.isPublic ? (
                                <Globe className="size-3.5 text-slate-400" />
                            ) : (
                                <Lock className="size-3.5 text-slate-400" />
                            )}
                        </div>
                    </div>
                    {test.description && (
                        <p className="text-xs text-slate-500 break-words line-clamp-2">{test.description}</p>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                            variant="secondary"
                            className={cn("text-xs capitalize shrink-0", STATUS_STYLES[test.status])}
                        >
                            {test.status}
                        </Badge>
                        <span className="text-xs text-slate-500 break-words">
                            {getModuleLabels(test.modules)}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            id: "details",
            header: "Details",
            thClassName: "hidden lg:table-cell whitespace-nowrap w-[180px]",
            tdClassName: "hidden lg:table-cell whitespace-nowrap w-[180px]",
            cell: (test) => (
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock className="size-3.5 text-slate-400 shrink-0" />
                        <span>{test.duration} min</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <FileQuestion className="size-3.5 text-slate-400 shrink-0" />
                        <span>{test.totalQuestions} questions</span>
                    </div>
                    {test.passingScore && (
                        <div className="text-xs text-slate-500">
                            Passing: {test.passingScore}%
                        </div>
                    )}
                </div>
            ),
        },
        {
            id: "stats",
            header: "Statistics",
            thClassName: "hidden xl:table-cell text-right whitespace-nowrap w-[180px]",
            tdClassName: "hidden xl:table-cell text-right whitespace-nowrap w-[180px]",
            cell: (test) => (
                <div className="space-y-1.5 text-right">
                    {test.completedCount !== undefined && (
                        <div className="flex items-center justify-end gap-2 text-sm text-slate-600">
                            <Users className="size-3.5 text-slate-400 shrink-0" />
                            <span>{test.completedCount} completed</span>
                        </div>
                    )}
                    {test.averageScore !== undefined && (
                        <div className="flex items-center justify-end gap-2 text-sm text-slate-600">
                            <Award className="size-3.5 text-slate-400 shrink-0" />
                            <span>{test.averageScore.toFixed(1)}% avg</span>
                        </div>
                    )}
                    {test.completedCount === undefined && test.averageScore === undefined && (
                        <span className="text-xs text-slate-400">No data yet</span>
                    )}
                </div>
            ),
        },
        {
            id: "updated",
            header: "Updated",
            thClassName: "hidden md:table-cell whitespace-nowrap w-[140px]",
            tdClassName: "hidden md:table-cell whitespace-nowrap w-[140px]",
            cell: (test) => (
                <div className="text-xs text-slate-500">
                    {formatTimeAgo(test.updatedAt)}
                </div>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            thClassName: "text-right whitespace-nowrap w-[160px]",
            tdClassName: "text-right whitespace-nowrap w-[160px]",
            cell: (test) => (
                <div className="flex items-center justify-end gap-2">
                    <ActionIconButton
                        variant="view"
                        label="View"
                        onClick={() => onView(test)}
                        icon={<Eye className="size-4" />}
                    />
                    <ActionIconButton
                        variant="edit"
                        label="Edit"
                        onClick={() => onEdit(test)}
                        icon={<Pencil className="size-4" />}
                    />
                    <ActionIconButton
                        variant="delete"
                        label="Delete"
                        onClick={() => onDelete(test)}
                        icon={<Trash2 className="size-4" />}
                    />
                </div>
            ),
        },
    ];

    return (
        <AppTable
            data={tests}
            columns={columns}
            getRowKey={(test) => test.id}
            emptyState="No tests found. Create your first test to get started."
        />
    );
}
