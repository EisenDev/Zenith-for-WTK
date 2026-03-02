import { Client } from "pg";
import { NextResponse } from "next/server";

export async function GET() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    try {
        await client.connect();
        const result = await client.query('SELECT * FROM "AISettings" WHERE id = \'default\'');
        return NextResponse.json(result.rows[0]);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        await client.end();
    }
}

export async function POST(req: Request) {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    try {
        const body = await req.json();
        await client.connect();

        const { persona, autoPilotThreshold, keywords, geminiKey } = body;

        await client.query(
            'UPDATE "AISettings" SET persona = $1, "autoPilotThreshold" = $2, keywords = $3, "geminiKey" = $4, "updatedAt" = NOW() WHERE id = \'default\'',
            [persona, autoPilotThreshold, keywords, geminiKey]
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        await client.end();
    }
}
