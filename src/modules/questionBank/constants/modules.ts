import { PteModule, PteModuleInfo } from "../types";

export const PTE_MODULES: PteModuleInfo[] = [
    {
        id: "speaking",
        label: "Speaking",
        description: "Test oral fluency, pronunciation, and spoken discourse skills",
        icon: "Mic",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
    },
    {
        id: "writing",
        label: "Writing",
        description: "Evaluate written expression, grammar, and vocabulary usage",
        icon: "PenLine",
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
    },
    {
        id: "reading",
        label: "Reading",
        description: "Assess reading comprehension and analytical abilities",
        icon: "BookOpen",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
    },
    {
        id: "listening",
        label: "Listening",
        description: "Measure listening comprehension and note-taking skills",
        icon: "Headphones",
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
    },
];

export const MODULE_MAP: Record<PteModule, PteModuleInfo> = Object.fromEntries(
    PTE_MODULES.map((m) => [m.id, m])
) as Record<PteModule, PteModuleInfo>;
