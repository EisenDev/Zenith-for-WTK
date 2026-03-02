"use client";

import * as React from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
    Search,
    Filter,
    Star,
    Sparkles,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { AIReplyPanel } from "@/components/ai-reply-panel";
import { useAuth } from "@/lib/auth-context";
import { DollarSign } from "lucide-react";

export function IntelligenceFeed() {
    const { user } = useAuth();
    const [data, setData] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [selectedReview, setSelectedReview] = React.useState<any>(null);

    // Fetch data from local API
    React.useEffect(() => {
        async function fetchData() {
            if (!user) return;
            try {
                const response = await fetch("/api/reviews");
                let result = await response.json();

                if (Array.isArray(result)) {
                    // Filter by department for Staff
                    if (user.role !== "admin" && user.department) {
                        result = result.filter((r: any) => r.department === user.department);
                    }
                    setData(result);
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [user]);

    const columns = React.useMemo<ColumnDef<any>[]>(
        () => [
            {
                accessorKey: "guestName",
                header: "Guest",
                cell: ({ row }) => (
                    <div className="flex flex-col">
                        <span className="font-bold text-foreground">{row.getValue("guestName")}</span>
                        <span className="text-[10px] text-muted-foreground uppercase">
                            {new Date(row.original.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                ),
            },
            {
                accessorKey: "rating",
                header: "Rating",
                cell: ({ row }) => (
                    <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                className={`h-3 w-3 ${i < (row.getValue("rating") as number) ? "fill-amber-400 text-amber-400" : "text-muted/20"}`}
                            />
                        ))}
                    </div>
                ),
            },
            {
                accessorKey: "source",
                header: "Source",
                cell: ({ row }) => (
                    <Badge variant="outline" className="bg-white/5 border-none text-[10px] uppercase font-bold">
                        {row.getValue("source")}
                    </Badge>
                ),
            },
            {
                accessorKey: "comment",
                header: "Comment",
                cell: ({ row }) => (
                    <p className="max-w-[400px] truncate text-sm text-foreground/80 italic font-medium">
                        "{row.getValue("comment")}"
                    </p>
                ),
            },
            {
                accessorKey: "sentimentTag",
                header: "AI Sentiment",
                cell: ({ row }) => {
                    const sentiment = row.getValue("sentimentTag") as string;
                    return (
                        <Badge
                            className={`text-[10px] font-bold uppercase ${sentiment === "Positive" ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20" :
                                sentiment === "Negative" ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20" :
                                    "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                                } border-none`}
                        >
                            {sentiment}
                        </Badge>
                    );
                },
            },
            ...(user?.role === "admin" ? [{
                id: "revenue",
                header: "Revenue Opportunity",
                cell: ({ row }: any) => {
                    const rating = row.getValue("rating") as number;
                    const opportunity = (6 - rating) * 125.50; // Tactical projection
                    return (
                        <div className="flex items-center gap-1.5 text-primary font-bold">
                            <DollarSign className="h-3 w-3" />
                            <span className="text-xs">${opportunity.toLocaleString()}</span>
                        </div>
                    );
                }
            }] : []),
            {
                id: "actions",
                cell: ({ row }) => (
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2 text-primary hover:bg-primary/10 hover:text-primary transition-colors group"
                        onClick={() => setSelectedReview(row.original)}
                    >
                        <Sparkles className="mr-2 h-3.5 w-3.5 transition-transform group-hover:rotate-12" />
                        AI Draft
                    </Button>
                ),
            },
        ],
        [user]
    );

    const table = useReactTable({
        data,
        columns,
        state: { sorting, globalFilter },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    const { rows } = table.getRowModel();

    const tableContainerRef = React.useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => tableContainerRef.current,
        estimateSize: () => 64,
        overscan: 10,
    });

    if (isLoading) {
        return <div className="h-[600px] flex items-center justify-center glass rounded-xl">
            <p className="text-muted-foreground animate-pulse">Scanning Intelligence Feed...</p>
        </div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search reviews..."
                        value={globalFilter ?? ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="pl-9 glass border-none h-11 focus-visible:ring-primary/50"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="glass border-none h-11 px-4">
                        <Filter className="mr-2 h-4 w-4" />
                        Filters
                    </Button>
                </div>
            </div>

            <div
                ref={tableContainerRef}
                className="rounded-xl glass border-none relative h-[600px] overflow-auto scrollbar-hide"
            >
                {data.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                        <p>No data found in the Sovereign database.</p>
                        <p className="text-[10px] uppercase tracking-widest">Execute: npx prisma db push && npx prisma db seed</p>
                    </div>
                ) : (
                    <Table className="relative">
                        <TableHeader className="sticky top-0 z-20 glass-dark bg-sidebar/80 backdrop-blur-xl">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="hover:bg-transparent border-white/5 h-14">
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody
                            className="relative"
                            style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
                        >
                            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                                const row = rows[virtualRow.index];
                                return (
                                    <TableRow
                                        key={row.id}
                                        data-index={virtualRow.index}
                                        className="hover:bg-white/5 border-white/5 transition-colors absolute w-full"
                                        style={{
                                            height: `${virtualRow.size}px`,
                                            transform: `translateY(${virtualRow.start}px)`,
                                        }}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </div>

            <AIReplyPanel
                review={selectedReview}
                onClose={() => setSelectedReview(null)}
            />
        </div>
    );
}
