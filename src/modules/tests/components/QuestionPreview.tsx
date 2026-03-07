"use client";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { GripVertical } from "lucide-react";
import { PTE_MODULES } from "@/modules/questionBank/constants/modules";

interface SelectedQuestion {
    questionId: string;
    question: {
        title: string;
        module: string;
        difficulty: string;
        questionTypeLabel: string;
    };
    points: number;
    order: number;
}

interface QuestionPreviewProps {
    selectedQuestions: SelectedQuestion[];
}

export function QuestionPreview({ selectedQuestions }: QuestionPreviewProps) {
    if (selectedQuestions.length === 0) {
        return (
            <div className="h-full flex items-center justify-center text-center p-6">
                <div>
                    <p className="text-sm text-slate-500 mb-1">No questions added yet</p>
                    <p className="text-xs text-slate-400">
                        Click &quot;Add&quot; on questions from the list to add them to your test
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col max-h-[60vh]">
            <div className="pb-4 border-b border-slate-200 mb-4">
                <h3 className="text-sm font-semibold text-slate-900">
                    Added Questions ({selectedQuestions.length})
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                    Preview of all questions added to your test
                </p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {selectedQuestions
                    .sort((a, b) => a.order - b.order)
                    .map((sq) => {
                        const moduleInfo = PTE_MODULES.find((m) => m.id === sq.question.module);
                        return (
                            <div
                                key={sq.questionId}
                                className="flex items-start gap-4 p-4 rounded-lg border border-slate-200 bg-slate-50/50"
                            >
                                <div className="mt-1 text-slate-400 shrink-0">
                                    <GripVertical className="size-4" />
                                </div>
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0">
                                    {sq.order}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-slate-900 text-sm mb-1">
                                                {sq.question.title}
                                            </h4>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {moduleInfo && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {moduleInfo.label}
                                                    </Badge>
                                                )}
                                                <Badge variant="secondary" className="text-xs capitalize">
                                                    {sq.question.difficulty}
                                                </Badge>
                                                <span className="text-xs text-slate-500">
                                                    {sq.question.questionTypeLabel}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Label className="text-xs text-slate-600">Points:</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={sq.points}
                                            readOnly
                                            className="h-7 w-20 text-sm bg-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
