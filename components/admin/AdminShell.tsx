// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { LayoutDashboard, FileText, PlusCircle, LogOut } from "lucide-react";
// import { getAdminToken } from "@/lib/admin-client";
// import { useEffect } from "react";

// export default function AdminShell({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();
//   const router = useRouter();

//   // ✅ protect admin pages (token না থাকলে login)
//   useEffect(() => {
//     const token = getAdminToken();
//     if (!token) router.push("/admin/login");
//   }, [router]);

//   const nav = [
//     { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
//     { name: "Posts", href: "/admin/posts", icon: FileText },
//     { name: "New Post", href: "/admin/new", icon: PlusCircle },
//   ];

//   function logout() {
//     localStorage.removeItem("ADMIN_TOKEN");
//     router.push("/admin/login");
//   }

//   return (
//     <div className="container mx-auto px-4 py-10">
//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//         {/* Sidebar */}
//         <aside className="lg:col-span-3">
//           <div className="sticky top-28 rounded-2xl border bg-card p-4">
//             <div className="mb-4">
//               <div className="text-xl font-serif font-bold">Admin Panel</div>
//               <div className="text-xs text-muted-foreground">
//                 Manage posts & content
//               </div>
//             </div>

//             <nav className="space-y-2">
//               {nav.map((item) => {
//                 const active = pathname === item.href;
//                 const Icon = item.icon;
//                 return (
//                   <Link key={item.href} href={item.href}>
//                     <div
//                       className={cn(
//                         "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
//                         active
//                           ? "bg-secondary text-foreground"
//                           : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
//                       )}
//                     >
//                       <Icon className="h-4 w-4" />
//                       {item.name}
//                     </div>
//                   </Link>
//                 );
//               })}
//             </nav>

//             <div className="mt-6 pt-4 border-t">
//               <Button
//                 variant="outline"
//                 className="w-full justify-start gap-2"
//                 onClick={logout}
//               >
//                 <LogOut className="h-4 w-4" /> Logout
//               </Button>
//             </div>
//           </div>
//         </aside>

//         {/* Content */}
//         <main className="lg:col-span-9">
//           <div className="rounded-2xl border bg-card p-6">{children}</div>
//         </main>
//       </div>
//     </div>
//   );
// }
