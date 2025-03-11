import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AppConfig } from './utils/AppConfig';

const intlMiddleware = createMiddleware({
  locales: AppConfig.locales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
});

const protectedRoutes = ['/products', '/profile', '/admin'];

const isAuthenticated = (req: NextRequest) => {
  const accessToken = req.cookies.get('accessToken')?.value;
  return !!accessToken;
};

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const locale = AppConfig.locales.includes(pathname.split('/')[1] as string)
    ? pathname.split('/')[1]
    : AppConfig.defaultLocale;
  const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  if (isProtectedRoute && !isAuthenticated(req)) {
    const loginUrl = new URL(`/${locale}/sign-in`, req.url);
    return NextResponse.redirect(loginUrl);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};