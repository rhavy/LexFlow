"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    User,
    Shield,
    Bell,
    Globe,
    CreditCard,
    Save,
    Camera,
    Mail,
    Lock,
    Zap
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

export default function ConfiguracoesPage() {
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 1500); // Simulação de salvamento
    };

    return (
        // <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-slate-50/50 min-h-screen">
            {/* Cabeçalho */}
            <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Configurações</h1>
                <p className="text-slate-500 font-medium">Gerencie sua conta e preferências do sistema.</p>
            </div>

            <Tabs defaultValue="perfil" className="space-y-6">
                <TabsList className="bg-white border p-1 rounded-2xl h-14 shadow-sm">
                    <TabsTrigger value="perfil" className="rounded-xl px-6 font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                        <User className="w-4 h-4 mr-2" /> Perfil
                    </TabsTrigger>
                    <TabsTrigger value="seguranca" className="rounded-xl px-6 font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                        <Shield className="w-4 h-4 mr-2" /> Segurança
                    </TabsTrigger>
                    <TabsTrigger value="notificacoes" className="rounded-xl px-6 font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                        <Bell className="w-4 h-4 mr-2" /> Notificações
                    </TabsTrigger>
                    <TabsTrigger value="plano" className="rounded-xl px-6 font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                        <Zap className="w-4 h-4 mr-2" /> Plano
                    </TabsTrigger>
                </TabsList>

                {/* ABA PERFIL */}
                <TabsContent value="perfil">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden">
                            <CardHeader className="bg-slate-950 text-white p-10">
                                <div className="flex flex-col md:flex-row items-center gap-6">
                                    <div className="relative group">
                                        <div className="w-24 h-24 rounded-3xl bg-blue-600 flex items-center justify-center text-3xl font-black shadow-lg">
                                            LX
                                        </div>
                                        <button className="absolute -bottom-2 -right-2 bg-white text-slate-900 p-2 rounded-xl shadow-lg hover:bg-slate-100 transition-all">
                                            <Camera size={16} />
                                        </button>
                                    </div>
                                    <div className="text-center md:text-left">
                                        <CardTitle className="text-2xl font-black uppercase">Informações Pessoais</CardTitle>
                                        <CardDescription className="text-slate-400">Atualize seus dados de contato e foto de perfil.</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-10 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase font-black text-slate-400 ml-1">Nome Completo</Label>
                                        <Input defaultValue="Usuário LexFlow" className="rounded-xl bg-slate-50 border-none h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase font-black text-slate-400 ml-1">E-mail Profissional</Label>
                                        <Input defaultValue="contato@lexflow.com.br" className="rounded-xl bg-slate-50 border-none h-12" />
                                    </div>
                                    <div className="space-y-2 col-span-full">
                                        <Label className="text-[10px] uppercase font-black text-slate-400 ml-1">Bio / Descrição Profissional</Label>
                                        <Textarea placeholder="Conte um pouco sobre sua atuação jurídica..." className="rounded-2xl bg-slate-50 border-none min-h-[100px]" />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700 rounded-xl px-8 h-12 font-bold uppercase tracking-widest text-xs">
                                        {loading ? "Salvando..." : <><Save className="mr-2 h-4 w-4" /> Salvar Alterações</>}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </TabsContent>

                {/* ABA SEGURANÇA */}
                <TabsContent value="seguranca">
                    <Card className="border-none shadow-xl rounded-[2.5rem]">
                        <CardHeader className="p-10">
                            <CardTitle className="text-2xl font-black uppercase flex items-center gap-3">
                                <Lock className="text-blue-600" /> Segurança da Conta
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-10 pt-0 space-y-8">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <div className="space-y-1">
                                        <p className="font-bold text-slate-900">Autenticação de Dois Fatores (2FA)</p>
                                        <p className="text-sm text-slate-500">Adicione uma camada extra de proteção ao seu login.</p>
                                    </div>
                                    <Switch />
                                </div>
                                <Separator />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase font-black text-slate-400 ml-1">Senha Atual</Label>
                                        <Input type="password" placeholder="••••••••" className="rounded-xl h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase font-black text-slate-400 ml-1">Nova Senha</Label>
                                        <Input type="password" placeholder="••••••••" className="rounded-xl h-12" />
                                    </div>
                                </div>
                            </div>
                            <Button variant="outline" className="rounded-xl font-bold uppercase text-xs h-12 w-full md:w-auto px-8 border-blue-200 text-blue-700 hover:bg-blue-50">
                                Atualizar Senha
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ABA PLANO */}
                <TabsContent value="plano">
                    <Card className="border-none shadow-xl rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-blue-800 text-white">
                        <CardContent className="p-10 flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="space-y-2 text-center md:text-left">
                                <Badge className="bg-white/20 text-white border-none mb-2">PLANO ATUAL</Badge>
                                <h3 className="text-4xl font-black uppercase tracking-tighter">LexFlow Professional</h3>
                                <p className="text-blue-100 font-medium">Sua assinatura renova em 15 de Fevereiro de 2026.</p>
                            </div>
                            <div className="flex flex-col gap-3 w-full md:w-auto">
                                <Button className="bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-black h-14 px-8 uppercase text-xs shadow-xl">
                                    Fazer Upgrade
                                </Button>
                                <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl font-bold text-xs uppercase">
                                    Gerenciar Assinatura
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}