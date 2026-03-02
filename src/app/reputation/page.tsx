import { IntelligenceFeed } from "@/components/intelligence-feed";

export default function ReputationPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight font-outfit">Intelligence Feed</h1>
                    <p className="text-muted-foreground text-sm font-medium">Real-time sentiment monitoring across 1,000+ guest touchpoints.</p>
                </div>
            </div>

            <IntelligenceFeed />
        </div>
    );
}
