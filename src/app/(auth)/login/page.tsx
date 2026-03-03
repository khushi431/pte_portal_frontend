"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, GraduationCap, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardUrl } from "@/lib/routes";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        if (!email.trim()) { setError("Please enter your email."); return; }
        if (!password.trim()) { setError("Please enter your password."); return; }

        setLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Login failed");
                return;
            }

            // Redirect based on role + tenant
            const dashboard = getDashboardUrl(data.user.role, data.user.tenant_id);
            router.push(dashboard);
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-md px-4">
            <Card className="shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl text-white">
                <CardHeader className="space-y-1 pb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
                            <GraduationCap className="size-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-xl text-white">Welcome back</CardTitle>
                            <CardDescription className="text-white/50 text-xs">
                                Sign in to your PTE Portal account
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-5">
                    <form onSubmit={handleLogin} className="space-y-4">
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