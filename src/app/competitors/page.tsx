"use client";

import * as React from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell,
    ScatterChart, Scatter, ZAxis,
    ResponsiveContainer as ChartContainer
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, Users, Target, BarChart3, PieChart as PieIcon, Crosshair } from "lucide-react";

const COLORS = ["oklch(0.7 0.1 240)", "oklch(0.8 0.12 180)", "oklch(0.6 0.1 220)", "oklch(0.9 0.1 100)"];

export default function CompetitorsPage() {
    const [data, setData] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/competitors");
                const json = await res.json();
                setData(json);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    if (isLoading) return <div className="p-8 animate-pulse text-muted-foreground uppercase text-[10px] font-black tracking-widest">Intercepting Market Signals...</div>;

    const barData = [
        {
            name: "Cleanliness",
            ZENITH: 4.6,
            Hilton: 4.8,
            Marriott: 4.5,
            "Four Seasons": 4.9,
        },
        {
            name: "Value",
            ZENITH: 4.4,
            Hilton: 4.2,
            Marriott: 4.0,
            "Four Seasons": 3.8,
        },
        {
            name: "Service",
            ZENITH: 4.5,
            Hilton: 4.7,
            Marriott: 4.4,
            "Four Seasons": 4.9,
        },
        {
            name: "Location",
            ZENITH: 4.8,
            Hilton: 4.9,
            Marriott: 4.7,
            "Four Seasons": 4.9,
        },
    ];

    const pieData = data.competitors.map((c: any) => ({
        name: c.name,
        value: c.reviewCount
    })).concat([{ name: "ZENITH", value: 1000 }]);

    const scatterData = data.competitors.map((c: any) => ({
        name: c.name,
        price: c.avgPrice,
        sentiment: c.sentiment,
        size: Math.sqrt(c.reviewCount) * 2
    })).concat([{ name: "ZENITH", price: 650, sentiment: 3.8, size: 30 }]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex flex-col gap-2">
                <h1 className="text-5xl font-black tracking-tighter font-poppins bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/50">
                    Market Intelligence
                </h1>
                <p className="text-muted-foreground/60 text-[10px] font-black uppercase tracking-[0.3em]">
                    Competitive Displacement Strategy: <span className="text-primary/60">Active Analysis</span>
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Metric Comparison Bars */}
                <Card className="glass border-none overflow-hidden h-[450px]">
                    <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <BarChart3 className="h-4 w-4 text-primary" />
                            </div>
                            <CardTitle className="text-lg font-bold font-poppins uppercase tracking-tight">Metric Benchmarking</CardTitle>
                        </div>
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-40">Direct feature comparison against primary rivals</CardDescription>
                    </CardHeader>
                    <CardContent className="h-full pb-20">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} />
                                <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                    contentStyle={{ backgroundColor: 'black', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px', opacity: 0.6 }} />
                                <Bar dataKey="ZENITH" fill="oklch(0.7 0.1 240)" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="Hilton" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="Marriott" fill="rgba(255,255,255,0.05)" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Market Share Pie */}
                <Card className="glass border-none overflow-hidden h-[450px]">
                    <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 rounded-lg bg-emerald-400/10">
                                <PieIcon className="h-4 w-4 text-emerald-400" />
                            </div>
                            <CardTitle className="text-lg font-bold font-poppins uppercase tracking-tight">Market Voice Share</CardTitle>
                        </div>
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-40">Distribution of review volume in current sector</CardDescription>
                    </CardHeader>
                    <CardContent className="h-full pb-20">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.name === "ZENITH" ? "oklch(0.7 0.1 240)" : COLORS[index % COLORS.length]} opacity={entry.name === "ZENITH" ? 1 : 0.2} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'black', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }} />
                                <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" wrapperStyle={{ fontSize: '10px', opacity: 0.6 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Billion Dollar Scatter Plot */}
            <Card className="glass border-none overflow-hidden h-[500px]">
                <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 rounded-lg bg-amber-400/10">
                            <Crosshair className="h-4 w-4 text-amber-400" />
                        </div>
                        <CardTitle className="text-lg font-bold font-poppins uppercase tracking-tight text-amber-100">Billion Dollar View: Price vs. Sentiment</CardTitle>
                    </div>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-40">Identifying over/underpricing corridors based on guest happiness</CardDescription>
                </CardHeader>
                <CardContent className="h-full pb-24">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                            <XAxis
                                type="number"
                                dataKey="price"
                                name="Price"
                                unit="$"
                                label={{ value: 'Avg Daily Rate ($)', position: 'insideBottom', offset: -10, fontSize: 10, fill: 'rgba(255,255,255,0.3)' }}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }}
                            />
                            <YAxis
                                type="number"
                                dataKey="sentiment"
                                name="Sentiment"
                                domain={[3, 5]}
                                label={{ value: 'Sentiment Score', angle: -90, position: 'insideLeft', fontSize: 10, fill: 'rgba(255,255,255,0.3)' }}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }}
                            />
                            <ZAxis type="number" dataKey="size" range={[50, 400]} />
                            <Tooltip
                                cursor={{ strokeDasharray: '3 3' }}
                                contentStyle={{ backgroundColor: 'black', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                            />
                            <Scatter name="Market Rivals" data={scatterData.filter((d: any) => d.name !== "ZENITH")} fill="rgba(255,255,255,0.1)" opacity={0.4} />
                            <Scatter name="ZENITH" data={scatterData.filter((d: any) => d.name === "ZENITH")} fill="oklch(0.7 0.1 240)" />
                        </ScatterChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
