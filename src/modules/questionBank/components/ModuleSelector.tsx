"use client";

import { cn } from "@/lib/utils";
import { Mic, PenLine, BookOpen, Headphones, LucideIcon } from "lucide-react";
import { PteModule, PteModuleInfo } from "../types";
import { PTE_MODULES } from "../constants/modules";

const ICON_MAP: Record<string, LucideIcon> = {
    Mic,
    PenLine,
    BookOpen,
    Headphones,
};

interface ModuleSelectorProps {
    selectedModule: PteModule | "all";
    onModuleChange: (module: PteModule | "all") => void;
    questionCounts?: Record<string, number>;
}

export function ModuleSelector({
    selectedModule,
    onModuleChange,
    questionCounts,
}: ModuleSelectorProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {/* All tab */}
            <button
                onClick={() => onModuleChange("all")}
                className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all border",
                    selectedModule === "all"
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                )}
            >
                <span>All Modules</span>
                {questionCounts && (
                    <span
                        className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-semibold",
                            selectedModule === "all"
                                ? "bg-white/20 text-white"
                                : "bg-slate-100 text-slate-500"
                        )}
                    >
                        {Object.values(questionCounts).reduce((a, b) => a + b, 0)}
                    </span>
                )}
            </button>

            {/* Module tabs */}
            {PTE_MODULES.map((mod: PteModuleInfo) => {
                const Icon = ICON_MAP[mod.icon];
                const isSelected = selectedModule === mod.id;
                return (
                    <button
                        key={mod.id}
                        onClick={() => onModuleChange(mod.id)}
                        className={cn(
                            "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all border",
                            isSelected
                                ? `${mod.bgColor} ${mod.color} ${mod.borderColor} shadow-sm`
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                        )}
                    >
                        {Icon && <Icon className="size-4" />}
                        <span>{mod.label}</span>
                        {questionCounts && (
                            <span
                                className={cn(
                                    "rounded-full px-2 py-0.5 text-xs font-semibold",
                                    isSelected
                                        ? "bg-white/60 text-current"
                                        : "bg-slate-100 text-slate-500"
                                )}
                            >
                                {questionCounts[mod.id] ?? 0}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
