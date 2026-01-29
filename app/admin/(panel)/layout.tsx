// import { Layout } from "@/components/Layout";
// import AdminShell from "@/components/admin/AdminShell";

// export default function AdminPanelLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <Layout>
//       <AdminShell>{children}</AdminShell>
//     </Layout>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Settings,
  Users,
  LogOut,
  PlusCircle,
  BarChart3,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Posts", href: "/admin/posts", icon: FileText },
    { name: "Contacts", href: "/admin/contacts", icon: FileText },
  ];

  const isActive = (path: string) => {
    if (path === "/admin" && pathname === "/admin") return true;
    if (path !== "/admin" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen flex bg-secondary/20 font-sans text-foreground">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r border-border hidden md:flex flex-col fixed inset-y-0 z-50">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/">
            <span className="font-serif font-bold text-xl cursor-pointer">
              Editorial.
            </span>
          </Link>
          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider font-medium">
            Admin
          </span>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3">
          <div className="space-y-1">
            <Link href="/admin/posts/create-post">
              <button className="w-full flex items-center gap-2 px-3 py-2.5 mb-6 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm shadow-sm">
                <PlusCircle className="w-4 h-4" />
                New Story
              </button>
            </Link>

            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <button
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1",
                    isActive(item.href)
                      ? "bg-secondary text-primary"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </button>
              </Link>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg transition-colors">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen">
        <div className="h-16 border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-40 px-6 flex items-center justify-between md:hidden">
          <span className="font-serif font-bold text-lg">Editorial Admin</span>
          {/* Mobile menu trigger would go here */}
        </div>
        <div className="p-6 md:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
