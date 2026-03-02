"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    Bot, ShieldCheck, Tag, Key, Save, AlertCircle, Sparkles, MessageSquare
} from "lucide-react";

export default function SettingsPage() {
    const [settings, setSettings] = React.useState<any>(null);
    const [newKeyword, setNewKeyword] = React.useState("");
    const [isSaving, setIsSaving] = React.useState(false);

    React.useEffect(() => {
        async function fetchSettings() {
            const res = await fetch("/api/settings");
            const json = await res.json();
            setSettings(json);
        }
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        await fetch("/api/settings", {
            method: "POST",
            body: JSON.stringify(settings),
        });
        setIsSaving(false);
    };

    if (!settings) return <div className="p-8 animate-pulse text-muted-foreground uppercase text-[10px] font-black tracking-widest">Accessing AI Core...</div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-5xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-5xl font-black tracking-tighter font-poppins bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/50">
                    AI Architecture
                </h1>
                <p className="text-muted-foreground/60 text-[10px] font-black uppercase tracking-[0.3em]">
                    Neural Deployment Parameters: <span className="text-primary/60">Configured</span>
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Persona Selection */}
                <Card className="glass border-none">
                    <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="h-4 w-4 text-primary" />
                            <CardTitle className="text-sm font-bold font-poppins uppercase tracking-wider">Response Persona</CardTitle>
                        </div>
                        <CardDescription className="text-[10px] font-medium opacity-50 uppercase tracking-widest">
                            Set the stylistic alignment of AI-generated communications
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Select
                            value={settings.persona}
                            onValueChange={(v) => setSettings({ ...settings, persona: v })}
                        >
                            <SelectTrigger className="bg-white/5 border-none h-12 text-xs font-medium">
                                <SelectValue placeholder="Select persona" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-white/10">
                                <SelectItem value="Luxurious">Luxurious & Elegant</SelectItem>
                                <SelectItem value="Formal">Formal & Professional</SelectItem>
                                <SelectItem value="Friendly">Friendly & Enthusiastic</SelectItem>
                                <SelectItem value="Concise">Concise & Direct</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-[9px] text-muted-foreground/40 italic font-medium">
                            * Persona affects vocabulary, cadence, and empathy levels in replies.
                        </p>
                    </CardContent>
                </Card>

                {/* Auto-Pilot */}
                <Card className="glass border-none">
                    <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                            <ShieldCheck className="h-4 w-4 text-emerald-400" />
                            <CardTitle className="text-sm font-bold font-poppins uppercase tracking-wider">Auto-Pilot Baseline</CardTitle>
                        </div>
                        <CardDescription className="text-[10px] font-medium opacity-50 uppercase tracking-widest">
                            Automated approval threshold for positive guest signals
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-10 py-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black tracking-widest text-muted-foreground/40 uppercase">Confidence Level</span>
                                <span className="text-2xl font-black font-poppins text-emerald-400">{settings.autoPilotThreshold}★</span>
                            </div>
                            <Slider
                                value={[settings.autoPilotThreshold]}
                                min={1}
                                max={5}
                                step={0.1}
                                onValueChange={([v]) => setSettings({ ...settings, autoPilotThreshold: v })}
                                className="py-4"
                            />
                        </div>
                        <div className="p-4 rounded-xl bg-emerald-400/5 border border-emerald-400/10 flex items-start gap-3">
                            <AlertCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                            <p className="text-[10px] font-medium text-emerald-400/60 leading-relaxed">
                                Replying automated to reviews above {settings.autoPilotThreshold} stars. Critical/Negative sentiment will always require human verification.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Keyword Watchlist */}
                <Card className="glass border-none md:col-span-2">
                    <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                            <Tag className="h-4 w-4 text-rose-400" />
                            <CardTitle className="text-sm font-bold font-poppins uppercase tracking-wider">Operational Watchlist</CardTitle>
                        </div>
                        <CardDescription className="text-[10px] font-medium opacity-50 uppercase tracking-widest">
                            Critical markers that bypass automation and trigger executive alerts
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Enter operational marker (e.g. 'Safety Issue')"
                                className="bg-white/5 border-none h-12 text-xs"
                                value={newKeyword}
                                onChange={(e) => setNewKeyword(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && newKeyword) {
                                        setSettings({ ...settings, keywords: [...settings.keywords, newKeyword] });
                                        setNewKeyword("");
                                    }
                                }}
                            />
                            <Button
                                variant="outline"
                                className="h-12 border-white/10 bg-white/5 hover:bg-white/10"
                                onClick={() => {
                                    if (newKeyword) {
                                        setSettings({ ...settings, keywords: [...settings.keywords, newKeyword] });
                                        setNewKeyword("");
                                    }
                                }}
                            >
                                Add
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {(settings.keywords || []).map((word: string) => (
                                <Badge key={word} variant="secondary" className="bg-rose-400/10 text-rose-400 border-none py-1.5 px-3 text-[10px] font-bold uppercase tracking-widest">
                                    {word}
                                    <button
                                        className="ml-2 hover:text-white"
                                        onClick={() => setSettings({ ...settings, keywords: settings.keywords.filter((k: any) => k !== word) })}
                                    >
                                        ×
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* API Keys */}
                <Card className="glass border-none md:col-span-2">
                    <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                            <Key className="h-4 w-4 text-blue-400" />
                            <CardTitle className="text-sm font-bold font-poppins uppercase tracking-wider">Access Tokens & Keys</CardTitle>
                        </div>
                        <CardDescription className="text-[10px] font-medium opacity-50 uppercase tracking-widest">
                            Securely bridge your dashboard to global AI foundations
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 ml-1">Gemini Pro API Key</label>
                                <Input
                                    type="password"
                                    value={settings.geminiKey || ""}
                                    onChange={(e) => setSettings({ ...settings, geminiKey: e.target.value })}
                                    className="bg-white/5 border-none h-12 text-xs font-mono"
                                    placeholder="AIza..."
                                />
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 text-[10px] font-black uppercase tracking-[0.2em]"
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {isSaving ? "Synchronizing..." : "Finalize Parameters"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
