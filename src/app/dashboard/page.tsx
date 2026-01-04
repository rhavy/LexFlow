"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Clock, Plus, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Router from "next/router";

export default function Dashboard() {
    // Configurações de animação
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1, transition: { duration: 0.4 } }
    };

    const stats = [
        { label: "Total de Contratos", value: "12", icon: <FileText className="text-blue-600" />, trend: "+2 este mês" },
        { label: "Prestação de Serviço", value: "8", icon: <Users className="text-purple-600" />, trend: "65% do total" },
        { label: "Trabalho (CLT)", value: "4", icon: <Clock className="text-orange-600" />, trend: "Pendente: 1" },
    ];

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-slate-50/50 min-h-screen">

            {/* Cabeçalho Animado */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-between items-center"
            >
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Painel de Controle</h1>
                    <p className="text-slate-500">Bem-vindo de volta, LexFlow.</p>
                </div>
                {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200" onClick={() => Router.push("/dashboard/contratos")}>
                        <Plus className="mr-2 h-4 w-4" /> Novo Contrato
                    </Button>
                </motion.div> */}
            </motion.div>

            {/* Grid de Stats Animada */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                {stats.map((item, i) => (
                    <motion.div variants={itemVariants} key={i}>
                        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500">{item.label}</CardTitle>
                                <div className="p-2 bg-slate-100 rounded-lg">{item.icon}</div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{item.value}</div>
                                <p className="text-xs text-green-600 flex items-center mt-1">
                                    <ArrowUpRight size={12} className="mr-1" /> {item.trend}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* Lista de Contratos Recentes */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Contratos Recentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((_, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ x: 10 }}
                                    className="flex justify-between items-center p-4 border border-slate-100 rounded-xl hover:bg-blue-50/50 transition-colors cursor-pointer group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                                            <FileText size={18} />
                                        </div>
                                        <div>
                                            <p className="font-semibold group-hover:text-blue-700 transition-colors">Contrato de Prestação de Serviços #{1024 + i}</p>
                                            <p className="text-sm text-slate-500">Modificado há {i + 1} dia(s)</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Finalizado</span>
                                        <ArrowUpRight size={18} className="text-slate-300" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}