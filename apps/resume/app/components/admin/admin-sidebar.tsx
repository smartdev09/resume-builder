"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "utils/utils";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  FileText, 
  BarChart3,
  Shield,
  Database,
  Layers
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Onboarding Fields",
    href: "/admin/fields",
    icon: FileText,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: FileText,
  },
  {
    name: "Subcategories",
    href: "/admin/subcategories",
    icon: Layers,
  },
  {
    name: "Submissions",
    href: "/admin/submissions",
    icon: Database,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-card border-r border-border">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold">Admin Portal</h1>
            <p className="text-sm text-muted-foreground">Platform Management</p>
          </div>
        </div>
        
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
} 