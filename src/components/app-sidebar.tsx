"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ChevronUp, ChevronRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    collapsed?: boolean;
}

function NavItemRow({
    item,
    onLinkClick,
    collapsed,
}: {
    item: NavItem;
    onLinkClick?: () => void;
    collapsed?: boolean;
}) {
    const pathname = usePathname();
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;

    // Check if any child is active (exact match for submenu highlight)
    const hasActiveChild =
        item.children?.some((c) => pathname === c.href) ?? false;

    // Check if parent item itself is active
    const isParentActive = item.href
        ? pathname === item.href || pathname.startsWith(item.href + "/")
        : false;

    // Item is active if it's the parent active OR has an active child
    const isActive = isParentActive || hasActiveChild;

    // Auto-open if has active child, allow manual toggle otherwise
    const [open, setOpen] = useState(hasActiveChild);

    // Compact icon-only mode for collapsed sidebar (desktop)
    if (collapsed) {
        // Items WITH children → show a flyout submenu to the right
        if (hasChildren) {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            title={item.label}
                            aria-label={item.label}
                            className={cn(
                                "flex items-center justify-center rounded-2xl p-3 my-1 w-full transition-colors duration-200",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-1",
                                isActive
                                    ? "bg-purple-600 text-white shadow-sm"
                                    : "text-slate-600 hover:bg-purple-50 hover:text-purple-700"
                            )}
                        >
                            <Icon className="size-5" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        side="right"
                        align="start"
                        sideOffset={12}
                        className="min-w-[180px] p-1.5"
                    >
                        <DropdownMenuLabel className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            {item.label}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="my-1" />
                        {item.children!.map((child) => {
                            const childActive = pathname === child.href;
                            return (
                                <DropdownMenuItem key={child.href} asChild>
                                    <Link
                                        href={child.href}
                                        onClick={onLinkClick}
                                        className={cn(
                                            "flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium cursor-pointer transition-colors",
                                            childActive
                                                ? "bg-purple-600 text-white focus:bg-purple-700"
                                                : "text-slate-700 hover:bg-purple-50 hover:text-purple-700 focus:bg-purple-50"
                                        )}
                                    >
                                        <ChevronRight className="size-3.5 shrink-0 opacity-60" />
                                        {child.label}
                                    </Link>
                                </DropdownMenuItem>
                            );
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }

        // Items WITHOUT children → simple icon link with tooltip
        const targetHref = item.href ?? "#";
        const isCollapsedActive =
            !!targetHref &&
            (pathname === targetHref ||
                pathname.startsWith(targetHref + "/"));

        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        href={targetHref}
                        onClick={onLinkClick}
                        className={cn(
                            "flex items-center justify-center rounded-2xl p-3 my-1 transition-colors duration-200",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-1",
                            isCollapsedActive
                                ? "bg-purple-600 text-white shadow-sm"
                                : "text-slate-600 hover:bg-purple-50 hover:text-purple-700"
                        )}
                    >
                        <Icon className="size-5" />
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs font-medium px-2.5 py-1.5">
                    {item.label}
                </TooltipContent>
            </Tooltip>
        );
    }

    if (hasChildren) {
        return (
            <Collapsible open={open} onOpenChange={setOpen}>
                <CollapsibleTrigger asChild>
                    <button
                        type="button"
                        className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-1",
                            isActive
                                ? "text-purple-600 hover:bg-purple-50"
                                : "text-slate-700 hover:bg-purple-50 hover:text-purple-600"
                        )}
                    >
                        <Icon
                            className={cn(
                                "size-5 shrink-0 transition-colors duration-200",
                                isActive ? "text-purple-600" : "text-slate-600 group-hover:text-purple-600"
                            )}
                        />
                        <span className="flex-1 text-left">{item.label}</span>
                        {open ? (
                            <ChevronUp
                                className={cn(
                                    "size-4 shrink-0 transition-colors duration-200",
                                    isActive
                                        ? "text-purple-600"
                                        : "text-slate-400 group-hover:text-purple-500",
                                )}
                            />
                        ) : (
                            <ChevronDown
                                className={cn(
                                    "size-4 shrink-0 transition-colors duration-200",
                                    isActive
                                        ? "text-purple-600"
                                        : "text-slate-400 group-hover:text-purple-500",
                                )}
                            />
                        )}
                    </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-1.5">
                    <div className="relative ml-7 pl-4">
                        {/* Vertical connector line for submenu */}
                        <div className="absolute left-0 top-2 bottom-2 w-px bg-slate-200" />
                        <div className="space-y-1">
                            {item.children!.map((child) => {
                                // Only highlight the exact active submenu item
                                const childActive = pathname === child.href;
                                return (
                                    <div key={child.href} className="relative pl-4">
                                        {/* Dot indicator sitting on the connector line (outside the pill) */}
                                        <span
                                            className={cn(
                                                "absolute left-0 top-1/2 -translate-y-1/2 size-2 rounded-full border-2 transition-colors duration-200 bg-white",
                                                childActive
                                                    ? "border-purple-600"
                                                    : "border-slate-300 group-hover:border-purple-400"
                                            )}
                                        />
                                        <Link
                                            href={child.href}
                                            onClick={onLinkClick}
                                            className={cn(
                                                "group flex items-center rounded-xl pl-3 pr-4 py-2 text-sm transition-all duration-200",
                                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-1",
                                                childActive
                                                    ? "bg-purple-600 text-white shadow-sm hover:bg-purple-700"
                                                    : "bg-white text-slate-600 hover:bg-purple-50 hover:text-purple-600"
                                            )}
                                        >
                                            <span>{child.label}</span>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        );
    }

    return (
        <Link
            href={item.href!}
            onClick={onLinkClick}
            className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-1",
                isActive
                    ? "bg-purple-600 text-white shadow-sm hover:bg-purple-700"
                    : "text-slate-700 hover:bg-purple-50 hover:text-purple-600"
            )}
        >
            <Icon
                className={cn(
                    "size-5 shrink-0 transition-colors duration-200",
                    isActive ? "text-white" : "text-slate-600 group-hover:text-purple-600"
                )}
            />
            <span>{item.label}</span>
        </Link>
    );
}

export function AppSidebarContent({
    brandName,
    brandIcon,
    navGroups,
    onLinkClick,
    collapsed = false,
}: AppSidebarContentProps) {
    return (
        <TooltipProvider delayDuration={200}>
            <div className="flex min-h-screen flex-col bg-white">
                {/* Brand Logo */}
                <div
                    className={cn(
                        "flex items-center gap-3 border-b border-slate-200 px-6 py-5",
                        collapsed && "justify-center px-0"
                    )}
                >
                    <div className="relative flex size-10 items-center justify-center">
                        {/* Purple graphic background */}
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 shadow-sm" />
                        {/* Icon overlay */}
                        <div className="relative z-10 flex items-center justify-center text-white text-lg font-bold">
                            {brandIcon}
                        </div>
                    </div>
                    {!collapsed && (
                        <div className="flex flex-col">
                            <span className="text-base font-bold text-slate-900 leading-tight">
                                {brandName.split(" ")[0]}
                            </span>
                            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                {brandName.split(" ").slice(1).join(" ") || "Portal"}
                            </span>
                        </div>
                    )}
                </div>

                {/* Nav */}
                <nav
                    className={cn(
                        "flex-1 overflow-y-auto py-5 px-4 space-y-6",
                        collapsed && "px-2 space-y-4"
                    )}
                >
                    {navGroups.map((group) => (
                        <div key={group.groupLabel}>
                            {!collapsed && (
                                <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                    {group.groupLabel}
                                </p>
                            )}
                            <div className={cn("space-y-1", collapsed && "space-y-2")}>
                                {group.items.map((item) => (
                                    <NavItemRow
                                        key={item.label}
                                        item={item}
                                        onLinkClick={onLinkClick}
                                        collapsed={collapsed}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>
        </TooltipProvider>
    );
}
