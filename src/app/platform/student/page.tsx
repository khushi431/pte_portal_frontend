import { GraduationCap, TrendingUp, Users } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const students = [
    { name: "Priya Sharma", branch: "Mumbai", score: 88, active: true },
    { name: "Arjun Singh", branch: "Delhi", score: 72, active: true },
    { name: "Meera Patel", branch: "Pune", score: 79, active: false },
    { name: "Ravi Kumar", branch: "Mumbai", score: 85, active: true },
];

export default function PlatformStudentsPage() {
    return (
        <>
            <PageHeader title="Students Overview" subtitle="All students across the platform" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <StatCard label="Total Students" value="520" icon={GraduationCap} change="+34 this month" changeType="up" iconBg="bg-orange-100" iconColor="text-orange-600" />
                <StatCard label="Active This Month" value="210" icon={Users} iconBg="bg-sky-100" iconColor="text-sky-600" />
                <StatCard label="Avg. Score" value="71%" icon={TrendingUp} change="+2% vs last" changeType="up" iconBg="bg-emerald-100" iconColor="text-emerald-600" />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Student List</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs text-muted-foreground border-b border-border">
                                <th className="pb-3 font-medium">Name</th>
                                <th className="pb-3 font-medium">Branch</th>
                                <th className="pb-3 font-medium">Score</th>
                                <th className="pb-3 font-medium text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {students.map((s) => (
                                <tr key={s.name} className="hover:bg-muted/40 transition-colors">
                                    <td className="py-3 font-medium">{s.name}</td>
                                    <td className="py-3 text-muted-foreground">{s.branch}</td>
                                    <td className="py-3 font-mono">{s.score}/90</td>
                                    <td className="py-3 text-right">
                                        <Badge variant={s.active ? "default" : "secondary"} className="text-xs">
                                            {s.active ? "Active" : "Inactive"}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </>
    );
}
