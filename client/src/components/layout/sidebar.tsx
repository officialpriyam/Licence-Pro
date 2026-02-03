import { Link, useLocation } from "wouter";
import { LayoutDashboard, Key, BookOpen, LogOut, ShieldCheck, Sun, Moon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function Sidebar() {
  const [location] = useLocation();
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/licenses", label: "Licenses", icon: Key },
    { href: "/settings", label: "Settings", icon: ShieldCheck },
    { href: "/docs", label: "Integration", icon: BookOpen },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 w-64 border-r border-border bg-card/50 backdrop-blur-xl flex flex-col z-20">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <ShieldCheck className="w-6 h-6 text-primary mr-2" />
        <span className="font-bold text-lg tracking-tight">LicenceManager</span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}>
            <div className={`sidebar-link cursor-pointer ${location === href ? "active" : ""}`}>
              <Icon className="w-4 h-4" />
              {label}
            </div>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border space-y-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4 mr-2" />
          ) : (
            <Sun className="w-4 h-4 mr-2" />
          )}
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={() => logout()}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
