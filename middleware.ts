import { NextResponse, type NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
    // 1. Chamada direta para o endpoint de sessão do Better Auth
    const response = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
        headers: {
            // Repassa os cookies da requisição original para validação
            cookie: request.headers.get("cookie") || "",
        },
    });

    const session = await response.json();

    const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
    const isLoginPage = request.nextUrl.pathname === "/login";
    const isRegisterPage = request.nextUrl.pathname === "/register";

    // 2. Se não houver sessão e tentar acessar o Dashboard
    if (isDashboard && !session) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // 3. Se houver sessão e tentar acessar Login ou Register
    if (session && (isLoginPage || isRegisterPage)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/register"],
};