"use client";

import * as React from "react";
import { Sparkles, Send, RefreshCw, X } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AIReplyPanelProps {
    review: any | null;
    onClose: () => void;
}

export function AIReplyPanel({ review, onClose }: AIReplyPanelProps) {
    const [tone, setTone] = React.useState("professional");
    const [draft, setDraft] = React.useState("");
    const [isGenerating, setIsGenerating] = React.useState(false);

    const generateDraft = async () => {
        if (!review) return;
        setIsGenerating(true);
        setDraft("");

        try {
            const response = await fetch("/api/ai-reply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ review, tone }),
            });

            const data = await response.json();
            if (data.text) {
                setDraft(data.text);
            } else {
                throw new Error(data.error || "Failed to generate draft");
            }
        } catch (error) {
            console.error(error);
            setDraft("Error generating draft. Please check your Gemini API key.");
        } finally {
            setIsGenerating(false);
        }
    };

    React.useEffect(() => {
        if (review) {
            generateDraft();
        }
    }, [review]);

    React.useEffect(() => {
        if (review) {
            generateDraft();
        }
    }, [tone]);

    return (
        <Sheet open={!!review} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="sm:max-w-md glass backdrop-blur-2xl border-l border-white/10 p-0 overflow-hidden flex flex-col">
                <SheetHeader className="p-6 border-b border-white/5 bg-white/5">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-xl font-bold flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            AI Draft Generator
                        </SheetTitle>
                    </div>
                    <SheetDescription className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Drafting response for {review?.guestName}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-auto p-6 space-y-6">
                    <div className="space-y-3">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Original Review</h3>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 italic text-sm text-foreground/90">
                            "{review?.comment}"
                            <div className="mt-3 flex items-center gap-2">
                                <Badge variant="outline" className="text-[10px] bg-white/5 border-none">{review?.source}</Badge>
                                <div className="flex gap-0.5 ml-auto">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <span key={i} className={`text-xs ${i < review?.rating ? 'text-amber-400' : 'text-white/10'}`}>★</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Select Tone</h3>
                            <Tabs value={tone} onValueChange={setTone} className="w-auto">
                                <TabsList className="glass bg-white/5 p-1 h-9">
                                    <TabsTrigger value="professional" className="text-[10px] h-7 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Professional</TabsTrigger>
                                    <TabsTrigger value="casual" className="text-[10px] h-7 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Casual</TabsTrigger>
                                    <TabsTrigger value="apologetic" className="text-[10px] h-7 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Apologetic</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        <div className="relative">
                            {isGenerating && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 rounded-xl backdrop-blur-[2px]">
                                    <RefreshCw className="h-6 w-6 text-primary animate-spin" />
                                </div>
                            )}
                            <textarea
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                placeholder="AI is drafting..."
                                className="w-full h-48 p-4 glass border-none rounded-xl text-sm focus:ring-1 focus:ring-primary/50 resize-none font-medium text-foreground/90"
                            />
                        </div>
                    </div>
                </div>

                <SheetFooter className="p-6 border-t border-white/5 mt-auto bg-white/5">
                    <div className="flex w-full gap-3">
                        <Button variant="outline" className="flex-1 glass border-none hover:bg-white/10" onClick={() => generateDraft()}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Regenerate
                        </Button>
                        <Button className="flex-1 bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                            <Send className="mr-2 h-4 w-4" />
                            Send Reply
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
