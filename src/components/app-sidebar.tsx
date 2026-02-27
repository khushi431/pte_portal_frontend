"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

export interface NavChild {
    label: string;
    href: string;
}

export interface NavItem {
    label: string;
    href?: string;
    icon: LucideIcon;
    children?: NavChild[];
}

export interface NavGroup {
    groupLabel: string;
    items: NavItem[];
}

interface AppSidebarContentProps {
    brandName: string;
    brandIcon: string; // emoji or text
    navGroups: NavGroup[];
    onLinkClick?: () => void;
}

function NavItemRow({
    item,
    onLinkClick,
}: {
    item: NavItem;
    onLinkClick?: () => void;
}) {
    const pathname = usePathname();
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;

    const isActive = item.href
        ? pathname === item.href || pathname.startsWith(item.href + "/")
        : item.children?.some((c) => pathname.startsWith(c.href));

    const [open, setOpen] = useState(isActive ?? false);

    if (hasChildren) {
        return (
            <Collapsible open={open} onOpenChange={setOpen}>
                <CollapsibleTrigger asChild>
                    <button
                        className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors group",
                            isActive
                                ? "bg-primary/8 text-primary"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        )}
                    >
                        <Icon className={cn("size-4 shrink-0", isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600")} />
                        <span className="flex-1 text-left">{item.label}</span>
                        <ChevronDown
                            className={cn(
                                "size-3.5 text-slate-400 transition-transform duration-200",
                                open && "rotate-180"
                            )}
                        />
                    </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-[2.35rem] mt-0.5 flex flex-col gap-0.5 border-l border-slate-200 pl-3">
                    {item.children!.map((child) => {
                        const childActive = pathname === child.href || pathname.startsWith(child.href + "/");
                        return (
                            <Link
                                key={child.href}
                                href={child.href}
                                onClick={onLinkClick}
                                className={cn(
                                    "rounded-md px-2 py-1.5 text-sm transition-colors",
                                    childActive
                                        ? "font-semibold text-primary"
                                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                                )}
                            >
                                {child.label}
                            </Link>
                        );
                    })}
                </CollapsibleContent>
            </Collapsible>
        );
    }

    return (
        <Link
            href={item.href!}
            onClick={onLinkClick}
            className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors group",
                isActive
                    ? "bg-primary/10 text-primary"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
        >
            <Icon className={cn("size-4 shrink-0", isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600")} />
            <span>{item.label}</span>
        </Link>
    );
}

export function AppSidebarContent({
    brandName,
    brandIcon,
    navGroups,
    onLinkClick,
}: AppSidebarContentProps) {
    return (
        <div className="flex h-full flex-col bg-white">
            {/* Brand */}
            <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold shadow-sm">
                    {brandIcon}
                </div>
                <span className="text-base font-bold text-slate-800">{brandName}</span>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
                {navGroups.map((group) => (
                    <div key={group.groupLabel}>
                        <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                            {group.groupLabel}
                        </p>
                        <div className="space-y-0.5">
                            {group.items.map((item) => (
                                <NavItemRow key={item.label} item={item} onLinkClick={onLinkClick} />
                            ))}
                        </div>
                    </div>
                ))}
            </nav>
        </div>
    );
}
