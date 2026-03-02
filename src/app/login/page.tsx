"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, User, Lock, ArrowRight, Zap } from "lucide-react";

import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);
    const [credentials, setCredentials] = React.useState({
        email: "",
        password: ""
    });

    const fastTrackAdmin = () => {
        setCredentials({ email: "admin@zenith.me", password: "password123" });
    };

    const fastTrackDept = () => {
        setCredentials({ email: "staff@zenith.me", password: "password123" });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                body: JSON.stringify(credentials),
            });
            const data = await res.json();

            if (data.success) {
                login(data.user);
            } else {
                alert(data.error || "Access Denied");
            }
        } catch (err) {
            alert("Network Error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 font-poppins relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] animate-pulse delay-700" />

            <div className="w-full max-w-[400px] space-y-8 relative z-10">
                <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="h-16 w-16 overflow-hidden rounded-2xl bg-white/5 p-3 border border-white/10 backdrop-blur-xl">
                        <img src="/branding/logo.png" alt="ZENITH Logo" className="h-full w-full object-cover" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-3xl font-black tracking-tighter text-white uppercase">ZENITH</h1>
                        <p className="text-[10px] font-black tracking-[0.4em] text-muted-foreground/40 uppercase">Sovereign Intelligence</p>
                    </div>
                </div>

                <Card className="glass border-white/5 bg-white/[0.02] backdrop-blur-2xl shadow-2xl">
                    <CardHeader className="text-center space-y-1">
                        <CardTitle className="text-xl font-bold tracking-tight text-white">COMMAND ACCESS</CardTitle>
                        <CardDescription className="text-[10px] font-medium uppercase tracking-widest opacity-40">Identify yourself to enter the nexus</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/40" />
                                    <Input
                                        type="email"
                                        placeholder="Identification Email"
                                        className="bg-white/5 border-none h-11 pl-10 text-xs text-white placeholder:text-muted-foreground/20"
                                        value={credentials.email}
                                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/40" />
                                    <Input
                                        type="password"
                                        placeholder="Access Key"
                                        className="bg-white/5 border-none h-11 pl-10 text-xs text-white placeholder:text-muted-foreground/20"
                                        value={credentials.password}
                                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 text-[10px] font-black uppercase tracking-[0.2em] group"
                            >
                                {isLoading ? "AUTHORIZING..." : "ENTER NEXUS"}
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </form>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/5" />
                            </div>
                            <div className="relative flex justify-center text-[9px] uppercase font-black tracking-widest">
                                <span className="bg-[#050505] px-4 text-muted-foreground/30 font-poppins">Recruiter Fast-Track</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant="outline"
                                onClick={fastTrackAdmin}
                                className="border-white/5 bg-white/5 hover:bg-white/10 h-10 text-[9px] font-black uppercase tracking-widest text-primary/60"
                            >
                                <Shield className="mr-2 h-3 w-3" />
                                Admin
                            </Button>
                            <Button
                                variant="outline"
                                onClick={fastTrackDept}
                                className="border-white/5 bg-white/5 hover:bg-white/10 h-10 text-[9px] font-black uppercase tracking-widest text-blue-400/60"
                            >
                                <Zap className="mr-2 h-3 w-3" />
                                Dept User
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <p className="text-center text-[10px] text-muted-foreground/20 uppercase font-medium tracking-widest">
                    No clearance? <Link href="/register" className="text-primary/40 hover:text-primary transition-colors">Request Access</Link>
                </p>
            </div>
        </div>
    );
}
