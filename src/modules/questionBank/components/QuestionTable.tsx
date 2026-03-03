"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AppTable, AppTableColumn } from "@/components/ui/app-table";
import { ActionIconButton } from "@/components/ui/action-icon-button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Question, Difficulty, PteModule } from "../types";
import { MODULE_MAP } from "../constants/modules";

interface QuestionTableProps {
    questions: Question[];
    basePath: string; // e.g. "/admin/questionBank" or "/superAdmin/questionBank"
    onView?: (question: Question) => void;
    onEdit?: (question: Question) => void;
    onDelete?: (question: Question) => void;
}

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
    easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    hard: "bg-red-50 text-red-700 border-red-200",
};

const STATUS_STYLES: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-700",
    draft: "bg-slate-100 text-slate-600",
    archived: "bg-red-50 text-red-600",
};

export function QuestionTable({
    questions,
    onView,
    onEdit,
    onDelete,
}: QuestionTableProps) {
    const columns: AppTableColumn<Question>[] = [
        {
            id: "question",
            header: "Course",
            thClassName: "w-[260px] sm:w-[320px] lg:w-[380px]",
            tdClassName: "w-[260px] sm:w-[320px] lg:w-[380px]",
            cell: (question) => (
                <div className="min-w-0">
                    <p className="font-semibold text-slate-900 whitespace-normal break-words leading-snug">
                        {question.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 whitespace-normal break-words">
                        {question.content.substring(0, 160)}
                    </p>
                </div>
            ),
        },
        {
            id: "module",
            header: "Category",
            thClassName: "hidden md:table-cell whitespace-nowrap w-[170px]",
            tdClassName: "hidden md:table-cell whitespace-nowrap w-[170px]",
            cell: (question) => {
                const moduleInfo = MODULE_MAP[question.module as PteModule];
                if (!moduleInfo) return null;
                return (
                    <span
                        className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border",
                            moduleInfo.bgColor,
                            moduleInfo.color,
                            moduleInfo.borderColor
                        )}
                    >
                        <span
                            className={cn(
                                "size-1.5 rounded-full",
                                moduleInfo.color.replace("text-", "bg-")
                            )}
                        />
                        {moduleInfo.label}
                    </span>
                );
            },
        },
        {
            id: "difficulty",
            header: "Difficulty",
            thClassName: "hidden sm:table-cell whitespace-nowrap w-[110px]",
            tdClassName: "hidden sm:table-cell whitespace-nowrap w-[110px]",
            cell: (question) => (
                <span
                    className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium border",
                        DIFFICULTY_STYLES[question.difficulty]
                    )}
                >
                    {question.difficulty.charAt(0).toUpperCase() +
                        question.difficulty.slice(1)}
                </span>
            ),
        },
        {
            id: "status",
            header: "Status",
            thClassName: "hidden sm:table-cell whitespace-nowrap w-[110px]",
            tdClassName: "hidden sm:table-cell whitespace-nowrap w-[110px]",
            cell: (question) => (
                <Badge
                    variant="secondary"
                    className={cn("text-xs capitalize", STATUS_STYLES[question.status])}
                >
                    {question.status}
                </Badge>
            ),
        },
        {
            id: "actions",
            header: "Action",
            thClassName: "text-right whitespace-nowrap w-[160px]",
            tdClassName: "text-right whitespace-nowrap w-[160px]",
            cell: (question) => (
                <div className="flex items-center justify-end gap-2">
                    <ActionIconButton
                        variant="view"
                        label="View"
                        onClick={() => onView?.(question)}
                        icon={<Eye className="size-4" />}
                    />
                    <ActionIconButton
                        variant="edit"
                        label="Edit"
                        onClick={() => onEdit?.(question)}
                        icon={<Pencil className="size-4" />}
                    />
                    <ActionIconButton
                        variant="delete"
                        label="Delete"
                        onClick={() => onDelete?.(question)}
                        icon={<Trash2 className="size-4" />}
                    />
                </div>
            ),
        },
    ];

    return (
        <AppTable
            data={questions}
            columns={columns}
            getRowKey={(q) => q.id}
            tableClassName="table-fixed"
            emptyState={
                <div className="space-y-1">
                    <p className="text-sm text-slate-600">
                        No questions found matching your filters.
                    </p>
                    <p className="text-xs text-slate-400">
                        Try adjusting your search or filter criteria.
                    </p>
                </div>
            }
        />
    );
}
