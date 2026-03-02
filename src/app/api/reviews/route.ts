import { Client } from "pg";
import { NextResponse } from "next/server";

export async function GET() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();
        const result = await client.query('SELECT * FROM reviews ORDER BY "createdAt" DESC');
        return NextResponse.json(result.rows);
    } catch (error: any) {
        console.error("Direct PG Fetch Error:", error);
        return NextResponse.json({
            error: "Failed to fetch reviews",
            details: error.message
        }, { status: 500 });
    } finally {
        await client.end();
    }
}
