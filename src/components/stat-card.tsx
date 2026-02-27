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
}

export function StatCard({
    label,
    value,
    icon: Icon,
    change,
    changeType = "neutral",
    iconBg = "bg-primary/10",
    iconColor = "text-primary",
}: StatCardProps) {
    return (
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{label}</span>
                <div className={cn("size-9 rounded-lg flex items-center justify-center", iconBg)}>
                    <Icon className={cn("size-4", iconColor)} />
                </div>
            </div>
            <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-foreground tracking-tight">{value}</span>
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
