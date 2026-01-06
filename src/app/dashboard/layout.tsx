import { SidebarDashboard } from "@/components/menu/SidebarDashboard";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

type User = {
    id: string;
    name: string;
    email: string;
    image: string | null;
};
export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect('/login');
    }

    return (
        <div className="flex bg-slate-50/50 min-h-screen">
            <SidebarDashboard user={session.user as User} />

            <main className="flex-1 lg:ml-[260px] transition-all duration-300">
                {children}
            </main>
        </div>
    );
}