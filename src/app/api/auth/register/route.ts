import { Client } from "pg";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    try {
        const { email, password, role, department } = await req.json();
        await client.connect();

        // Basic check if user exists
        const check = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (check.rows.length > 0) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        await client.query(
            'INSERT INTO users (id, email, password, role, department, "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())',
            [email, password, role, department]
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        await client.end();
    }
}
