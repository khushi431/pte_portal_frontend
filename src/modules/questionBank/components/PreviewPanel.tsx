"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Volume2, Image as ImageIcon } from "lucide-react";
import { Question, PteModule } from "../types";
import { MODULE_MAP } from "../constants/modules";

interface PreviewPanelProps {
    question: Question;
    onClose: () => void;
}

export function PreviewPanel({ question, onClose }: PreviewPanelProps) {
    const moduleInfo = MODULE_MAP[question.module as PteModule];

    return (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white border-l border-slate-200 shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-slate-800">
                        Question Preview
                    </h3>
                    {moduleInfo && (
                        <span
                            className={cn(
                                "text-xs rounded-full px-2 py-0.5 font-medium border",
                                moduleInfo.bgColor,
                                moduleInfo.color,
                                moduleInfo.borderColor
                            )}
                        >
                            {moduleInfo.label}
                        </span>
                    )}
                </div>
                <Button variant="ghost" size="icon-xs" onClick={onClose}>
                    <X className="size-4" />
                </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                {/* Title */}
                <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold tracking-wide mb-1">
                        Title
                    </p>
                    <p className="text-sm font-medium text-slate-800">{question.title}</p>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="capitalize text-xs">
                        {question.questionTypeLabel}
                    </Badge>
                    <Badge variant="outline" className="capitalize text-xs">
                        {question.difficulty}
                    </Badge>
                    <Badge
                        variant="secondary"
                        className={cn(
                            "capitalize text-xs",
                            question.status === "active"
                                ? "bg-emerald-50 text-emerald-700"
                                : question.status === "draft"
                                    ? "bg-slate-100 text-slate-600"
                                    : "bg-red-50 text-red-600"
                        )}
                    >
                        {question.status}
                    </Badge>
                </div>

                {/* Passage / Content */}
                {question.passage && (
                    <div>
                        <p className="text-xs text-slate-400 uppercase font-semibold tracking-wide mb-1">
                            Passage
                        </p>
                        <div className="text-sm text-slate-600 bg-slate-50 rounded-lg p-4 border border-slate-100 leading-relaxed">
                            {question.passage}
                        </div>
                    </div>
                )}

                <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold tracking-wide mb-1">
                        Question
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed">{question.content}</p>
                </div>

                {/* Audio indicator */}
                {question.audioUrl && (
                    <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-4 py-3 border border-blue-100">
                        <Volume2 className="size-4 text-blue-500" />
                        <span className="text-sm text-blue-700">Audio attached</span>
                    </div>
                )}

                {/* Image indicator */}
                {question.imageUrl && (
                    <div className="flex items-center gap-2 bg-purple-50 rounded-lg px-4 py-3 border border-purple-100">
                        <ImageIcon className="size-4 text-purple-500" />
                        <span className="text-sm text-purple-700">Image attached</span>
                    </div>
                )}

                {/* Options */}
                {question.options && question.options.length > 0 && (
                    <div>
                        <p className="text-xs text-slate-400 uppercase font-semibold tracking-wide mb-2">
                            Options
                        </p>
                        <div className="space-y-2">
                            {question.options.map((opt) => (
                                <div
                                    key={opt.id}
                                    className={cn(
                                        "flex items-start gap-3 rounded-lg border px-4 py-3 text-sm",
                                        opt.isCorrect
                                            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                            : "bg-white border-slate-200 text-slate-700"
                                    )}
                                >
                                    <span className="shrink-0 font-semibold uppercase">
                                        {opt.id}.
                                    </span>
                                    <span>{opt.text}</span>
                                    {opt.isCorrect && (
                                        <Badge className="ml-auto text-[10px] bg-emerald-600">
                                            Correct
                                        </Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Correct Answer */}
                {question.correctAnswer && (
                    <div>
                        <p className="text-xs text-slate-400 uppercase font-semibold tracking-wide mb-1">
                            Correct Answer
                        </p>
                        <p className="text-sm font-medium text-emerald-700 bg-emerald-50 rounded-lg px-4 py-3 border border-emerald-100">
                            {question.correctAnswer}
                        </p>
                    </div>
                )}

                {/* Tags */}
                {question.tags.length > 0 && (
                    <div>
                        <p className="text-xs text-slate-400 uppercase font-semibold tracking-wide mb-2">
                            Tags
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {question.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="text-xs bg-slate-100 text-slate-600 rounded-md px-2 py-0.5"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
