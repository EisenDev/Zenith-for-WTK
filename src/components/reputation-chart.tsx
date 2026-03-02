"use client";

import {
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Area,
    AreaChart,
    Tooltip
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";

interface ReputationTrendChartProps {
    data?: any[];
}

export function ReputationTrendChart({ data = [] }: ReputationTrendChartProps) {
    const hasData = data.length > 0;

    return (
        <Card className="glass border-none h-[400px] relative overflow-hidden group">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl font-black tracking-tight font-outfit uppercase">Reputation Trend</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                    {hasData ? "30-Day performance analysis" : "Awaiting database synchronization"}
                </CardDescription>
            </CardHeader>
            <CardContent className="h-full pb-14 relative">
                {!hasData && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center space-y-3 bg-background/5 backdrop-blur-[1px]">
                        <div className="p-4 rounded-full bg-primary/5 animate-pulse">
                            <Database className="h-8 w-8 text-primary/20" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30">No active signal detected</p>
                    </div>
                )}

                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={hasData ? data : Array.from({ length: 30 }, (_, i) => ({ day: i, score: 0 }))} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="oklch(0.7 0.1 240)" stopOpacity={0.05} />
                                <stop offset="95%" stopColor="oklch(0.7 0.1 240)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'rgba(255,255,255,0.1)', fontSize: 9 }}
                            interval={4}
                        />
                        <YAxis
                            domain={[0, 5]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'rgba(255,255,255,0.1)', fontSize: 9 }}
                        />
                        {hasData && (
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(0,0,0,0.8)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    fontSize: '10px',
                                    color: '#fff'
                                }}
                            />
                        )}
                        <Area
                            type="monotone"
                            dataKey="score"
                            stroke="oklch(0.7 0.1 240 / 30%)"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorScore)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
