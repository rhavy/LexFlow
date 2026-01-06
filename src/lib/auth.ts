import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

// EXPORTAÇÃO CORRETA:
// Não desestruture aqui para evitar o erro "is not callable"
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "mysql",
    }),

    // Habilita o login por e-mail/senha do seu formulário
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8, // Padrão de segurança
    },

    baseURL: process.env.NEXT_PUBLIC_APP_URL,

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
});