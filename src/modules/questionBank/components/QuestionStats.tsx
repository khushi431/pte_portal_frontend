"use client";

import { Mic, PenLine, BookOpen, Headphones, LucideIcon, FileQuestion } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { PteModule } from "../types";
import { DUMMY_QUESTIONS, getQuestionsByModule } from "../data/dummyQuestions";

const MODULE_ICONS: Record<PteModule, { icon: LucideIcon; bg: string; color: string }> = {
    speaking: { icon: Mic, bg: "bg-blue-50", color: "text-blue-600" },
    writing: { icon: PenLine, bg: "bg-emerald-50", color: "text-emerald-600" },
    reading: { icon: BookOpen, bg: "bg-purple-50", color: "text-purple-600" },
    listening: { icon: Headphones, bg: "bg-amber-50", color: "text-amber-600" },
};

export function QuestionStats() {
    const totalQuestions = DUMMY_QUESTIONS.length;
    const moduleCounts: Record<PteModule, number> = {
        speaking: getQuestionsByModule("speaking").length,
        writing: getQuestionsByModule("writing").length,
        reading: getQuestionsByModule("reading").length,
        listening: getQuestionsByModule("listening").length,
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
                label="Total Questions"
                value={totalQuestions.toString()}
                icon={FileQuestion}
                iconBg="bg-slate-100"
                iconColor="text-slate-600"
            />
            {(["speaking", "writing", "reading", "listening"] as PteModule[]).map((mod) => {
                const { icon, bg, color } = MODULE_ICONS[mod];
                return (
                    <StatCard
                        key={mod}
                        label={mod.charAt(0).toUpperCase() + mod.slice(1)}
                        value={moduleCounts[mod].toString()}
                        icon={icon}
                        iconBg={bg}
                        iconColor={color}
                    />
                );
            })}
        </div>
    );
}
