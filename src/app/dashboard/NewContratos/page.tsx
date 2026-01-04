"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, UseFormReturn, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus, Trash2, Edit3, Gavel, Save,
    FileText, Type, ListPlus, Banknote,
    Calendar, Clock, Rocket, Info, Printer, ChevronLeft, Eye, Sparkles
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// --- CONFIGURAÇÕES DE ANIMAÇÃO ---
const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, staggerChildren: 0.1, when: "beforeChildren" }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const clauseVariants = {
    hidden: { opacity: 0, scale: 0.95, x: -20 },
    visible: { opacity: 1, scale: 1, x: 0 },
    exit: { opacity: 0, scale: 0.95, x: 20, transition: { duration: 0.2 } }
};

// --- DICIONÁRIO DE CLÁUSULAS PADRÃO ---
const CLAUSULAS_PADRAO = [
    {
        titulo: "DA RESCISÃO",
        itens: [
            { texto: "O presente contrato poderá ser rescindido por qualquer uma das partes, mediante aviso prévio por escrito com antecedência mínima de 30 (trinta) dias." },
            { texto: "O descumprimento de qualquer cláusula deste instrumento ensejará a rescisão imediata, sujeitando a parte infratora à multa de 10% sobre o valor total." }
        ]
    },
    {
        titulo: "DO SIGILO E CONFIDENCIALIDADE",
        itens: [
            { texto: "As partes comprometem-se a manter sigilo absoluto sobre quaisquer informações, dados ou segredos de negócio da outra parte a que venham a ter acesso." }
        ]
    },
    {
        titulo: "DA PROPRIEDADE INTELECTUAL",
        itens: [
            { texto: "Todos os direitos de propriedade intelectual resultantes dos serviços prestados pertencerão exclusivamente ao CONTRATANTE após a quitação integral dos valores." }
        ]
    },
    {
        titulo: "DO FORO",
        itens: [
            { texto: "Para dirimir quaisquer controvérsias oriundas deste contrato, as partes elegem o foro da comarca de domicílio do CONTRATANTE, com renúncia a qualquer outro." }
        ]
    }
];

// --- SCHEMA E TIPAGEM ---
const formSchema = z.object({
    titulo: z.string().min(5, "Título muito curto"),
    tipo: z.enum(["TRABALHO", "PRESTACAO_SERVICO", "ALUGUEL", "OUTRO"]),
    objetivo: z.string().min(5, "Obrigatório"),
    escopo: z.string().min(10, "Obrigatório"),
    localExecucao: z.string().default("Remoto"),
    contratante: z.string().min(3, "Obrigatório"),
    contratado: z.string().min(3, "Obrigatório"),
    valorTotal: z.string().min(1, "Obrigatório"),
    valorEntrada: z.string().default(""),
    dataEntrada: z.string().default(""),
    metodoPagamento: z.enum(["PIX", "BOLETO", "TRANSFERENCIA", "CARTAO", "DINHEIRO"]),
    parcelas: z.string().min(1).default("1"),
    vencimento: z.string().min(1, "Obrigatório"),
    diaVencimento: z.string().default("10"),
    multaAtraso: z.string().default("2%"),
    jurosMensal: z.string().default("1%"),
    dataInicio: z.string().min(1, "Obrigatório"),
    prazoFinal: z.string().min(1, "Obrigatório"),
    clausulas: z.array(z.object({
        numero: z.string(),
        titulo: z.string().min(2, "Obrigatório"),
        itens: z.array(z.object({ texto: z.string().min(1, "Obrigatório") }))
    })).min(1)
});

type FormValues = z.infer<typeof formSchema>;

// --- UTILITÁRIOS ---
const maskCurrency = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    if (!cleanValue) return "";
    return new Intl.NumberFormat("pt-BR", {
        style: "currency", currency: "BRL", minimumFractionDigits: 2,
    }).format(parseInt(cleanValue, 10) / 100);
};

const parseCurrencyToNumber = (value: string) => {
    return parseFloat(value.replace(/[^\d]/g, "")) / 100 || 0;
};

const maskPercent = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    if (!cleanValue) return "";
    return (parseInt(cleanValue, 10) / 100).toFixed(2).replace(".", ",") + "%";
};

// --- SUBCOMPONENTE: EDITOR DE ITENS ---
function ItensEditor({ clausulaIndex, control, numeroClausula }: { clausulaIndex: number, control: Control<any>, numeroClausula: string }) {
    const { fields, append, remove } = useFieldArray({ control, name: `clausulas.${clausulaIndex}.itens` });

    return (
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-4 font-sans">
            <div className="flex justify-between items-center border-b pb-4 mb-4 uppercase tracking-widest text-slate-500 font-bold text-xs">
                <span>Parágrafos da Cláusula {numeroClausula}</span>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ texto: "" })} className="bg-white border-blue-200 text-blue-700">
                    <Plus className="h-4 w-4 mr-1" /> Novo Item
                </Button>
            </div>
            {fields.map((field, idx) => (
                <div key={field.id} className="flex gap-4 items-start bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <span className="pt-3 font-mono text-blue-600 font-bold text-sm min-w-[30px]">{numeroClausula}.{idx + 1}.</span>
                    <FormField control={control} name={`clausulas.${clausulaIndex}.itens.${idx}.texto` as const} render={({ field }) => (
                        <FormItem className="flex-1 space-y-0">
                            <FormControl>
                                <Textarea {...field} className="min-h-[80px] border-none focus-visible:ring-0 font-serif resize-none p-0 text-base leading-relaxed" />
                            </FormControl>
                        </FormItem>
                    )} />
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(idx)}><Trash2 className="h-4 w-4 text-slate-300 hover:text-red-500" /></Button>
                </div>
            ))}
        </div>
    );
}

// --- SUBCOMPONENTE: PREVIEW A4 ---
function ContratoPreview({ data }: { data: FormValues }) {
    return (
        <div className="bg-white p-12 md:p-20 shadow-inner min-h-[297mm] font-serif text-slate-900 leading-relaxed print:p-0 print:shadow-none" id="contrato-impressao">
            <div className="text-center mb-12 border-b-2 border-slate-900 pb-8">
                <h1 className="text-2xl font-bold uppercase tracking-widest">{data.titulo || "CONTRATO DE PRESTAÇÃO DE SERVIÇOS"}</h1>
                <p className="text-xs mt-2 text-slate-500 font-sans tracking-widest">INSTRUMENTO PARTICULAR DE {data.tipo}</p>
            </div>

            <section className="mb-8">
                <h2 className="font-bold uppercase mb-2 text-sm border-b pb-1">I. DAS PARTES</h2>
                <div className="text-justify text-sm space-y-2">
                    <p><strong>CONTRATANTE:</strong> {data.contratante || "____________________"}</p>
                    <p><strong>CONTRATADO:</strong> {data.contratado || "____________________"}</p>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="font-bold uppercase mb-2 text-sm border-b pb-1">II. DO OBJETO E ESCOPO</h2>
                <div className="text-justify text-sm space-y-4">
                    <p><strong>2.1. Objetivo:</strong> {data.objetivo || "O presente contrato tem como objetivo a prestação de serviços ora descritos."}</p>
                    <p><strong>2.2. Detalhamento do Escopo:</strong> {data.escopo || "As atividades serão executadas conforme acordado entre as partes."}</p>
                    <p><strong>2.3. Local de Execução:</strong> Os serviços serão realizados de forma {data.localExecucao?.toLowerCase() || "remota"}.</p>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="font-bold uppercase mb-2 text-sm border-b pb-1">III. DO VALOR E FORMA DE PAGAMENTO</h2>
                <div className="text-justify text-sm space-y-2">
                    <p>3.1. Pela execução dos serviços, o CONTRATANTE pagará ao CONTRATADO o valor total de <strong>{data.valorTotal || "R$ 0,00"}</strong>.</p>
                    {data.valorEntrada && <p>3.2. Será pago a título de entrada o valor de {data.valorEntrada} na data de {data.dataEntrada || "___/___/___"}.</p>}
                    <p>3.3. O saldo remanescente será quitado em {data.parcelas} parcela(s), via {data.metodoPagamento}, com vencimento todo dia {data.diaVencimento}.</p>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="font-bold uppercase mb-2 text-sm border-b pb-1">IV. DAS PENALIDADES</h2>
                <div className="text-justify text-sm space-y-2">
                    <p>4.1. Em caso de atraso no pagamento, incidirá multa de {data.multaAtraso} sobre o valor da parcela, acrescida de juros de mora de {data.jurosMensal} ao mês.</p>
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="font-bold uppercase mb-2 text-sm border-b pb-1">V. DAS CLÁUSULAS ESPECÍFICAS</h2>
                {data.clausulas?.map((cl, idx) => (
                    <div key={idx} className="break-inside-avoid">
                        <h3 className="font-bold uppercase text-xs mb-2">Cláusula {idx + 6}ª - {cl.titulo}</h3>
                        {cl.itens?.map((it, iIdx) => (
                            <p key={iIdx} className="text-justify text-sm indent-8 mb-2">
                                <strong>{idx + 6}.{iIdx + 1}.</strong> {it.texto}
                            </p>
                        ))}
                    </div>
                )) || <p className="text-slate-400 text-xs italic">Nenhuma cláusula adicional definida.</p>}
            </section>

            <div className="mt-20 grid grid-cols-2 gap-20">
                <div className="text-center pt-8 border-t border-slate-900">
                    <p className="font-bold text-xs uppercase">Contratante</p>
                </div>
                <div className="text-center pt-8 border-t border-slate-900">
                    <p className="font-bold text-xs uppercase">Contratado</p>
                </div>
            </div>
        </div>
    );
}

// --- COMPONENTE PRINCIPAL ---
export default function NewContratoPage(initialData: any, isEditing: boolean = false) {
    const router = useRouter();
    const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            titulo: "", tipo: "PRESTACAO_SERVICO", objetivo: "", escopo: "", localExecucao: "Remoto",
            contratante: "", contratado: "",
            valorTotal: "", valorEntrada: "", dataEntrada: "", metodoPagamento: "PIX", parcelas: "1", vencimento: "",
            diaVencimento: "10", multaAtraso: "2,00%", jurosMensal: "1,00%",
            dataInicio: "", prazoFinal: "",
            clausulas: [{ numero: "1", titulo: "DO OBJETO", itens: [{ texto: "" }] }]
        },
    });

    const { fields: clausulas, append: appendClausula, remove: removeClausula } = useFieldArray({
        control: form.control, name: "clausulas"
    });

    // Lógica de Cálculo de 25% Automático
    const mainValorTotal = form.watch("valorTotal");
    useEffect(() => {
        const totalNum = parseCurrencyToNumber(mainValorTotal);
        if (totalNum > 0 && !form.getValues("valorEntrada")) {
            const sugestaoEntrada = totalNum * 0.25;
            form.setValue("valorEntrada", maskCurrency((sugestaoEntrada * 100).toFixed(0)), { shouldValidate: true });
        }
    }, [mainValorTotal, form]);

    const watched = form.watch(["valorTotal", "valorEntrada", "parcelas"]);
    const valorParcelaFormatado = useMemo(() => {
        const total = parseCurrencyToNumber(watched[0]);
        const entrada = parseCurrencyToNumber(watched[1]);
        const n = parseInt(watched[2] || "1");
        if (total <= 0) return null;
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((total - entrada) / n);
    }, [watched]);

    if (!mounted) return null;

    return (
        // <div className="container mx-auto py-10 max-w-4xl px-4 font-sans">
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-slate-50/50 min-h-screen">
            <style>{`@media print { body * { visibility: hidden; } #contrato-impressao, #contrato-impressao * { visibility: visible; } #contrato-impressao { position: absolute; left: 0; top: 0; width: 100%; } }`}</style>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(async (data) => {
                    try {
                        const response = await fetch("/api/contratos", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(data),
                        });

                        if (response.ok) {
                            router.push("/dashboard/MyContratos");
                        } else {
                            console.error("Failed to save contract");
                        }
                    } catch (error) {
                        console.error("Error saving contract:", error);
                    }
                })} className="space-y-8">
                    <motion.div variants={containerVariants} initial="hidden" animate="visible">
                        <Card className="border-none shadow-2xl overflow-hidden rounded-[2.5rem] bg-white text-slate-900">
                            <CardHeader className="bg-slate-950 p-10 text-white flex flex-row items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <motion.div initial={{ rotate: -10, scale: 0.8 }} animate={{ rotate: 0, scale: 1 }} className="bg-blue-600 p-3 rounded-2xl">
                                        <FileText className="h-7 w-7" />
                                    </motion.div>
                                    <CardTitle className="text-3xl font-black uppercase tracking-tight">LexFlow Contratos</CardTitle>
                                </div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button type="button" variant="secondary" onClick={() => setIsPreviewOpen(true)} className="rounded-full font-bold uppercase">
                                        <Eye className="mr-2 h-4 w-4" /> Preview
                                    </Button>
                                </motion.div>
                            </CardHeader>

                            <CardContent className="p-10 space-y-12">
                                {/* IDENTIFICAÇÃO DAS PARTES */}
                                <motion.div variants={itemVariants} className="space-y-6 bg-slate-950 p-8 rounded-[2rem] text-white">
                                    <h4 className="font-bold flex items-center gap-2 text-blue-400 uppercase text-xs tracking-widest border-b border-white/10 pb-4 mb-4"><Info className="h-4 w-4" /> Identificação</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField control={form.control} name="contratante" render={({ field }) => (
                                            <FormItem><FormLabel className="text-[10px] uppercase font-black text-slate-500 ml-1">Parte Contratante</FormLabel><FormControl><Input placeholder="Nome Completo / Razão Social" {...field} className="bg-white/10 border-white/10 text-white rounded-xl placeholder:text-white/20" /></FormControl></FormItem>
                                        )} />
                                        <FormField control={form.control} name="contratado" render={({ field }) => (
                                            <FormItem><FormLabel className="text-[10px] uppercase font-black text-slate-500 ml-1">Parte Contratada</FormLabel><FormControl><Input placeholder="Nome Completo / Razão Social" {...field} className="bg-white/10 border-white/10 text-white rounded-xl placeholder:text-white/20" /></FormControl></FormItem>
                                        )} />
                                    </div>
                                </motion.div>
                                {/* DADOS DO PROJETO E EXECUÇÃO */}
                                <motion.div variants={itemVariants} className="space-y-6 bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-inner">
                                    <div className="flex items-center justify-between border-b pb-4 mb-4">
                                        <h4 className="font-bold flex items-center gap-2 text-blue-900 uppercase text-xs tracking-widest"><Rocket className="h-4 w-4" /> Detalhes do Projeto</h4>
                                        <div className="flex gap-2">
                                            <FormField control={form.control} name="tipo" render={({ field }) => (
                                                <FormItem><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="bg-white rounded-lg h-8 text-[10px] font-bold uppercase"><SelectValue /></SelectTrigger></FormControl>
                                                    <SelectContent className="rounded-xl"><SelectItem value="PRESTACAO_SERVICO">Serviço</SelectItem><SelectItem value="TRABALHO">Trabalho</SelectItem><SelectItem value="ALUGUEL">Aluguel</SelectItem><SelectItem value="OUTRO">Outro</SelectItem></SelectContent>
                                                </Select></FormItem>
                                            )} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4 col-span-full">
                                            <FormField control={form.control} name="titulo" render={({ field }) => (
                                                <FormItem><FormLabel className="text-[10px] uppercase font-black text-slate-400 ml-1">Título do Instrumento</FormLabel><FormControl><Input placeholder="Ex: Contrato de Consultoria em Marketing" {...field} className="bg-white rounded-xl focus:ring-2 focus:ring-blue-500/20 font-bold" /></FormControl></FormItem>
                                            )} />
                                        </div>
                                        <FormField control={form.control} name="objetivo" render={({ field }) => (
                                            <FormItem><FormLabel className="text-[10px] uppercase font-black text-slate-400 ml-1">Objetivo do Contrato</FormLabel><FormControl><Input placeholder="Ex: Prestação de serviços de design" {...field} className="bg-white rounded-xl" /></FormControl></FormItem>
                                        )} />
                                        <FormField control={form.control} name="localExecucao" render={({ field }) => (
                                            <FormItem><FormLabel className="text-[10px] uppercase font-black text-slate-400 ml-1">Local de Execução</FormLabel><FormControl><Input placeholder="Ex: Remoto / Sede da Contratante" {...field} className="bg-white rounded-xl" /></FormControl></FormItem>
                                        )} />

                                        <div className="grid grid-cols-2 gap-4 col-span-full">
                                            <FormField control={form.control} name="dataInicio" render={({ field }) => (
                                                <FormItem><FormLabel className="text-[10px] uppercase font-black text-slate-400 ml-1">Data de Início</FormLabel><FormControl><Input type="date" {...field} className="bg-white rounded-xl" /></FormControl></FormItem>
                                            )} />
                                            <FormField control={form.control} name="prazoFinal" render={({ field }) => (
                                                <FormItem><FormLabel className="text-[10px] uppercase font-black text-slate-400 ml-1">Prazo / Entrega Final</FormLabel><FormControl><Input placeholder="Ex: 15 de Maio de 2026" {...field} className="bg-white rounded-xl" /></FormControl></FormItem>
                                            )} />
                                        </div>

                                        <div className="col-span-full space-y-2">
                                            <FormLabel className="text-[10px] uppercase font-black text-slate-400 ml-1">Descrição Detalhada do Escopo</FormLabel>
                                            <FormField control={form.control} name="escopo" render={({ field }) => (
                                                <FormItem><FormControl><Textarea placeholder="Descreva aqui detalhadamente o que será entregue..." {...field} className="bg-white rounded-2xl min-h-[120px] resize-none focus:ring-2 focus:ring-blue-500/20" /></FormControl></FormItem>
                                            )} />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* FINANCEIRO PREMIUM */}
                                <motion.div variants={itemVariants} className="space-y-6 bg-emerald-50/30 p-8 rounded-[2rem] border border-emerald-100 shadow-inner">
                                    <h4 className="font-bold flex items-center gap-2 text-emerald-900 uppercase text-xs tracking-widest border-b border-emerald-100 pb-4 mb-4"><Banknote className="h-4 w-4" /> Parâmetros Financeiros</h4>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <FormField control={form.control} name="valorTotal" render={({ field }) => (
                                            <FormItem><FormLabel className="text-[10px] uppercase font-black text-emerald-600/50 ml-1">Valor Total</FormLabel><FormControl><Input placeholder="R$ 0,00" {...field} onChange={(e) => field.onChange(maskCurrency(e.target.value))} className="bg-white rounded-xl font-mono text-emerald-700" /></FormControl></FormItem>
                                        )} />
                                        <FormField control={form.control} name="valorEntrada" render={({ field }) => (
                                            <FormItem>
                                                <div className="flex justify-between items-end mb-1 px-1">
                                                    <FormLabel className="text-[10px] uppercase font-black text-emerald-600/50">Entrada / Sinal</FormLabel>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const totalNum = parseCurrencyToNumber(form.getValues("valorTotal"));
                                                            form.setValue("valorEntrada", maskCurrency((totalNum * 0.25 * 100).toFixed(0)));
                                                        }}
                                                        className="text-[9px] font-black text-emerald-600 uppercase hover:underline tracking-tighter"
                                                    >
                                                        Sugerir 25%
                                                    </button>
                                                </div>
                                                <FormControl><Input placeholder="R$ 0,00" {...field} onChange={(e) => field.onChange(maskCurrency(e.target.value))} className="bg-white rounded-xl font-mono" /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="parcelas" render={({ field }) => (
                                            <FormItem><FormLabel className="text-[10px] uppercase font-black text-emerald-600/50 ml-1">Parcelamento</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="bg-white rounded-xl"><SelectValue /></SelectTrigger></FormControl>
                                                <SelectContent className="rounded-xl">{[1, 2, 3, 4, 5, 6, 8, 10, 12, 18, 24].map(n => <SelectItem key={n} value={n.toString()} className="rounded-lg">{n}x</SelectItem>)}</SelectContent>
                                            </Select></FormItem>
                                        )} />

                                        <FormField control={form.control} name="diaVencimento" render={({ field }) => (
                                            <FormItem><FormLabel className="text-[10px] uppercase font-black text-emerald-600/50 ml-1">Dia de Vencimento</FormLabel><FormControl><Input placeholder="Ex: 5" {...field} className="bg-white rounded-xl" /></FormControl></FormItem>
                                        )} />
                                        <FormField control={form.control} name="multaAtraso" render={({ field }) => (
                                            <FormItem><FormLabel className="text-[10px] uppercase font-black text-emerald-600/50 ml-1">Multa por Atraso</FormLabel><FormControl><Input placeholder="2,00%" {...field} onChange={(e) => field.onChange(maskPercent(e.target.value))} className="bg-white rounded-xl" /></FormControl></FormItem>
                                        )} />
                                        <FormField control={form.control} name="jurosMensal" render={({ field }) => (
                                            <FormItem><FormLabel className="text-[10px] uppercase font-black text-emerald-600/50 ml-1">Juros Mensais</FormLabel><FormControl><Input placeholder="1,00%" {...field} onChange={(e) => field.onChange(maskPercent(e.target.value))} className="bg-white rounded-xl" /></FormControl></FormItem>
                                        )} />
                                    </div>

                                    {valorParcelaFormatado && (
                                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="pt-4 border-t border-emerald-100 flex justify-center">
                                            <div className="bg-emerald-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20">
                                                Plano: {form.watch("parcelas")}x de {valorParcelaFormatado}
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>

                                {/* SEÇÃO DE CLÁUSULAS */}
                                <motion.div variants={itemVariants} className="space-y-8">
                                    <div className="flex justify-between items-center border-b pb-5">
                                        <h3 className="text-2xl font-black flex items-center gap-3 text-slate-900 uppercase tracking-tighter"><Gavel className="h-7 w-7 text-blue-600" /> Cláusulas</h3>
                                        <div className="flex gap-2">
                                            <DropdownMenu>
                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="outline" className="rounded-full border-blue-600 text-blue-600 font-bold">
                                                            <Sparkles className="h-4 w-4 mr-2" /> Sugestões
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                </motion.div>
                                                <DropdownMenuContent className="w-56 rounded-xl shadow-2xl p-2 bg-white">
                                                    {CLAUSULAS_PADRAO.map((sugestao, i) => (
                                                        <DropdownMenuItem
                                                            key={i}
                                                            onClick={() => appendClausula({
                                                                numero: (clausulas.length + 1).toString(),
                                                                titulo: sugestao.titulo,
                                                                itens: sugestao.itens
                                                            })}
                                                            className="cursor-pointer font-medium p-3 rounded-lg hover:bg-slate-50"
                                                        >
                                                            {sugestao.titulo}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>

                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Button type="button" variant="default" onClick={() => appendClausula({ numero: (clausulas.length + 1).toString(), titulo: "", itens: [{ texto: "" }] })} className="rounded-full bg-blue-600 font-bold shadow-lg shadow-blue-500/20"><Plus className="h-4 w-4 mr-2" /> Nova</Button>
                                            </motion.div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <AnimatePresence mode="popLayout">
                                            {clausulas.map((field, index) => (
                                                <motion.div key={field.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex gap-4 p-6 bg-white border border-slate-200 rounded-3xl items-end shadow-sm hover:border-blue-300 hover:shadow-md transition-all group">
                                                    <div className="w-16"><FormField control={form.control} name={`clausulas.${index}.numero` as const} render={({ field }) => (<FormItem><FormControl><Input {...field} className="text-center font-bold bg-slate-100 border-none h-11 rounded-lg" /></FormControl></FormItem>)} /></div>
                                                    <div className="flex-1"><FormField control={form.control} name={`clausulas.${index}.titulo` as const} render={({ field }) => (<FormItem><FormControl><Input placeholder="Título da Cláusula" {...field} className="uppercase font-bold h-11 rounded-lg transition-all focus:ring-2 focus:ring-blue-500/20" /></FormControl></FormItem>)} /></div>
                                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                        <Button type="button" variant="secondary" onClick={() => setOpenModalIndex(index)} className="h-11 font-bold rounded-xl"><Edit3 className="h-4 w-4 mr-2" /> Itens</Button>
                                                    </motion.div>
                                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeClausula(index)}><Trash2 className="h-5 w-5 text-slate-300 hover:text-red-500 transition-colors" /></Button>
                                                    </motion.div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants} whileHover={{ y: -4 }}>
                                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white h-16 rounded-2xl text-xl font-black shadow-2xl shadow-blue-500/40 uppercase tracking-tighter transition-all">
                                        <Save className="mr-3 h-6 w-6" /> Gerar Documento Final
                                    </Button>
                                </motion.div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* MODAIS (DENTRO DO CONTEXTO DO FORMULÁRIO PARA EVITAR ERROS DE CONTEXTO) */}
                    <Dialog open={openModalIndex !== null} onOpenChange={() => setOpenModalIndex(null)}>
                        <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 overflow-hidden border-none rounded-[2.5rem] bg-white text-slate-900">
                            {openModalIndex !== null && (
                                <>
                                    <DialogHeader className="p-10 bg-slate-950 shrink-0 text-white">
                                        <DialogTitle className="font-serif text-2xl uppercase font-black">Cláusula {form.getValues(`clausulas.${openModalIndex}.numero`)}</DialogTitle>
                                        <VisuallyHidden>
                                            <DialogDescription>Editor de parágrafos para a cláusula selecionada.</DialogDescription>
                                        </VisuallyHidden>
                                    </DialogHeader>
                                    <ItensEditor clausulaIndex={openModalIndex} control={form.control} numeroClausula={form.getValues(`clausulas.${openModalIndex}.numero`)} />
                                    <DialogFooter className="p-8 bg-white border-t">
                                        <Button type="button" onClick={() => setOpenModalIndex(null)} className="w-full h-14 bg-blue-600 font-bold uppercase text-white rounded-2xl shadow-lg shadow-blue-500/20 transition-transform active:scale-95">Confirmar</Button>
                                    </DialogFooter>
                                </>
                            )}
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                        <DialogContent className="max-w-5xl h-[95vh] flex flex-col p-0 overflow-hidden border-none bg-slate-100 rounded-[2.5rem] text-slate-900">
                            <DialogHeader className="hidden">
                                <DialogTitle>Preview do Contrato</DialogTitle>
                                <DialogDescription>Visualização em formato A4 para impressão e conferência.</DialogDescription>
                            </DialogHeader>
                            <div className="sticky top-0 z-10 bg-slate-950 p-6 flex justify-between items-center text-white">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-blue-500" />
                                    <span className="font-black uppercase text-sm tracking-widest">Preview Documento A4</span>
                                </div>
                                <Button type="button" onClick={() => window.print()} className="bg-blue-600 rounded-full font-bold uppercase shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"><Printer className="mr-2 h-4 w-4" /> Imprimir / PDF</Button>
                            </div>
                            <div className="overflow-y-auto p-12 flex justify-center bg-slate-200/50">
                                <div className="shadow-2xl bg-white"><ContratoPreview data={form.getValues()} /></div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </form>
            </Form>
        </div>
    );
}
