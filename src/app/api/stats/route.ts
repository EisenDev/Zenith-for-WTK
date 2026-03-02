import { Client } from "pg";
import { NextResponse } from "next/server";

export async function GET() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();

        // Aggregated Reputation Score (Average Rating)
        const scoreRes = await client.query('SELECT AVG(rating) as avg_score FROM reviews');
        const avgScore = parseFloat(scoreRes.rows[0].avg_score || 0).toFixed(1);

        // Total Sentiment Counts
        const sentimentRes = await client.query('SELECT "sentimentTag", COUNT(*) as count FROM reviews GROUP BY "sentimentTag"');
        const positiveCount = sentimentRes.rows.find(r => r.sentimentTag === 'Positive')?.count || 0;
        const negativeCount = sentimentRes.rows.find(r => r.sentimentTag === 'Negative')?.count || 0;
        const totalReviews = parseInt(positiveCount) + parseInt(negativeCount);
        const positiveRate = totalReviews > 0 ? Math.round((positiveCount / totalReviews) * 100) : 0;
        const negativeRate = totalReviews > 0 ? Math.round((negativeCount / totalReviews) * 100) : 0;

        // Revenue Opportunity (Mock logic based on negative reviews)
        const revenueOpportunity = (negativeCount * 125).toLocaleString();

        // 30-Day Trend Data
        const trendRes = await client.query(`
      SELECT 
        TO_CHAR("createdAt", 'MM-DD') as day, 
        AVG(rating) as score 
      FROM reviews 
      WHERE "createdAt" > NOW() - INTERVAL '30 days'
      GROUP BY day 
      ORDER BY day ASC
    `);

        return NextResponse.json({
            metrics: {
                score: avgScore,
                positivePercent: positiveRate + "%",
                positiveCount: positiveCount + " positive reviews",
                negativePercent: negativeRate + "%",
                negativeCount: negativeCount + " reviews flagged",
                revenue: "$" + revenueOpportunity
            },
            trend: trendRes.rows.map(r => ({
                day: r.day,
                score: parseFloat(r.score).toFixed(1)
            }))
        });
    } catch (error: any) {
        console.error("Stats Fetch Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        await client.end();
    }
}
