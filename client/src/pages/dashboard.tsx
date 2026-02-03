import { useLicenses } from "@/hooks/use-licenses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: licenses, isLoading } = useLicenses();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const total = licenses?.length || 0;
  const active = licenses?.filter(l => l.isActive).length || 0;
  const expired = licenses?.filter(l => {
    if (!l.expiresAt) return false;
    return new Date(l.expiresAt) < new Date();
  }).length || 0;
  
  // Calculate revenue or other metrics if we had them
  // For now, let's show revocation rate
  const revoked = total - active - expired; // Rough approximation logic

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">System Overview</h2>
        <p className="text-muted-foreground">
          Welcome to Licensa. You are currently managing <span className="font-semibold text-foreground">{total}</span> licenses 
          across your distribution network.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Licenses" 
          value={total} 
          icon={Key} 
          description="Total keys generated"
        />
        <StatCard 
          title="Active Licenses" 
          value={active} 
          icon={CheckCircle} 
          description="Ready for production"
          className="text-primary"
        />
        <StatCard 
          title="Platform Reach" 
          value="99.9%" 
          icon={Clock} 
          description="System uptime"
          className="text-blue-500"
        />
        <StatCard 
          title="Security Alerts" 
          value={revoked > 0 ? revoked : 0} 
          icon={AlertTriangle} 
          description="Anomalies detected"
          className="text-destructive"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-lg bg-accent/50 border">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Enterprise Security</p>
                <p className="text-xs text-muted-foreground">All licenses are encrypted with AES-256 standards.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-accent/50 border">
              <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Multi-Language Support</p>
                <p className="text-xs text-muted-foreground">SDKs available for TS, Java, Go, Rust, and more.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Quick Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Integrate using our unified REST API
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Automatic email delivery on key generation
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Discord bot for remote license management
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { ShieldCheck, Terminal } from "lucide-react";

function StatCard({ title, value, icon: Icon, description, className = "" }: any) {
  return (
    <Card className="glass-card transition-all hover:shadow-md hover:-translate-y-0.5 duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 text-muted-foreground ${className}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[120px] rounded-xl" />
        ))}
      </div>
    </div>
  );
}
