"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserPlus, User, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);
    const [formData, setFormData] = React.useState({
        email: "",
        password: "",
        role: "dept_user",
        department: ""
    });

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (data.success) {
                router.push("/login");
            } else {
                alert(data.error || "Registration Failed");
            }
        } catch (err) {
            alert("Network Error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 font-poppins relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] animate-pulse" />

            <div className="w-full max-w-[450px] space-y-8 relative z-10">
                <div className="flex flex-col items-center gap-4 mb-4">
                    <div className="h-12 w-12 overflow-hidden rounded-xl bg-white/5 p-2 border border-white/10 backdrop-blur-xl">
                        <img src="/branding/logo.png" alt="ZENITH Logo" className="h-full w-full object-cover" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-black tracking-tighter text-white uppercase">ENLISTMENT</h1>
                        <p className="text-[10px] font-black tracking-[0.4em] text-muted-foreground/40 uppercase">Request Clearance</p>
                    </div>
                </div>

                <Card className="glass border-white/5 bg-white/[0.02] backdrop-blur-2xl shadow-2xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-lg font-bold tracking-tight text-white uppercase">Operational Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-4">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/40" />
                                    <Input
                                        type="email"
                                        placeholder="Operational Email"
                                        className="bg-white/5 border-none h-12 pl-10 text-xs text-white"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/40" />
                                    <Input
                                        type="password"
                                        placeholder="Secure Access Key"
                                        className="bg-white/5 border-none h-12 pl-10 text-xs text-white"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Select
                                        value={formData.role}
                                        onValueChange={(v) => setFormData({ ...formData, role: v })}
                                    >
                                        <SelectTrigger className="bg-white/5 border-none h-12 text-xs text-white font-medium">
                                            <SelectValue placeholder="Role" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-white/10">
                                            <SelectItem value="admin">Sovereign Admin</SelectItem>
                                            <SelectItem value="dept_user">Department Staff</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {formData.role === "dept_user" && (
                                        <Input
                                            placeholder="Department (e.g. Spa)"
                                            className="bg-white/5 border-none h-12 text-xs text-white"
                                            value={formData.department}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                            required={formData.role === "dept_user"}
                                        />
                                    )}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-white hover:bg-white/90 text-black h-12 text-[10px] font-black uppercase tracking-[0.2em] group mt-6"
                            >
                                {isLoading ? "PROVISIONING..." : "INITIALIZE PROTOCOL"}
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-[10px] text-muted-foreground/20 uppercase font-medium tracking-widest">
                    Already cleared? <Link href="/login" className="text-white hover:opacity-80 transition-opacity">Return to Command</Link>
                </p>
            </div>
        </div>
    );
}
