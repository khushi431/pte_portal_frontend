"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, GraduationCap, Lock, Mail, Shield, BookOpen, Users, Building } from "lucide-react";
import { ROLE_DASHBOARD, UserRole, ROLE_COOKIE } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const ROLES: { value: UserRole; label: string; icon: React.ElementType; description: string }[] = [
    { value: "superAdmin", label: "Super Admin", icon: Shield, description: "Platform owner" },
    { value: "admin", label: "Admin", icon: Users, description: "Institute admin" },
    { value: "branchAdmin", label: "Branch Admin", icon: Building, description: "Branch manager" },
    { value: "teacher", label: "Teacher", icon: BookOpen, description: "Educator" },
    { value: "student", label: "Student", icon: GraduationCap, description: "Learner" },
];

export default function LoginPage() {
    const router = useRouter();
    const [role, setRole] = useState<UserRole>("student");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        if (!email.trim()) { setError("Please enter your email."); return; }
        if (!password.trim()) { setError("Please enter your password."); return; }
        setLoading(true);
        const expires = new Date(Date.now() + 86400_000).toUTCString();
        document.cookie = `${ROLE_COOKIE}=${role}; path=/; expires=${expires}`;
        router.push(ROLE_DASHBOARD[role]);
    }

    return (
        <div className="w-full max-w-md px-4">
            <Card className="shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl text-white">
                <CardHeader className="space-y-1 pb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
                            <span className="text-lg font-bold">P</span>
                        </div>
                        <div>
                            <CardTitle className="text-xl text-white">Welcome back</CardTitle>
                            <CardDescription className="text-white/50 text-xs">Sign in to your PTE Portal account</CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-5">
                    {/* Role Picker */}
                    <div className="space-y-2">
                        <Label className="text-xs font-medium text-white/60 uppercase tracking-wider">Sign in as</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {ROLES.map((r) => {
                                const Icon = r.icon;
                                const active = role === r.value;
                                return (
                                    <button
                                        key={r.value}
                                        type="button"
                                        onClick={() => setRole(r.value)}
                                        className={cn(
                                            "flex items-center gap-2.5 p-3 rounded-lg border text-left transition-all duration-150",
                                            active
                                                ? "border-indigo-500 bg-indigo-500/15 text-white"
                                                : "border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/70"
                                        )}
                                    >
                                        <Icon className={cn("size-4 shrink-0", active ? "text-indigo-400" : "text-white/30")} />
                                        <div className="leading-tight">
                                            <div className="text-xs font-semibold">{r.label}</div>
                                            <div className="text-[10px] text-white/30">{r.description}</div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-white/70 text-sm">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/30" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-indigo-500 focus:ring-indigo-500/20"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-white/70 text-sm">Password</Label>
                                <Link href="/forgetPassword" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/30" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-9 pr-9 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-indigo-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                                {error}
                            </p>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold h-10 shadow-lg shadow-indigo-500/20 transition-all"
                        >
                            {loading ? "Signing in…" : "Sign In"}
                        </Button>
                    </form>

                    <p className="text-center text-xs text-white/30">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                            Create account
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
