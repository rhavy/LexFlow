"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export function Navbar() {
    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full p-6 flex justify-between items-center max-w-7xl mx-auto relative z-10"
        >
            <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-200">
                    <FileText size={24} />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">LexFlow</h1>
            </div>

            <div className="flex items-center gap-4">
                <Link href="/login">
                    <Button variant="ghost" className="hover:text-blue-600 transition-colors font-medium">
                        Entrar
                    </Button>
                </Link>
                <Link href="/dashboard">
                    <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-6">
                        Acessar App
                    </Button>
                </Link>
            </div>
        </motion.header>
    );
}