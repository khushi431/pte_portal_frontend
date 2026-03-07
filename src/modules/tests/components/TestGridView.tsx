"use client";

import { Test } from "../types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, FileQuestion, Users, Award, Calendar, Eye, Pencil, Trash2, Globe, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ActionIconButton } from "@/components/ui/action-icon-button";
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

interface TestGridViewProps {
    tests: Test[];
    basePath: string;
    onView: (test: Test) => void;
    onEdit: (test: Test) => void;
    onDelete: (test: Test) => void;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
    draft: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" },
    published: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
    scheduled: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    archived: { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" },
};

export function TestGridView({ tests, basePath, onView, onEdit, onDelete }: TestGridViewProps) {
    const getModuleLabels = (modules: string[]) => {
        return modules.map((mod) => {
            const moduleInfo = PTE_MODULES.find((m) => m.id === mod);
            return moduleInfo?.label || mod;
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tests.map((test) => {
                const statusStyle = STATUS_STYLES[test.status] || STATUS_STYLES.draft;
                const moduleLabels = getModuleLabels(test.modules);

                return (
                    <Card
                        key={test.id}
                        className={cn(
                            "p-5 hover:shadow-md transition-all border-2",
                            statusStyle.border
                        )}
                    >
                        <div className="space-y-4">
                            {/* Header */}
                            <div className="space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="font-semibold text-slate-900 line-clamp-2 flex-1">
                                        {test.title}
                                    </h3>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        {test.isPublic ? (
                                            <Globe className="size-4 text-slate-400" title="Public" />
                                        ) : (
                                            <Lock className="size-4 text-slate-400" title="Private" />
                                        )}
                                    </div>
                                </div>
                                {test.description && (
                                    <p className="text-sm text-slate-600 line-clamp-2">
                                        {test.description}
                                    </p>
                                )}
                            </div>

                            {/* Badges */}
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge
                                    variant="secondary"
                                    className={cn("text-xs capitalize", statusStyle.text, statusStyle.bg)}
                                >
                                    {test.status}
                                </Badge>
                                {moduleLabels.slice(0, 2).map((label, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                        {label}
                                    </Badge>
                                ))}
                                {moduleLabels.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                        +{moduleLabels.length - 2} more
                                    </Badge>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Clock className="size-4 text-slate-400" />
                                    <span>{test.duration} min</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <FileQuestion className="size-4 text-slate-400" />
                                    <span>{test.totalQuestions} questions</span>
                                </div>
                                {test.completedCount !== undefined && (
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Users className="size-4 text-slate-400" />
                                        <span>{test.completedCount} completed</span>
                                    </div>
                                )}
                                {test.averageScore !== undefined && (
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Award className="size-4 text-slate-400" />
                                        <span>{test.averageScore.toFixed(1)}% avg</span>
                                    </div>
                                )}
                            </div>

                            {/* Scheduled info */}
                            {test.scheduledStart && (
                                <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
                                    <Calendar className="size-3.5" />
                                    <span>
                                        Starts {formatTimeAgo(test.scheduledStart)}
                                    </span>
                                </div>
                            )}

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                <div className="text-xs text-slate-500">
                                    {formatTimeAgo(test.updatedAt)}
                                </div>
                                <div className="flex items-center gap-1.5">
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
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
