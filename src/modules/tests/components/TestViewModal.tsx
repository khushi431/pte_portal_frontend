"use client";

import { Test } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, FileQuestion, Award, Users, Globe, Lock, Calendar, Tag, X } from "lucide-react";
import { PTE_MODULES } from "@/modules/questionBank/constants/modules";
import { cn } from "@/lib/utils";

interface TestViewModalProps {
    test: Test | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
    draft: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" },
    published: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
    scheduled: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    archived: { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" },
};

export function TestViewModal({ test, open, onOpenChange }: TestViewModalProps) {
    if (!test || !open) return null;

    const statusStyle = STATUS_STYLES[test.status] || STATUS_STYLES.draft;
    const moduleLabels = test.modules.map((mod) => {
        const moduleInfo = PTE_MODULES.find((m) => m.id === mod);
        return moduleInfo?.label || mod;
    });

    const handleClose = () => {
        onOpenChange(false);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 z-50 w-full max-w-3xl bg-white border-l border-slate-200 shadow-2xl flex flex-col">
                {/* Header */}
                <div className="relative flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
                    <div className="flex-1 min-w-0 pr-4">
                        <h2 className="text-base sm:text-lg font-semibold truncate">{test.title}</h2>
                        {test.description && (
                            <p className="mt-1 text-xs sm:text-sm text-primary-foreground/90 line-clamp-2">
                                {test.description}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge
                            variant="secondary"
                            className="text-[11px] capitalize bg-white/20 text-primary-foreground border border-white/30 px-2 py-0.5"
                        >
                            {test.status}
                        </Badge>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={handleClose}
                            className="text-primary-foreground hover:bg-white/10"
                            aria-label="Close test view"
                        >
                            <X className="size-4" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                    {/* Test Info + Modules / Tags */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                        {/* Status / visibility / schedule */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-slate-600">Status:</span>
                                <Badge
                                    variant="secondary"
                                    className={cn("text-xs capitalize", statusStyle.text, statusStyle.bg)}
                                >
                                    {test.status}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-slate-600">Visibility:</span>
                                {test.isPublic ? (
                                    <div className="flex items-center gap-1 text-sm text-slate-600">
                                        <Globe className="size-4" />
                                        <span>Public</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 text-sm text-slate-600">
                                        <Lock className="size-4" />
                                        <span>Private</span>
                                    </div>
                                )}
                            </div>
                            {test.scheduledStart && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="size-4 text-slate-400" />
                                    <span className="text-sm text-slate-600">
                                        Scheduled: {new Date(test.scheduledStart).toLocaleString()}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Duration / questions / points */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Clock className="size-4 text-slate-400" />
                                <span className="text-sm text-slate-600">
                                    Duration: <strong>{test.duration} minutes</strong>
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FileQuestion className="size-4 text-slate-400" />
                                <span className="text-sm text-slate-600">
                                    Questions: <strong>{test.totalQuestions}</strong>
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Award className="size-4 text-slate-400" />
                                <span className="text-sm text-slate-600">
                                    Total Points: <strong>{test.totalPoints}</strong>
                                </span>
                                {test.passingScore && (
                                    <span className="text-sm text-slate-500">
                                        (Passing: {test.passingScore}%)
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Modules and Tags row spanning full width */}
                        <div className="md:col-span-2 mt-2 flex flex-wrap items-start gap-x-6 gap-y-2 pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                    Modules
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                    {moduleLabels.map((label, idx) => (
                                        <Badge key={idx} variant="outline" className="text-xs">
                                            {label}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {test.tags.length > 0 && (
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1">
                                        <Tag className="size-3.5" />
                                        Tags
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {test.tags.map((tag, idx) => (
                                            <Badge key={idx} variant="secondary" className="text-[11px]">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Instructions */}
                    {test.instructions && (
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900 mb-2">Instructions</h3>
                            <p className="text-sm text-slate-600 whitespace-pre-wrap bg-slate-50 rounded-lg p-3">
                                {test.instructions}
                            </p>
                        </div>
                    )}

                    {/* Questions List */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 mb-3">
                            Questions ({test.questions.length})
                        </h3>
                        <div className="space-y-3">
                            {test.questions
                                .sort((a, b) => a.order - b.order)
                                .map((tq) => {
                                    const moduleInfo = PTE_MODULES.find((m) => m.id === tq.question.module);
                                    return (
                                        <div
                                            key={tq.questionId}
                                            className="flex items-start gap-4 p-4 rounded-lg border border-slate-200 bg-slate-50/50"
                                        >
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0">
                                                {tq.order}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <h4 className="font-medium text-slate-900 text-sm">
                                                        {tq.question.title}
                                                    </h4>
                                                    <Badge variant="outline" className="text-xs shrink-0">
                                                        {tq.points} pts
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-2 flex-wrap mb-2">
                                                    {moduleInfo && (
                                                        <Badge variant="outline" className="text-xs">
                                                            {moduleInfo.label}
                                                        </Badge>
                                                    )}
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs capitalize"
                                                    >
                                                        {tq.question.difficulty}
                                                    </Badge>
                                                    <span className="text-xs text-slate-500">
                                                        {tq.question.questionTypeLabel}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-600 line-clamp-2">
                                                    {tq.question.content}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>

                    {/* Statistics */}
                    {(test.completedCount !== undefined || test.averageScore !== undefined) && (
                        <div className="pt-4 border-t border-slate-200">
                            <h3 className="text-sm font-semibold text-slate-900 mb-3">Statistics</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {test.completedCount !== undefined && (
                                    <div className="flex items-center gap-2">
                                        <Users className="size-4 text-slate-400" />
                                        <span className="text-sm text-slate-600">
                                            <strong>{test.completedCount}</strong> students completed
                                        </span>
                                    </div>
                                )}
                                {test.averageScore !== undefined && (
                                    <div className="flex items-center gap-2">
                                        <Award className="size-4 text-slate-400" />
                                        <span className="text-sm text-slate-600">
                                            Average score: <strong>{test.averageScore.toFixed(1)}%</strong>
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Metadata */}
                    <div className="pt-4 border-t border-slate-200 text-xs text-slate-500">
                        <p>
                            Created by <strong>{test.createdByName}</strong> on{" "}
                            {new Date(test.createdAt).toLocaleDateString()}
                        </p>
                        <p className="mt-1">
                            Last updated: {new Date(test.updatedAt).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
