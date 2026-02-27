import { GraduationCap, ClipboardList, TrendingUp, Star } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const students = [
    { name: "Priya Sharma", progress: 88 },
    { name: "Arjun Singh", progress: 72 },
    { name: "Meera Patel", progress: 79 },
    { name: "Ravi Kumar", progress: 85 },
];

export default function TeacherDashboard() {
    return (
        <>
            <PageHeader title="Teacher Dashboard" subtitle="Manage your students and tests" />
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                <StatCard label="My Students" value="42" icon={GraduationCap} iconBg="bg-emerald-100" iconColor="text-emerald-600" />
                <StatCard label="Tests Created" value="9" icon={ClipboardList} change="+2 this week" changeType="up" iconBg="bg-sky-100" iconColor="text-sky-600" />
                <StatCard label="Avg. Score" value="74%" icon={TrendingUp} change="+3% vs last month" changeType="up" iconBg="bg-amber-100" iconColor="text-amber-600" />
                <StatCard label="Top Score" value="88/90" icon={Star} iconBg="bg-violet-100" iconColor="text-violet-600" />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Student Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {students.map((s) => (
                        <div key={s.name} className="flex items-center gap-4">
                            <span className="text-sm font-medium text-foreground w-36 shrink-0 truncate">{s.name}</span>
                            <Progress value={s.progress} className="flex-1 h-2" />
                            <Badge variant="outline" className="font-mono text-xs w-12 text-center">{s.progress}%</Badge>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </>
    );
}
