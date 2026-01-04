"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    FileText,
    Plus,
    Settings,
    LogOut,
    Menu,
    X,
    Gavel,
    Search,
    ChevronRight
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // Utilitário padrão do Shadcn/ui

// SidebarDashboard.tsx
const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: FileText, label: "Meus Contratos", href: "/dashboard/MyContratos" },
    // { icon: Plus, label: "Novo Contrato", href: "/dashboard/NewContratos" },
    // { icon: Search, label: "Modelos", href: "/dashboard/modelos" },
    { icon: Settings, label: "Configurações", href: "/dashboard/configuracoes" },
];

export function SidebarDashboard() {
    const [isOpen, setIsOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();

    // Fecha o menu mobile automaticamente ao clicar em um link
    const handleLinkClick = () => {
        if (window.innerWidth < 1024) setMobileOpen(false);
    };

    return (
        <>
            {/* Botão Mobile */}
            <button
                className="lg:hidden fixed top-4 right-4 z-[60] p-2 bg-blue-600 text-white rounded-xl shadow-lg"
                onClick={() => setMobileOpen(!mobileOpen)}
            >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* ... (Overlay e AnimatePresence) */}

            <motion.aside
                // ... (suas props de animação)
                className={cn(
                    "fixed left-0 top-0 h-screen bg-white border-r border-slate-200 z-50 flex flex-col transition-all duration-300",
                    !mobileOpen && "-translate-x-full lg:translate-x-0"
                )}
            >
                {/* ... (Logo) */}

                <nav className="flex-1 px-3 space-y-1 mt-4">
                    <div className={cn("flex items-center gap-3 mb-4", !isOpen && "justify-center")}>
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                            LX
                        </div>
                        {isOpen && (
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-900 leading-none">Usuário LexFlow</span>
                                <span className="text-[10px] text-slate-500 uppercase font-black">Plano Pro</span>
                            </div>
                        )}
                    </div>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href} onClick={handleLinkClick}>
                                <div className={cn(
                                    "flex items-center gap-3 p-3 rounded-xl transition-all group relative",
                                    isActive
                                        ? "bg-blue-50 text-blue-600 shadow-sm"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                )}>
                                    <item.icon size={22} className={cn(isActive && "text-blue-600")} />
                                    {isOpen && <span className="font-bold text-sm tracking-tight">{item.label}</span>}

                                    {isActive && isOpen && (
                                        <motion.div
                                            layoutId="active-pill"
                                            className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full"
                                        />
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer da Sidebar com Perfil */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    {/* <div className={cn("flex items-center gap-3 mb-4", !isOpen && "justify-center")}>
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                            LX
                        </div>
                        {isOpen && (
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-900 leading-none">Usuário LexFlow</span>
                                <span className="text-[10px] text-slate-500 uppercase font-black">Plano Pro</span>
                            </div>
                        )}
                    </div> */}
                    <button className="w-full flex items-center gap-3 p-2 text-slate-400 hover:text-red-600 transition-colors">
                        <LogOut size={20} />
                        {isOpen && <span className="text-sm font-bold">Encerrar Sessão</span>}
                    </button>
                </div>
            </motion.aside>
        </>
    );
}