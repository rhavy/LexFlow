"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { FileText, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import { Navbar } from '@/components/menu/Navbar';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 overflow-x-hidden">
      {/* Background Decorativo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-50 to-transparent -z-10" />

      {/* Uso do Componente Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-20 pb-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          <motion.span
            variants={itemVariants}
            className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-blue-700 bg-blue-100 rounded-full"
          >
            A nova era da gestão contratual
          </motion.span>

          <motion.h2
            variants={itemVariants}
            className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900"
          >
            Seus contratos com a <br /> velocidade da luz.
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Automatize a criação, assinatura e gestão de documentos jurídicos.
            Seguro, rápido e totalmente customizável.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-14 px-8 text-lg group">
                Começar agora
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg">
              Ver demonstração
            </Button>
          </motion.div>
        </motion.div>

        {/* Seção de Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 max-w-6xl w-full"
        >
          <FeatureCard
            icon={<Zap className="text-yellow-500" />}
            title="Geração Instantânea"
            description="Preencha os dados e tenha seu contrato pronto em menos de 60 segundos."
          />
          <FeatureCard
            icon={<ShieldCheck className="text-green-500" />}
            title="Segurança Jurídica"
            description="Modelos revisados e atualizados conforme a legislação vigente."
          />
          <FeatureCard
            icon={<FileText className="text-blue-500" />}
            title="Multi-formatos"
            description="Exporte para PDF, Docx ou envie para assinatura digital com um clique."
          />
        </motion.div>
      </main>

      <footer className="py-10 text-center text-slate-400 text-sm border-t">
        © 2026 LexFlow - Sistema de Gestão de Contratos Inteligente
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all text-left"
    >
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{description}</p>
    </motion.div>
  );
}