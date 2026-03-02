import { Client } from "pg";
import { NextResponse } from "next/server";

export async function GET() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();

        // Fetch all competitors
        const result = await client.query('SELECT * FROM "HotelCompetitor" ORDER BY sentiment DESC');

        // Fetch self metrics for comparison (ZENITH Grand Resort)
        const selfRes = await client.query('SELECT AVG(rating) as avg_score FROM reviews');
        const selfScore = parseFloat(selfRes.rows[0].avg_score || 0);

        return NextResponse.json({
            competitors: result.rows,
            self: {
                name: "ZENITH",
                score: selfScore,
                cleanliness: 4.6, // Mocking these components for self as they aren't in the reviews table directly yet
                value: 4.4,
                service: 4.5,
                location: 4.8
            }
        });
    } catch (error: any) {
        console.error("Competitors Fetch Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        await client.end();
    }
}
