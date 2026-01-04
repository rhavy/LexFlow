import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const contratos = await prisma.contrato.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(contratos);
    } catch (error) {
        console.error("Error fetching contracts:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();

        const contrato = await prisma.contrato.create({
            data: {
                titulo: data.titulo,
                contratante: data.contratante,
                valorTotal: data.valorTotal,
                status: data.status || "PENDENTE",
                conteudo: data, // Storing full form data as JSON
                userId: session.user.id,
            },
        });

        return NextResponse.json(contrato, { status: 201 });
    } catch (error) {
        console.error("Error creating contract:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
