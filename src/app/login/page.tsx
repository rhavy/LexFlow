"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        // 1. Validação básica de frontend
        if (!email || !password) {
            setError("Por favor, preencha todos os campos.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // 2. Usando o authClient padrão do Better Auth
            const { error: authError } = await authClient.signIn.email({
                email: email.trim(),
                password: password,
                callbackURL: "/dashboard",
            }, {
                onRequest: () => setLoading(true),
                onSuccess: () => {
                    router.push("/dashboard");
                    router.refresh();
                },
                onError: (ctx) => {
                    setLoading(false);
                    setError(ctx.error.message || "E-mail ou senha incorretos.");
                }
            });

            if (authError) {
                // O onError do better-auth já está tratando, mas por cautela:
                setError(authError.message || "Falha na autenticação.");
                setLoading(false);
            }

        } catch (err) {
            setError("Não foi possível conectar ao servidor. Verifique sua conexão.");
            setLoading(false);
            console.error("Login Error:", err);
        }
    };

    const handleGoogleLogin = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/dashboard",
        });
    };

    return (
        <div className="flex h-screen items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
                <CardHeader className="bg-slate-950 text-white p-10 text-center">
                    <CardTitle className="text-3xl font-black uppercase tracking-tight">LexFlow</CardTitle>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Acesse sua conta</p>
                </CardHeader>
                <CardContent className="p-10 space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold flex items-start gap-3 animate-in fade-in zoom-in duration-300 border border-red-100">
                            <AlertCircle size={18} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black text-slate-400 ml-1 tracking-wider">E-mail</label>
                        <Input
                            type="email"
                            placeholder="seu@email.com"
                            className="rounded-xl h-12 focus-visible:ring-blue-600 bg-slate-50 border-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black text-slate-400 ml-1 tracking-wider">Senha</label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            className="rounded-xl h-12 focus-visible:ring-blue-600 bg-slate-50 border-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        />
                    </div>

                    <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 h-12 rounded-xl font-bold uppercase text-xs tracking-widest shadow-lg shadow-blue-500/20 transition-all active:scale-95 mt-2"
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Entrar no Sistema"}
                    </Button>

                    <div className="mt-2 text-center text-sm">
                        <span className="text-slate-500 font-medium">Não tem uma conta? </span>
                        <Link href="/register" className="text-blue-600 font-bold hover:underline">
                            Cadastre-se aqui
                        </Link>
                    </div>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
                        <div className="relative flex justify-center text-[10px] uppercase font-black">
                            <span className="bg-white px-4 text-slate-400">Ou use sua conta</span>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        type="button"
                        className="w-full h-12 rounded-xl font-bold uppercase text-xs border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                    >
                        <svg className="mr-3 h-4 w-4" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Acessar com Google
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}