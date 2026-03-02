"use client";

import * as React from "react";
import { KPICards } from "@/components/kpi-cards";
import { ReputationTrendChart } from "@/components/reputation-chart";
import { Button } from "@/components/ui/button";
import { Plus, Download, Sparkles } from "lucide-react";

export default function DashboardHome() {
  const [stats, setStats] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  const readiness = stats ? "Operational" : "Offline";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-5xl font-black tracking-tighter font-poppins bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/50">
            Sovereign Overview
          </h1>
          <p className="text-muted-foreground/60 text-xs font-bold uppercase tracking-[0.2em]">
            Operational Readiness: <span className={`${stats ? "text-emerald-400/60" : "text-rose-400/60 animate-pulse"}`}>
              {readiness}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="glass bg-white/5 border-none hover:bg-white/10 h-11 px-5 text-[10px] font-black uppercase tracking-widest">
            <Download className="mr-2 h-4 w-4" />
            Export Archive
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 px-6 shadow-2xl shadow-primary/40 text-[10px] font-black uppercase tracking-widest">
            <Plus className="mr-2 h-4 w-4" />
            Initialize Fleet
          </Button>
        </div>
      </div>

      <KPICards metrics={stats?.metrics} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ReputationTrendChart data={stats?.trend} />
        </div>
        <div className="glass rounded-2xl p-8 border-none flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 transition-transform duration-500 group-hover:scale-125">
            <Sparkles size={120} />
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl font-black tracking-tight mb-2 font-outfit uppercase">AI Synthesis</h2>
            <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.3em] mb-10">
              {stats ? "Neural Engine Active" : "Neural insights queue empty"}
            </p>

            <div className="space-y-6">
              {[
                { title: "Sentiment Shift", desc: "Positive mentions of 'breakfast' are up 12%.", type: "pos" },
                { title: "Service Alert", desc: "Multiple mentions of 'slow elevators' on Floor 4.", type: "neg" },
                { title: "Loyalty Boost", desc: "Frequent travelers requesting 'smart check-in'.", type: "neu" },
              ].map((insight, i) => (
                <div key={i} className="group/item">
                  <div className="h-1 w-full bg-white/5 rounded-full mb-3 overflow-hidden">
                    <div className={`h-full bg-primary/20 transition-all duration-700 ${stats ? "w-full" : "w-0 group-hover/item:w-full"}`} />
                  </div>
                  <div className={`flex items-center justify-between transition-opacity ${stats ? "opacity-100" : "opacity-20 group-hover/item:opacity-40"}`}>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{insight.title}</span>
                  </div>
                  <p className={`text-[10px] text-foreground/60 mt-2 font-medium transition-opacity ${stats ? "opacity-100" : "opacity-5"}`}>
                    {insight.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-[9px] font-bold text-muted-foreground/30 italic uppercase tracking-widest">
              {stats ? "Baseline analysis synchronized" : "Execute database baseline to begin analysis"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
