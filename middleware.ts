import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    console.log(`[Middleware] Checking path: ${path}`);

    // Check for session cookie
    const session = request.cookies.get('JSESSIONID');
    console.log(`[Middleware] Session ID: ${session?.value}`);

    // If we are at the root path '/' and have no session, redirect to login
    if (path === '/' && !session) {
        console.log('[Middleware] Redirecting to /login');
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/'],
}
