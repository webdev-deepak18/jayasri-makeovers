"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  HomeIcon, 
  ClipboardDocumentListIcon, 
  UsersIcon, 
  ChartBarIcon
} from "@heroicons/react/24/outline";
import { 
  HomeIcon as HomeIconSolid, 
  ClipboardDocumentListIcon as ClipboardSolid, 
  UsersIcon as UsersSolid, 
  ChartBarIcon as ChartBarSolid
} from "@heroicons/react/24/solid";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Do not show navigation on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const tabs = [
    { name: "Home", href: "/admin/dashboard", icon: HomeIcon, iconActive: HomeIconSolid },
    { name: "Orders", href: "/admin/orders", icon: ClipboardDocumentListIcon, iconActive: ClipboardSolid },
    { name: "Earnings", href: "/admin/earnings", icon: ChartBarIcon, iconActive: ChartBarSolid },
    { name: "Clients", href: "/admin/clients", icon: UsersIcon, iconActive: UsersSolid },
  ];

  return (
    <div className="min-h-screen bg-brand-light pb-20 md:pb-0">
      <main className="max-w-md mx-auto min-h-screen bg-white shadow-xl relative overflow-x-hidden">
        {/* Main Content Area */}
        <div className="pb-24 min-h-screen">
          {children}
        </div>

        {/* Bottom Tab Navigation Bar (Mobile) */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-brand-secondary/20 safe-area-bottom z-50 md:sticky md:bottom-auto">
          <div className="max-w-md mx-auto grid grid-cols-4 h-16">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
              // Exception: Don't highlight "Orders" if we are on "New Order"
              const isStrictlyActive = tab.name === "Orders" 
                ? pathname === "/admin/orders" 
                : isActive;

              const Icon = isStrictlyActive ? tab.iconActive : tab.icon;

              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                    isStrictlyActive ? "text-brand-primary" : "text-neutral-400 hover:text-brand-secondary"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-[10px] font-poppins font-semibold">{tab.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
