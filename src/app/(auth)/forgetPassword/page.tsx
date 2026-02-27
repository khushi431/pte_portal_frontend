"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => { setLoading(false); setSent(true); }, 1500);
    }

    return (
        <div className="w-full max-w-md px-4">
            <Card className="shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl text-white">
                <CardHeader className="space-y-1 pb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="size-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                            <KeyRound className="size-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-xl text-white">Reset Password</CardTitle>
                            <CardDescription className="text-white/50 text-xs">We&apos;ll send a reset link to your email</CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    {sent ? (
                        <div className="flex flex-col items-center gap-4 py-4 text-center">
                            <div className="size-14 rounded-full bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                                <CheckCircle2 className="size-7 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-white font-semibold text-sm">Check your inbox</p>
                                <p className="text-white/40 text-xs mt-1">
                                    We sent a reset link to <span className="text-white/70">{email}</span>
                                </p>
                            </div>
                            <Link href="/login">
                                <Button variant="ghost" className="text-white/50 hover:text-white gap-2 text-sm mt-2">
                                    <ArrowLeft className="size-4" /> Back to Sign In
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-white/70 text-sm">Email address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/30" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-violet-500"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold h-10 shadow-lg shadow-violet-500/20"
                            >
                                {loading ? "Sending…" : "Send Reset Link"}
                            </Button>

                            <Link href="/login" className="flex items-center justify-center gap-1.5 text-xs text-white/30 hover:text-white/50 transition-colors mt-2">
                                <ArrowLeft className="size-3" />
                                Back to Sign In
                            </Link>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
