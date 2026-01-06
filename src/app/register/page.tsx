"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async () => {
        // 1. Validações de Frontend
        if (!name || !email || !password) {
            setError("Por favor, preencha todos os campos.");
            return;
        }
        if (password.length < 8) {
            setError("A senha deve conter pelo menos 8 caracteres.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // 2. Usando o authClient padrão do Better Auth
            const { error: authError } = await authClient.signUp.email({
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password: password,
                callbackURL: "/login", // Redireciona para login após sucesso ou dashboard
            }, {
                onRequest: () => setLoading(true),
                onSuccess: () => {
                    // O Better Auth pode logar automaticamente dependendo da config,
                    // mas aqui redirecionamos para login por segurança ou dashboard.
                    router.push("/login");
                },
                onError: (ctx) => {
                    setLoading(false);
                    setError(ctx.error.message || "Erro ao criar conta.");
                }
            });

            if (authError) {
                setError(authError.message || "Erro ao registrar usuário.");
                setLoading(false);
            }

        } catch (err) {
            setError("Não foi possível conectar ao servidor.");
            setLoading(false);
            console.error("Register Error:", err);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-slate-50">
            <Card className="w-full max-w-md border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
                <CardHeader className="bg-slate-950 text-white p-10 text-center">
                    <CardTitle className="text-3xl font-black uppercase tracking-tight">LexFlow</CardTitle>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Crie sua conta</p>
                </CardHeader>
                <CardContent className="p-10 space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in zoom-in">
                            <AlertCircle size={14} />
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black text-slate-400 ml-1">Nome</label>
                        <Input
                            type="text"
                            placeholder="Seu nome completo"
                            className="rounded-xl h-12 focus-visible:ring-blue-600"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black text-slate-400 ml-1">E-mail</label>
                        <Input
                            type="email"
                            placeholder="seu@email.com"
                            className="rounded-xl h-12 focus-visible:ring-blue-600"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black text-slate-400 ml-1">Senha</label>
                        <Input
                            type="password"
                            placeholder="No mínimo 8 caracteres"
                            className="rounded-xl h-12 focus-visible:ring-blue-600"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                        />
                    </div>

                    <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 h-12 rounded-xl font-bold uppercase text-xs tracking-widest shadow-lg shadow-blue-500/20 transition-all active:scale-95 mt-2"
                        onClick={handleRegister}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Cadastrar"}
                    </Button>

                    <p className="mt-4 text-center text-sm text-gray-500">
                        Já tem uma conta?{" "}
                        <Link href="/login" className="font-bold text-blue-600 hover:underline">
                            Faça login
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}