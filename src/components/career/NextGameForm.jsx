import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export default function NextGameForm() {
    return (
        <Card className="bg-gray-900/50 border-gray-800 h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                    <Send className="w-5 h-5" />
                    Informar Próximo Jogo
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-gray-400 text-sm">Mantenha nossa equipe de scouting informada sobre suas próximas partidas.</p>
                <div className="space-y-3">
                    <Input placeholder="Adversário" className="bg-gray-800 border-gray-700 text-white" />
                    <Input type="datetime-local" placeholder="Data e Hora" className="bg-gray-800 border-gray-700 text-white" />
                    <Input placeholder="Local (Estádio, Cidade)" className="bg-gray-800 border-gray-700 text-white" />
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Informações
                </Button>
            </CardContent>
        </Card>
    );
}