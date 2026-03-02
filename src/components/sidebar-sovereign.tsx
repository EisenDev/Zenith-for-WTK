"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    MessageSquareQuote,
    TrendingUp,
    Settings,
    Hotel,
    ChevronRight,
} from "lucide-react";
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
    const pathname = usePathname();

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
            <SidebarContent className="px-2 py-4">
                <SidebarGroup>
                    <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 transition-opacity duration-300 group-data-[collapsible=icon]:opacity-0 mb-2">
                        Navigation
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-1">
                            {navItems.map((item) => {
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
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
