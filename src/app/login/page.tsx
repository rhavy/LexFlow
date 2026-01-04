import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
    return (
        <div className="flex h-screen items-center justify-center bg-slate-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Acesse o LexFlow</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">E-mail</label>
                        <Input type="email" placeholder="seu@email.com" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Senha</label>
                        <Input type="password" />
                    </div>
                    <Button className="w-full bg-blue-600">Entrar</Button>
                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-muted-foreground">Ou</span></div>
                    </div>
                    <Button variant="outline" className="w-full">Entrar com Google</Button>
                </CardContent>
            </Card>
        </div>
    );
}