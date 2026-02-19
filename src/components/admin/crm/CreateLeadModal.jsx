import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function CreateLeadModal({ isOpen, onClose, onSave }) {
    const [leadData, setLeadData] = useState({
        full_name: '',
        email: '',
        phone: '',
        value: 0
    });

    const handleChange = (field, value) => {
        setLeadData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!leadData.full_name || !leadData.email) {
            toast.error("Nome e email são obrigatórios.");
            return;
        }
        const success = await onSave(leadData);
        if (success) {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-gray-900 text-white border-gray-800">
                <DialogHeader><DialogTitle>Criar Novo Lead</DialogTitle></DialogHeader>
                <div className="space-y-4">
                    <div><Label>Nome Completo</Label><Input value={leadData.full_name} onChange={(e) => handleChange('full_name', e.target.value)} className="bg-gray-800 border-gray-700"/></div>
                    <div><Label>Email</Label><Input type="email" value={leadData.email} onChange={(e) => handleChange('email', e.target.value)} className="bg-gray-800 border-gray-700"/></div>
                    <div><Label>Telefone</Label><Input value={leadData.phone} onChange={(e) => handleChange('phone', e.target.value)} className="bg-gray-800 border-gray-700"/></div>
                    <div><Label>Valor Potencial (R$)</Label><Input type="number" value={leadData.value} onChange={(e) => handleChange('value', parseFloat(e.target.value) || 0)} className="bg-gray-800 border-gray-700"/></div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSave}>Salvar Lead</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}