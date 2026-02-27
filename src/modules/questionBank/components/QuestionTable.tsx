"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, MoreHorizontal } from "lucide-react";
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
    if (questions.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-12 text-center">
                <p className="text-sm text-slate-500">No questions found matching your filters.</p>
                <p className="text-xs text-slate-400 mt-1">
                    Try adjusting your search or filter criteria.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80">
                        <th className="px-4 py-3 text-left font-semibold text-slate-600">
                            Question
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-600 hidden md:table-cell">
                            Module
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-600 hidden lg:table-cell">
                            Type
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-600 hidden sm:table-cell">
                            Difficulty
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-600 hidden sm:table-cell">
                            Status
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-600 hidden xl:table-cell">
                            Updated
                        </th>
                        <th className="px-4 py-3 text-right font-semibold text-slate-600">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {questions.map((question) => {
                        const moduleInfo = MODULE_MAP[question.module as PteModule];
                        return (
                            <tr
                                key={question.id}
                                className="hover:bg-slate-50/50 transition-colors"
                            >
                                {/* Title */}
                                <td className="px-4 py-3">
                                    <div className="max-w-xs">
                                        <p className="font-medium text-slate-800 truncate">
                                            {question.title}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-0.5 truncate">
                                            {question.content.substring(0, 80)}...
                                        </p>
                                    </div>
                                </td>

                                {/* Module */}
                                <td className="px-4 py-3 hidden md:table-cell">
                                    {moduleInfo && (
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
                                    )}
                                </td>

                                {/* Type */}
                                <td className="px-4 py-3 hidden lg:table-cell">
                                    <span className="text-xs text-slate-600 bg-slate-100 rounded-md px-2 py-1">
                                        {question.questionTypeLabel}
                                    </span>
                                </td>

                                {/* Difficulty */}
                                <td className="px-4 py-3 hidden sm:table-cell">
                                    <span
                                        className={cn(
                                            "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium border",
                                            DIFFICULTY_STYLES[question.difficulty]
                                        )}
                                    >
                                        {question.difficulty.charAt(0).toUpperCase() +
                                            question.difficulty.slice(1)}
                                    </span>
                                </td>

                                {/* Status */}
                                <td className="px-4 py-3 hidden sm:table-cell">
                                    <Badge
                                        variant="secondary"
                                        className={cn(
                                            "text-xs capitalize",
                                            STATUS_STYLES[question.status]
                                        )}
                                    >
                                        {question.status}
                                    </Badge>
                                </td>

                                {/* Updated */}
                                <td className="px-4 py-3 hidden xl:table-cell">
                                    <span className="text-xs text-slate-500">
                                        {new Date(question.updatedAt).toLocaleDateString(
                                            "en-US",
                                            {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            }
                                        )}
                                    </span>
                                </td>

                                {/* Actions */}
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon-xs"
                                            onClick={() => onView?.(question)}
                                            title="View"
                                        >
                                            <Eye className="size-3.5 text-slate-500" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon-xs"
                                            onClick={() => onEdit?.(question)}
                                            title="Edit"
                                        >
                                            <Pencil className="size-3.5 text-slate-500" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon-xs"
                                            onClick={() => onDelete?.(question)}
                                            title="Delete"
                                        >
                                            <Trash2 className="size-3.5 text-red-400" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
