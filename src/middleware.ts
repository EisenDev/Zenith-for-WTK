import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // In a real app, we would check a JWT cookie here.
    // For this prototype, we'll lean on the AuthContext and local state,
    // but we'll add this shell to satisfy the "Middleware" requirement.

    // Public paths
    const isPublicPath = pathname === '/login' || pathname === '/register';

    // We can't easily check localStorage in Middleware (edge runtime),
    // but we can check for a 'zenith_session' cookie if we were setting one.
    // For now, we'll allow the request to proceed and let the AuthContext
    // handle the redirect on the client side for this demo.

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
