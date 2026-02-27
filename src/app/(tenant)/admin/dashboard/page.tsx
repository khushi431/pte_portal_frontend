import { Users, BookOpen, GraduationCap, ClipboardList } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const recentStudents = [
    { name: "Priya Sharma", score: "88/90", test: "PTE Mock #4", date: "Today" },
    { name: "Arjun Singh", score: "72/90", test: "PTE Mock #3", date: "Yesterday" },
    { name: "Meera Patel", score: "79/90", test: "PTE Mock #4", date: "Feb 23" },
    { name: "Ravi Kumar", score: "85/90", test: "PTE Mock #2", date: "Feb 22" },
];

export default function AdminDashboard() {
    return (
        <>
            <PageHeader title="Admin Dashboard" subtitle="Institute overview and performance" />
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                <StatCard label="Total Students" value="348" icon={GraduationCap} change="+12 this week" changeType="up" iconBg="bg-sky-100" iconColor="text-sky-600" />
                <StatCard label="Teachers" value="12" icon={Users} iconBg="bg-violet-100" iconColor="text-violet-600" />
                <StatCard label="Question Bank" value="2,480" icon={BookOpen} change="+60 added" changeType="up" iconBg="bg-amber-100" iconColor="text-amber-600" />
                <StatCard label="Active Tests" value="7" icon={ClipboardList} iconBg="bg-emerald-100" iconColor="text-emerald-600" />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Recent Test Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs text-muted-foreground border-b border-border">
                                <th className="pb-3 font-medium">Student</th>
                                <th className="pb-3 font-medium">Test</th>
                                <th className="pb-3 font-medium">Score</th>
                                <th className="pb-3 font-medium text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {recentStudents.map((s) => (
                                <tr key={s.name + s.date} className="hover:bg-muted/40 transition-colors">
                                    <td className="py-3 font-medium">{s.name}</td>
                                    <td className="py-3 text-muted-foreground">{s.test}</td>
                                    <td className="py-3">
                                        <Badge variant="secondary" className="font-mono text-xs">{s.score}</Badge>
                                    </td>
                                    <td className="py-3 text-muted-foreground text-right text-xs">{s.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </>
    );
}
