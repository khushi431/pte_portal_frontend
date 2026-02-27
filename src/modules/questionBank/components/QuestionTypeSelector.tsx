"use client";

import { cn } from "@/lib/utils";
import {
    Volume2, RotateCcw, Image, GraduationCap, MessageCircle,
    FileText, Edit3,
    CircleDot, CheckSquare, ArrowUpDown, GripHorizontal, ChevronDown,
    FileAudio, TextCursorInput, Highlighter, HelpCircle, XCircle, Keyboard,
    LucideIcon,
} from "lucide-react";
import { PteModule, QuestionTypeSlug } from "../types";
import { getQuestionTypesByModule, QUESTION_TYPES } from "../constants/questionTypes";
import { MODULE_MAP } from "../constants/modules";

const ICON_MAP: Record<string, LucideIcon> = {
    Volume2, RotateCcw, Image, GraduationCap, MessageCircle,
    FileText, Edit3,
    CircleDot, CheckSquare, ArrowUpDown, GripHorizontal, ChevronDown,
    FileAudio, TextCursorInput, Highlighter, HelpCircle, XCircle, Keyboard,
};

interface QuestionTypeSelectorProps {
    selectedModule: PteModule | "all";
    selectedType: QuestionTypeSlug | null;
    onTypeChange: (type: QuestionTypeSlug | null) => void;
}

export function QuestionTypeSelector({
    selectedModule,
    selectedType,
    onTypeChange,
}: QuestionTypeSelectorProps) {
    const types =
        selectedModule === "all"
            ? QUESTION_TYPES
            : getQuestionTypesByModule(selectedModule);

    if (types.length === 0) return null;

    // Group by module when "all" is selected
    const grouped =
        selectedModule === "all"
            ? (["speaking", "writing", "reading", "listening"] as PteModule[]).map((mod) => ({
                module: mod,
                moduleInfo: MODULE_MAP[mod],
                types: getQuestionTypesByModule(mod),
            }))
            : [
                {
                    module: selectedModule as PteModule,
                    moduleInfo: MODULE_MAP[selectedModule as PteModule],
                    types,
                },
            ];

    return (
        <div className="space-y-6">
            {grouped.map((group) => (
                <div key={group.module}>
                    {selectedModule === "all" && (
                        <h3
                            className={cn(
                                "text-sm font-semibold mb-3 flex items-center gap-2",
                                group.moduleInfo.color
                            )}
                        >
                            <span
                                className={cn(
                                    "size-2 rounded-full",
                                    group.moduleInfo.color.replace("text-", "bg-")
                                )}
                            />
                            {group.moduleInfo.label}
                        </h3>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {group.types.map((qt) => {
                            const Icon = ICON_MAP[qt.icon];
                            const isSelected = selectedType === qt.slug;
                            const moduleInfo = MODULE_MAP[qt.module];
                            return (
                                <button
                                    key={qt.slug}
                                    onClick={() =>
                                        onTypeChange(isSelected ? null : qt.slug)
                                    }
                                    className={cn(
                                        "flex items-start gap-3 rounded-xl border p-4 text-left transition-all hover:shadow-sm",
                                        isSelected
                                            ? `${moduleInfo.bgColor} ${moduleInfo.borderColor} shadow-sm`
                                            : "bg-white border-slate-200 hover:border-slate-300"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "flex size-9 shrink-0 items-center justify-center rounded-lg",
                                            isSelected
                                                ? `${moduleInfo.color.replace("text-", "bg-")}/20`
                                                : "bg-slate-100"
                                        )}
                                    >
                                        {Icon && (
                                            <Icon
                                                className={cn(
                                                    "size-4",
                                                    isSelected
                                                        ? moduleInfo.color
                                                        : "text-slate-500"
                                                )}
                                            />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p
                                            className={cn(
                                                "text-sm font-medium truncate",
                                                isSelected
                                                    ? moduleInfo.color
                                                    : "text-slate-700"
                                            )}
                                        >
                                            {qt.label}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                                            {qt.description}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1 font-medium">
                                            {qt.totalQuestions} questions
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
