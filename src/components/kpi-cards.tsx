"use client";

import { motion } from "framer-motion";
import {
    TrendingUp,
    Smile,
    Frown,
    DollarSign,
    Star
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KPICardsProps {
    metrics?: {
        score: string;
        positivePercent: string;
        positiveCount: string;
        negativePercent: string;
        negativeCount: string;
        revenue: string;
    };
}

export function KPICards({ metrics }: KPICardsProps) {
    const kpis = [
        {
            title: "Reputation Score",
            value: metrics?.score || "0.0",
            change: "0.0",
            trend: "neutral",
            icon: Star,
            color: "text-amber-400",
            description: "Aggregated across all platforms",
        },
        {
            title: "Positive Sentiment",
            value: metrics?.positivePercent || "0%",
            change: "0%",
            trend: "neutral",
            icon: Smile,
            color: "text-emerald-400",
            description: metrics?.positiveCount || "0 positive reviews",
        },
        {
            title: "Negative Sentiment",
            value: metrics?.negativePercent || "0%",
            change: "0%",
            trend: "neutral",
            icon: Frown,
            color: "text-rose-400",
            description: metrics?.negativeCount || "0 reviews flagged",
        },
        {
            title: "Revenue Opportunity",
            value: metrics?.revenue || "$0",
            change: "0",
            trend: "neutral",
            icon: DollarSign,
            color: "text-blue-400",
            description: "Est. from improved retention",
        },
    ];

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 font-sans">
            {kpis.map((kpi, index) => (
                <motion.div
                    key={kpi.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                    <Card className="glass overflow-hidden border-none group">
                        <div className={`absolute top-0 right-0 p-4 opacity-10 transition-transform duration-300 group-hover:scale-110 ${kpi.color}`}>
                            <kpi.icon size={80} />
                        </div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 font-poppins">
                                {kpi.title}
                            </CardTitle>
                            <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black tracking-tighter transition-transform duration-300 group-hover:translate-x-1 font-poppins">
                                {kpi.value}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                                <span className="text-[10px] font-bold flex items-center text-muted-foreground/40">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    Live
                                </span>
                                <span className="text-[9px] text-muted-foreground/30 font-bold uppercase tracking-wider ml-auto">Verified Core</span>
                            </div>
                            <p className="text-[9px] text-muted-foreground/50 mt-4 italic font-bold uppercase tracking-wide">
                                {kpi.description}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
