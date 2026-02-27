import { Trophy, PenLine, Clock, Target } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const recentTests = [
    { name: "PTE Mock Test #4", score: "88/90", date: "Feb 24", status: "Completed" },
    { name: "PTE Mock Test #3", score: "72/90", date: "Feb 20", status: "Completed" },
    { name: "PTE Mock Test #2", score: "79/90", date: "Feb 15", status: "Completed" },
    { name: "PTE Mock Test #5", score: "—", date: "Mar 1", status: "Upcoming" },
];

export default function StudentDashboard() {
    return (
        <>
            <PageHeader
                title="My Dashboard"
                subtitle="Track your PTE preparation progress"
                action={
                    <Button className="bg-rose-600 hover:bg-rose-500 text-white gap-2 shadow-sm">
                        <PenLine className="size-4" /> Start Practice
                    </Button>
                }
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                <StatCard label="Tests Taken" value="15" icon={PenLine} change="+3 this month" changeType="up" iconBg="bg-rose-100" iconColor="text-rose-600" />
                <StatCard label="Best Score" value="88/90" icon={Trophy} iconBg="bg-amber-100" iconColor="text-amber-600" />
                <StatCard label="Practice Hours" value="24h" icon={Clock} change="+6h this week" changeType="up" iconBg="bg-sky-100" iconColor="text-sky-600" />
                <StatCard label="Target Score" value="79+" icon={Target} iconBg="bg-violet-100" iconColor="text-violet-600" />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Recent Tests</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs text-muted-foreground border-b border-border">
                                <th className="pb-3 font-medium">Test</th>
                                <th className="pb-3 font-medium">Score</th>
                                <th className="pb-3 font-medium">Status</th>
                                <th className="pb-3 font-medium text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {recentTests.map((t, i) => (
                                <tr key={i} className="hover:bg-muted/40 transition-colors">
                                    <td className="py-3 font-medium">{t.name}</td>
                                    <td className="py-3 font-mono text-sm">{t.score}</td>
                                    <td className="py-3">
                                        <Badge variant={t.status === "Completed" ? "default" : "secondary"} className="text-xs">
                                            {t.status}
                                        </Badge>
                                    </td>
                                    <td className="py-3 text-muted-foreground text-right text-xs">{t.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </>
    );
}
