"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, GraduationCap, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => setLoading(false), 1500);
    }

    return (
        <div className="w-full max-w-md px-4">
            <Card className="shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl text-white">
                <CardHeader className="space-y-1 pb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="size-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                            <GraduationCap className="size-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-xl text-white">Create Account</CardTitle>
                            <CardDescription className="text-white/50 text-xs">Join PTE Portal as a student</CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Full Name */}
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-white/70 text-sm">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/30" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-white/70 text-sm">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/30" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-white/70 text-sm">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/30" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a strong password"
                                    className="pl-9 pr-9 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-emerald-500"
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

                        {/* Confirm Password */}
                        <div className="space-y-1.5">
                            <Label htmlFor="confirm" className="text-white/70 text-sm">Confirm Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/30" />
                                <Input
                                    id="confirm"
                                    type="password"
                                    placeholder="Repeat your password"
                                    className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold h-10 shadow-lg shadow-emerald-500/20 transition-all mt-2"
                        >
                            {loading ? "Creating account…" : "Create Account"}
                        </Button>
                    </form>

                    <p className="text-center text-xs text-white/30 mt-5">
                        Already have an account?{" "}
                        <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                            Sign in
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
