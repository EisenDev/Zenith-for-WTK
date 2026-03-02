import { Client } from "pg";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    try {
        const { email, password } = await req.json();
        await client.connect();

        const result = await client.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            // In a real app, we'd set a cookie/session here
            return NextResponse.json({
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    department: user.department
                }
            });
        } else {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        await client.end();
    }
}
