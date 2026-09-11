import { NextRequest, NextResponse } from "next/server";

const DEFAULT_LANGUAGE = "tm";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname === "/") {
        return NextResponse.redirect(
            new URL(`/${DEFAULT_LANGUAGE}`, request.url)
        );
    }
}

export const config = {
    matcher: "/",
};