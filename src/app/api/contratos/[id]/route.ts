import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const contrato = await prisma.contrato.findUnique({
            where: {
                id: params.id,
                userId: session.user.id,
            },
        });

        if (!contrato) {
            return NextResponse.json({ error: "Contract not found" }, { status: 404 });
        }

        return NextResponse.json(contrato);
    } catch (error) {
        console.error("Error fetching contract:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();

        const contrato = await prisma.contrato.update({
            where: {
                id: params.id,
                userId: session.user.id,
            },
            data: {
                titulo: data.titulo,
                contratante: data.contratante,
                valorTotal: data.valorTotal,
                status: data.status,
                conteudo: data,
            },
        });

        return NextResponse.json(contrato);
    } catch (error) {
        console.error("Error updating contract:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await prisma.contrato.delete({
            where: {
                id: params.id,
                userId: session.user.id,
            },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Error deleting contract:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
