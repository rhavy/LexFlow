import { SidebarDashboard } from "@/components/menu/SidebarDashboard";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex bg-slate-50/50 min-h-screen">
            <SidebarDashboard />
            <main className="flex-1 lg:ml-[260px] transition-all duration-300">
                {children}
            </main>
        </div>
    );
}