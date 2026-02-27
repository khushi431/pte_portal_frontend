"use client";

import { useRouter } from "next/navigation";
import { Bell, Globe, Menu, LogOut, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface AppHeaderProps {
    pageTitle: string;
    userName?: string;
    userRole?: string;
    userInitials?: string;
    notificationCount?: number;
    onMenuClick: () => void;
}

export function AppHeader({
    pageTitle,
    userName = "Administrator",
    userRole = "Admin",
    userInitials = "A",
    notificationCount = 0,
    onMenuClick,
}: AppHeaderProps) {
    const router = useRouter();

    function logout() {
        document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        router.push("/login");
    }

    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4 shadow-sm">
            {/* Hamburger */}
            <Button
                variant="ghost"
                size="icon"
                onClick={onMenuClick}
                className="size-8 shrink-0 text-slate-500 hover:bg-slate-100"
            >
                <Menu className="size-5" />
                <span className="sr-only">Toggle sidebar</span>
            </Button>

            {/* Page title */}
            <h1 className="text-base font-semibold text-slate-700 flex-1 truncate">
                {pageTitle}
            </h1>

            {/* Right actions */}
            <div className="flex items-center gap-1">
                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative size-8 text-slate-500 hover:bg-slate-100">
                    <Bell className="size-4" />
                    {notificationCount > 0 && (
                        <Badge className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full p-0 text-[9px] bg-red-500 text-white border-0">
                            {notificationCount > 99 ? "99+" : notificationCount}
                        </Badge>
                    )}
                </Button>

                {/* Language */}
                <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-1 text-slate-500 hover:bg-slate-100 px-2 h-8 text-xs font-medium">
                    <Globe className="size-3.5" />
                    en
                </Button>

                {/* User dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="flex items-center gap-2 px-2 h-8 hover:bg-slate-100 text-slate-700"
                        >
                            <Avatar className="size-7 border border-slate-200">
                                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                                    {userInitials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden sm:flex flex-col items-start leading-none">
                                <span className="text-xs font-semibold text-slate-700">{userName}</span>
                                <span className="text-[10px] text-slate-400">{userRole}</span>
                            </div>
                            <ChevronDown className="hidden sm:block size-3 text-slate-400" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel className="text-xs text-slate-500">
                            Signed in as <span className="font-semibold text-slate-700">{userRole}</span>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
                            <User className="size-3.5" /> Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={logout}
                            className="gap-2 text-sm text-red-500 focus:text-red-500 focus:bg-red-50 cursor-pointer"
                        >
                            <LogOut className="size-3.5" /> Sign Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
