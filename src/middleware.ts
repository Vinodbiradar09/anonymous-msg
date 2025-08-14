import { NextRequest , NextResponse } from "next/server";
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*'], // these are matchers where the actual middleware should run
};

export async function middleware(request : NextRequest){
    const token = await getToken({req : request});
    const url = request.nextUrl;

    if ( // if the token is available and your pathname starts with these routes then redirect to /dashboard page
    token &&
    (url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify') ||
      url.pathname === '/')
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  if(!token && url.pathname.startsWith('/dashboard')){
    return NextResponse.redirect(new URL('/sign-in' , request.url));
  }

  return NextResponse.next();
}