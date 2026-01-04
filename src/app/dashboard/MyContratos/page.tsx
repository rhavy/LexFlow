"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    Search,
    MoreVertical,
    Edit3,
    Trash2,
    Eye,
    Plus,
    Filter,
    CheckCircle2,
    Clock,
    X,
    RotateCcw,
    AlertCircle
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

// Importação do seu componente de formulário
import NewContratoPage from "../NewContratos/page";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useRouter } from "next/navigation"; // ✅ Correto

// --- MOCK DE DADOS ---
const MOCK_CONTRATOS = [
    { id: "1", titulo: "Consultoria de TI", contratante: "Empresa Alpha", valorTotal: "R$ 12.000,00", status: "ATIVO", data: "2024-01-10" },
    { id: "2", titulo: "Design de Interface", contratante: "Startup Beta", valorTotal: "R$ 8.500,00", status: "PENDENTE", data: "2024-01-12" },
    { id: "3", titulo: "Aluguel de Servidor", contratante: "Amazon AWS", valorTotal: "R$ 1.250,00", status: "FINALIZADO", data: "2023-12-05" },
    { id: "4", titulo: "Marketing Digital", contratante: "Loja Local", valorTotal: "R$ 3.400,00", status: "ATIVO", data: "2024-02-01" },
];

export default function MyContratos() {
    const router = useRouter();
    const [contratos, setContratos] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedContrato, setSelectedContrato] = useState<any>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // --- BUSCA DE DADOS ---
    useEffect(() => {
        async function fetchContratos() {
            try {
                const response = await fetch("/api/contratos");
                if (response.ok) {
                    const data = await response.json();
                    setContratos(data);
                }
            } catch (error) {
                console.error("Error fetching contracts:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchContratos();
    }, []);

    // --- LÓGICA DE FILTRAGEM ---
    const filteredContratos = useMemo(() => {
        const lowerTerm = searchTerm.toLowerCase();
        return contratos.filter((c) =>
            c.titulo.toLowerCase().includes(lowerTerm) ||
            c.contratante.toLowerCase().includes(lowerTerm) ||
            (c.data && c.data.includes(lowerTerm)) ||
            (c.createdAt && new Date(c.createdAt).toLocaleDateString().includes(lowerTerm)) ||
            c.valorTotal.toLowerCase().includes(lowerTerm) ||
            c.status.toLowerCase().includes(lowerTerm)
        );
    }, [searchTerm, contratos]);

    const handleDelete = async () => {
        if (!selectedContrato) return;
        try {
            const response = await fetch(`/api/contratos/${selectedContrato.id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setContratos(contratos.filter(c => c.id !== selectedContrato.id));
                setIsDeleteOpen(false);
                setSelectedContrato(null);
            }
        } catch (error) {
            console.error("Error deleting contract:", error);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-slate-50/30">

            {/* CABEÇALHO */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Meus Contratos</h1>
                    <p className="text-slate-500 font-medium">Gerencie, filtre e edite seus documentos jurídicos.</p>
                </div>
                <Button onClick={() => router.push("/dashboard/NewContratos")} className="bg-blue-600 hover:bg-blue-700 h-12 px-6 rounded-xl shadow-lg shadow-blue-500/20 uppercase font-bold text-xs tracking-widest transition-all active:scale-95 group">
                    <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
                    Novo Contrato
                </Button>
            </div>

            {/* BARRA DE FERRAMENTAS E FILTRO */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm transition-all">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Buscar por nome, data, status ou valor (R$)..."
                        className="pl-10 pr-10 bg-slate-50 border-none rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500/20 h-11"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full transition-colors"
                        >
                            <X className="h-3 w-3 text-slate-500" />
                        </button>
                    )}
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <AnimatePresence>
                        {searchTerm && (
                            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                                <Button
                                    variant="ghost"
                                    onClick={() => setSearchTerm("")}
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl h-11"
                                >
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Limpar
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Button variant="outline" className="rounded-xl border-slate-200 h-11 flex-1 md:flex-none">
                        <Filter className="mr-2 h-4 w-4" /> Filtros Avançados
                    </Button>
                </div>
            </div>

            {/* GRID DE CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredContratos.length > 0 ? (
                        filteredContratos.map((contrato) => (
                            <motion.div
                                key={contrato.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                whileHover={{ y: -5 }}
                            >
                                <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-[2rem] overflow-hidden bg-white group">
                                    <CardHeader className="p-6 pb-0 flex flex-row justify-between items-start">
                                        <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                            <FileText size={24} />
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                                                    <MoreVertical size={18} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl w-48 p-2 border-none shadow-2xl">
                                                <DropdownMenuItem onClick={() => { setSelectedContrato(contrato); setIsEditOpen(true); }} className="cursor-pointer rounded-lg p-2 font-medium">
                                                    <Edit3 className="mr-2 h-4 w-4" /> Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer rounded-lg p-2 font-medium"><Eye className="mr-2 h-4 w-4" /> Visualizar</DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-slate-100" />
                                                <DropdownMenuItem onClick={() => { setSelectedContrato(contrato); setIsDeleteOpen(true); }} className="text-red-600 cursor-pointer rounded-lg p-2 font-medium focus:bg-red-50">
                                                    <Trash2 className="mr-2 h-4 w-4" /> Excluir
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </CardHeader>

                                    <CardContent className="p-6 space-y-4">
                                        <div>
                                            <h3 className="font-bold text-lg leading-tight text-slate-900 group-hover:text-blue-600 transition-colors">{contrato.titulo}</h3>
                                            <p className="text-sm text-slate-500 font-medium">{contrato.contratante}</p>
                                        </div>

                                        <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                                            <div className="flex items-center gap-2">
                                                {contrato.status === "ATIVO" ? (
                                                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none rounded-lg text-[10px] font-black tracking-widest">
                                                        <CheckCircle2 size={12} className="mr-1" /> ATIVO
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none rounded-lg text-[10px] font-black tracking-widest">
                                                        <Clock size={12} className="mr-1" /> {contrato.status}
                                                    </Badge>
                                                )}
                                                <span className="text-[10px] text-slate-400 font-bold uppercase">{contrato.data}</span>
                                            </div>
                                            <span className="text-emerald-600 font-black text-sm tracking-tight">{contrato.valorTotal}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            className="col-span-full py-20 text-center flex flex-col items-center justify-center bg-white rounded-[2rem] border-2 border-dashed border-slate-200"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                                <Search className="text-slate-400 h-10 w-10" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Nenhum contrato encontrado</h3>
                            <p className="text-slate-500 max-w-xs mx-auto">Não encontramos nada para "{searchTerm}". Verifique a ortografia ou limpe o filtro.</p>
                            <Button variant="link" onClick={() => setSearchTerm("")} className="mt-2 text-blue-600 font-bold">Limpar busca</Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* MODAL DE EXCLUSÃO */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="max-w-md rounded-[2.5rem] p-8 border-none">
                    <DialogHeader className="flex flex-col items-center text-center">
                        <div className="bg-red-50 p-4 rounded-full mb-4">
                            <AlertCircle className="h-10 w-10 text-red-600" />
                        </div>
                        <DialogTitle className="text-2xl font-black uppercase text-slate-900">Confirmar Exclusão</DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium">
                            Você está prestes a remover permanentemente o contrato <span className="text-slate-900 font-bold">"{selectedContrato?.titulo}"</span>. Deseja continuar?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex-col sm:flex-row gap-3 mt-6">
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)} className="flex-1 rounded-xl font-bold uppercase text-xs h-12">Cancelar</Button>
                        <Button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold uppercase text-xs h-12 shadow-lg shadow-red-500/20">Excluir Agora</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* MODAL DE EDIÇÃO */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-[95vw] md:max-w-5xl h-[92vh] p-0 overflow-hidden border-none rounded-[2.5rem] bg-slate-50 shadow-2xl">
                    <VisuallyHidden>
                        <DialogTitle>Editor de Contrato</DialogTitle>
                        <DialogDescription>Interface para alteração de cláusulas e dados.</DialogDescription>
                    </VisuallyHidden>

                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100 z-50">
                        <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} className="h-full bg-blue-600" />
                    </div>

                    <div className="absolute top-6 right-6 z-50">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsEditOpen(false)}
                            className="rounded-full bg-white/20 hover:bg-white/40 text-slate-900 backdrop-blur-md border border-slate-200 transition-all active:scale-90"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="h-full overflow-y-auto">
                        <NewContratoPage
                            initialData={selectedContrato}
                            isEditing={true}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}