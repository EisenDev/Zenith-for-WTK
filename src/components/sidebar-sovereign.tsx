"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    MessageSquareQuote,
    TrendingUp,
    Settings,
    Hotel,
    ChevronRight,
    LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { motion } from "framer-motion";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";

const navItems = [
    {
        title: "Global Overview",
        url: "/",
        icon: LayoutDashboard,
    },
    {
        title: "Reputation Feed",
        url: "/reputation",
        icon: MessageSquareQuote,
    },
    {
        title: "Competitor Benchmark",
        url: "/competitors",
        icon: TrendingUp,
    },
    {
        title: "AI Settings",
        url: "/settings",
        icon: Settings,
    },
];

export function SidebarSovereign() {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const filteredItems = navItems.filter(item => {
        if (!user) return false;
        if (item.url === "/settings" || item.url === "/competitors") {
            return user.role === "admin";
        }
        return true;
    });

    return (
        <Sidebar collapsible="icon" className="border-r border-white/5 bg-sidebar font-poppins">
            <SidebarHeader className="h-16 flex items-center px-6 border-b border-white/5">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-transparent transition-transform group-hover:scale-110">
                        <img src="/branding/logo.png" alt="ZENITH Logo" className="h-full w-full object-cover" />
                    </div>
                    <span className="text-xl font-black tracking-tighter text-foreground transition-opacity duration-300 group-data-[collapsible=icon]:opacity-0 font-poppins uppercase">
                        ZENITH
                    </span>
                </Link>
            </SidebarHeader>
            <SidebarContent className="px-2 py-4 flex flex-col h-full">
                <SidebarGroup>
                    <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 transition-opacity duration-300 group-data-[collapsible=icon]:opacity-0 mb-2">
                        Navigation
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-1">
                            {filteredItems.map((item) => {
                                const isActive = pathname === item.url;
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            tooltip={item.title}
                                            className={`h-11 px-4 py-6 rounded-xl transition-all duration-300 group ${isActive
                                                ? "bg-primary/10 text-primary shadow-lg shadow-primary/5"
                                                : "text-muted-foreground/50 hover:bg-white/5 hover:text-foreground"
                                                }`}
                                        >
                                            <Link href={item.url} className="flex items-center gap-3 w-full">
                                                <item.icon className={`h-4 w-4 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-primary" : "text-muted-foreground/20"}`} />
                                                <span className="text-[11px] font-bold uppercase tracking-[0.2em] font-poppins">{item.title}</span>
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="active-pill"
                                                        className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                                                    />
                                                )}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <div className="mt-auto px-4 pb-4 space-y-4">
                    {user && (
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 group-data-[collapsible=icon]:hidden">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black">
                                    {user.email[0].toUpperCase()}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] font-bold text-foreground truncate">{user.email}</span>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40 italic">
                                        {user.role === 'admin' ? 'Nexus Admin' : `${user.department} Operations`}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <Button
                        variant="ghost"
                        onClick={logout}
                        className="w-full h-11 px-4 justify-start gap-3 rounded-xl text-muted-foreground/50 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-300 group font-poppins"
                    >
                        <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] group-data-[collapsible=icon]:hidden">Terminate Session</span>
                    </Button>
                </div>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
