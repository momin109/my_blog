"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Instagram, Twitter, Linkedin, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Blogs", href: "/posts" },
    { name: "Guest Blog", href: "/guest-blog" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Terms & Conditions", href: "/terms" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-3 sm:px-4 h-14 md:h-20 flex items-center justify-between">
          {/* ===== Mobile Menu ===== */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="w-[280px] sm:w-[360px] pl-5 pr-4 pt-6"
              >
                {/* ✅ Required for accessibility */}
                <SheetHeader>
                  <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
                </SheetHeader>

                <div className="flex items-center gap-2 mb-8">
                  <Image
                    src="/logo.png"
                    alt="Muktobaak Logo"
                    width={32}
                    height={32}
                  />
                  <span className="font-serif font-bold text-lg">
                    Muktobaak
                  </span>
                </div>

                <nav className="flex flex-col gap-3">
                  {navigation.map((item) => (
                    <Link key={item.name} href={item.href}>
                      <span
                        className={cn(
                          "text-base font-medium transition-colors cursor-pointer",
                          isActive(item.href)
                            ? "text-primary"
                            : "text-muted-foreground hover:text-primary",
                        )}
                      >
                        {item.name}
                      </span>
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* ===== Logo ===== */}
          <Link href="/" className="flex items-center gap-2 md:gap-3">
            <Image
              src="/logo.png"
              alt="Muktobaak Logo"
              width={36}
              height={36}
              className="md:w-12 md:h-12"
            />
            <span className="text-lg sm:text-xl md:text-3xl font-serif font-bold tracking-tight">
              Muktobaak.
            </span>
          </Link>

          {/* ===== Desktop Navigation ===== */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <span
                  className={cn(
                    "text-sm font-medium uppercase tracking-wide transition-colors cursor-pointer",
                    isActive(item.href)
                      ? "text-primary border-b-2 border-primary pb-1"
                      : "text-muted-foreground hover:text-primary",
                  )}
                >
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>

          {/* Right spacer (future actions) */}
          <div className="w-9 md:w-auto" />
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="flex-1">{children}</main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white border-t border-border mt-12 md:mt-20 pt-10 md:pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
            <div className="md:col-span-4 space-y-6">
              <span className="text-2xl font-serif font-bold">Muktobaak.</span>
              <p className="text-muted-foreground leading-relaxed max-w-sm">
                A digital publication focused on thoughtful writing, culture,
                and meaningful stories.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://www.facebook.com/people/Abdur-Rahman/61579368187288/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:text-primary"
                    aria-label="Facebook"
                  >
                    {/* <Facebook className="h-4 w-4" /> */}
                  </Button>
                </a>
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <h4 className="font-serif font-semibold text-lg">Explore</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/posts">Posts</Link>
                </li>
                <li>
                  <Link href="/guest-blog">Guest Blog</Link>
                </li>
              </ul>
            </div>

            <div className="md:col-span-2 space-y-4">
              <h4 className="font-serif font-semibold text-lg">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about">About</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
                <li>
                  <Link href="/terms">Terms</Link>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4 space-y-4">
              <h4 className="font-serif font-semibold text-lg">
                Weekly Reading
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                New essays and guest stories are published every week. Visit
                back often or follow us on social media.
              </p>
            </div>
          </div>

          <div className="border-t border-border pt-6 text-xs text-muted-foreground flex flex-col md:flex-row justify-between gap-4">
            <p>© 2024 Muktobaak. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/terms">Terms</Link>
              <Link href="/privacy">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// "use client";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   Search,
//   Menu,
//   X,
//   Instagram,
//   Twitter,
//   Linkedin,
//   Facebook,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useState } from "react";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import { cn } from "@/lib/utils";
// import Image from "next/image";

// export function Layout({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname();
//   const [isSearchOpen, setIsSearchOpen] = useState(false);

//   const navigation = [
//     { name: "Home", href: "/" },
//     { name: "posts", href: "/posts" },
//     { name: "Guest Blog", href: "/guest-blog" },
//     { name: "About", href: "/about" },
//     { name: "Contact", href: "/contact" },
//     { name: "terms & conditions", href: "/terms" },
//   ];

//   const isActive = (path: string) => pathname === path;

//   return (
//     <div className="min-h-screen flex flex-col bg-background font-sans text-foreground selection:bg-primary/20">
//       {/* Top Navigation */}
//       <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md transition-all">
//         <div className="container mx-auto px-4 h-20 flex items-center justify-between">
//           {/* Mobile Menu */}
//           <div className="md:hidden">
//             <Sheet>
//               <SheetTrigger asChild>
//                 <Button variant="ghost" size="icon">
//                   <Menu className="h-6 w-6" />
//                 </Button>
//               </SheetTrigger>
//               <SheetContent side="left" className="w-[300px] sm:w-[400px]">
//                 <nav className="flex flex-col gap-4 mt-10">
//                   {navigation.map((item) => (
//                     <Link key={item.name} href={item.href}>
//                       <span
//                         className={cn(
//                           "text-lg font-medium transition-colors hover:text-primary cursor-pointer",
//                           isActive(item.href)
//                             ? "text-primary"
//                             : "text-muted-foreground",
//                         )}
//                       >
//                         {item.name}
//                       </span>
//                     </Link>
//                   ))}
//                 </nav>
//               </SheetContent>
//             </Sheet>
//           </div>

//           {/* Logo */}
//           <Link href="/" className="flex items-center ">
//             <Image
//               src="/logo.png"
//               alt="Editorial Logo"
//               width={48}
//               height={48}
//             />
//             <span className="text-2xl md:text-3xl font-serif font-bold tracking-tight">
//               Muktobaak.
//             </span>
//           </Link>

//           {/* Desktop Nav */}
//           <nav className="hidden md:flex items-center gap-8">
//             {navigation.map((item) => (
//               <Link key={item.name} href={item.href}>
//                 <span
//                   className={cn(
//                     "text-sm font-medium transition-colors hover:text-primary cursor-pointer uppercase tracking-wide",
//                     isActive(item.href)
//                       ? "text-primary border-b-2 border-primary pb-1"
//                       : "text-muted-foreground",
//                   )}
//                 >
//                   {item.name}
//                 </span>
//               </Link>
//             ))}
//           </nav>

//           {/* Right Actions */}
//           <div className="flex items-center gap-2">
//             {/* <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
//               <DialogTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="hover:bg-transparent hover:text-primary"
//                 >
//                   <Search className="h-5 w-5" />
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-[425px] top-[20%] translate-y-0">
//                 <div className="flex flex-col gap-4">
//                   <h2 className="text-xl font-serif font-semibold">
//                     Search Stories
//                   </h2>
//                   <div className="relative">
//                     <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       placeholder="Type to search..."
//                       className="pl-10 h-12 text-lg"
//                     />
//                   </div>
//                   <div className="flex flex-wrap gap-2 mt-2">
//                     <span className="text-xs text-muted-foreground uppercase tracking-wider">
//                       Trending:
//                     </span>
//                     {["Minimalism", "Interior", "Lifestyle", "Travel"].map(
//                       (tag) => (
//                         <span
//                           key={tag}
//                           className="text-xs bg-secondary px-2 py-1 rounded-full cursor-pointer hover:bg-secondary/80"
//                         >
//                           {tag}
//                         </span>
//                       ),
//                     )}
//                   </div>
//                 </div>
//               </DialogContent>
//             </Dialog> */}

//             {/* <Button className="hidden sm:inline-flex rounded-full px-6 font-medium bg-primary text-primary-foreground hover:bg-primary/90">
//               Subscribe
//             </Button> */}
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="flex-1">{children}</main>

//       {/* Footer */}
//       <footer className="bg-white border-t border-border mt-20 pt-16 pb-8">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
//             <div className="md:col-span-4 space-y-6">
//               <span className="text-2xl font-serif font-bold">Editorial.</span>
//               <p className="text-muted-foreground leading-relaxed max-w-sm">
//                 A premium digital publication dedicated to thoughtful design,
//                 culture, and slow living. curated for the modern minimalist.
//               </p>
//               <div className="flex gap-4">
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="h-8 w-8 rounded-full hover:bg-secondary"
//                 >
//                   <Twitter className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="h-8 w-8 rounded-full hover:bg-secondary"
//                 >
//                   <Instagram className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="h-8 w-8 rounded-full hover:bg-secondary"
//                 >
//                   <Linkedin className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>

//             <div className="md:col-span-2 space-y-6">
//               <h4 className="font-serif font-semibold text-lg">Explore</h4>
//               <ul className="space-y-3 text-sm text-muted-foreground">
//                 <li>
//                   <Link href="/category/design">
//                     <span className="hover:text-primary cursor-pointer transition-colors">
//                       Design
//                     </span>
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="/category/culture">
//                     <span className="hover:text-primary cursor-pointer transition-colors">
//                       Culture
//                     </span>
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="/category/travel">
//                     <span className="hover:text-primary cursor-pointer transition-colors">
//                       Travel
//                     </span>
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="/category/food">
//                     <span className="hover:text-primary cursor-pointer transition-colors">
//                       Food & Drink
//                     </span>
//                   </Link>
//                 </li>
//               </ul>
//             </div>

//             <div className="md:col-span-2 space-y-6">
//               <h4 className="font-serif font-semibold text-lg">Company</h4>
//               <ul className="space-y-3 text-sm text-muted-foreground">
//                 <li>
//                   <Link href="/about">
//                     <span className="hover:text-primary cursor-pointer transition-colors">
//                       About Us
//                     </span>
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="/contact">
//                     <span className="hover:text-primary cursor-pointer transition-colors">
//                       Contact
//                     </span>
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="/careers">
//                     <span className="hover:text-primary cursor-pointer transition-colors">
//                       Careers
//                     </span>
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="/privacy">
//                     <span className="hover:text-primary cursor-pointer transition-colors">
//                       Privacy Policy
//                     </span>
//                   </Link>
//                 </li>
//               </ul>
//             </div>

//             <div className="md:col-span-4 space-y-6">
//               <h4 className="font-serif font-semibold text-lg">
//                 Weekly Newsletter
//               </h4>
//               <p className="text-sm text-muted-foreground">
//                 Get the latest stories delivered to your inbox. No spam, just
//                 inspiration.
//               </p>
//               <div className="flex gap-2">
//                 <Input
//                   placeholder="Your email address"
//                   className="bg-secondary/30 border-secondary focus:bg-background"
//                 />
//                 <Button>Subscribe</Button>
//               </div>
//             </div>
//           </div>

//           <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
//             <p>&copy; 2024 Editorial Magazine. All rights reserved.</p>
//             <div className="flex gap-6">
//               <span>Terms</span>
//               <span>Privacy</span>
//               <span>Cookies</span>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }
