import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    label: string;
    value: string;
    icon: LucideIcon;
    change?: string;
    changeType?: "up" | "down" | "neutral";
    iconBg?: string;
    iconColor?: string;
    helperText?: string;
}

export function StatCard({
    label,
    value,
    icon: Icon,
    change,
    changeType = "neutral",
    iconBg = "bg-primary/10",
    iconColor = "text-primary",
    helperText,
}: StatCardProps) {
    return (
        <div className="group relative flex flex-col gap-3 rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/80 p-4 sm:p-5 shadow-sm transition-colors duration-150 hover:border-slate-300 hover:shadow-md">
            <div className="flex items-center justify-between gap-2.5">
                <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        {label}
                    </p>
                    {helperText && (
                        <p className="mt-0.5 text-[11px] text-slate-400 truncate">
                            {helperText}
                        </p>
                    )}
                </div>
                <div
                    className={cn(
                        "flex size-9 items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-700 shadow-[0_3px_10px_rgba(15,23,42,0.06)] transition-colors duration-150 group-hover:border-slate-200 group-hover:bg-slate-50",
                        iconBg
                    )}
                >
                    <Icon className={cn("size-4", iconColor)} />
                </div>
            </div>
            <div className="flex items-end gap-2">
                <span className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                    {value}
                </span>
                {change && (
                    <span
                        className={cn(
                            "text-xs font-medium pb-0.5",
                            changeType === "up" && "text-emerald-500",
                            changeType === "down" && "text-red-500",
                            changeType === "neutral" && "text-muted-foreground"
                        )}
                    >
                        {change}
                    </span>
                )}
            </div>
        </div>
    );
}
