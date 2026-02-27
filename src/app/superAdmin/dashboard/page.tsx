import { Building2, CreditCard, TrendingUp, Users } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const recentTenants = [
    { name: "Apex Academy", plan: "Pro", status: "Active", date: "Feb 24" },
    { name: "Global PTE Institute", plan: "Enterprise", status: "Active", date: "Feb 22" },
    { name: "EduReach Centre", plan: "Starter", status: "Trial", date: "Feb 20" },
    { name: "Bright Minds", plan: "Pro", status: "Active", date: "Feb 18" },
];

export default function SuperAdminDashboard() {
    return (
        <>
            <PageHeader
                title="Super Admin Dashboard"
                subtitle="Platform overview and management"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                <StatCard label="Total Tenants" value="24" icon={Building2} change="+3 this month" changeType="up" iconBg="bg-indigo-100" iconColor="text-indigo-600" />
                <StatCard label="Active Users" value="1,842" icon={Users} change="+124 this week" changeType="up" iconBg="bg-sky-100" iconColor="text-sky-600" />
                <StatCard label="Monthly Revenue" value="₹2.4L" icon={CreditCard} change="+18% MoM" changeType="up" iconBg="bg-emerald-100" iconColor="text-emerald-600" />
                <StatCard label="Avg. Score" value="71%" icon={TrendingUp} change="-1.2% vs last" changeType="down" iconBg="bg-amber-100" iconColor="text-amber-600" />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Recent Tenants</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs text-muted-foreground border-b border-border">
                                <th className="pb-3 font-medium">Institute</th>
                                <th className="pb-3 font-medium">Plan</th>
                                <th className="pb-3 font-medium">Status</th>
                                <th className="pb-3 font-medium text-right">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {recentTenants.map((t) => (
                                <tr key={t.name} className="hover:bg-muted/40 transition-colors">
                                    <td className="py-3 font-medium text-foreground">{t.name}</td>
                                    <td className="py-3 text-muted-foreground">{t.plan}</td>
                                    <td className="py-3">
                                        <Badge variant={t.status === "Active" ? "default" : "secondary"} className="text-xs">
                                            {t.status}
                                        </Badge>
                                    </td>
                                    <td className="py-3 text-muted-foreground text-right">{t.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </>
    );
}
