import React, { useState, useEffect } from "react";
import { appClient } from "@/api/backendClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Link
} from "lucide-react";
import { toast } from "sonner";

export default function AdminPagesTab() {
  const [pages, setPages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    url_slug: '',
    html_content: '',
    visibility: 'hidden',
    is_active: true,
    icon: 'Link',
    form_connection_info: {
        target_entity: 'Lead',
        field_mapping: {}
    }
  });

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      const allPages = await appClient.entities.LeadPage.list('-created_date');
      setPages(allPages || []);
    } catch (error) {
      console.error('Erro ao carregar pÃ¡ginas:', error);
      toast.error("Falha ao carregar pÃ¡ginas.");
    }
  };

  const handleEdit = (page) => {
    setEditingPage(page);
    setFormData({
      ...page,
      form_connection_info: page.form_connection_info || { target_entity: 'Lead', field_mapping: {} }
    });
    setShowModal(true);
  };
  
  const handleNew = () => {
    setEditingPage(null);
    setFormData({
      name: '',
      url_slug: '',
      html_content: '<!-- Cole seu cÃ³digo HTML aqui -->',
      visibility: 'hidden',
      is_active: true,
      icon: 'Link',
      form_connection_info: { target_entity: 'Lead', field_mapping: {} }
    });
    setShowModal(true);
  };

  const handleDelete = async (pageId) => {
    if (window.confirm("Tem certeza que deseja excluir esta pÃ¡gina?")) {
      try {
        await appClient.entities.LeadPage.delete(pageId);
        toast.success("PÃ¡gina excluÃ­da!");
        loadPages();
      } catch (error) {
        toast.error("Falha ao excluir pÃ¡gina.");
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingPage) {
        await appClient.entities.LeadPage.update(editingPage.id, formData);
        toast.success("PÃ¡gina atualizada!");
      } else {
        await appClient.entities.LeadPage.create(formData);
        toast.success("PÃ¡gina criada!");
      }
      setShowModal(false);
      loadPages();
    } catch (error) {
      toast.error("Erro ao salvar pÃ¡gina.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">PÃ¡ginas de Captura (HTML)</h3>
        <Button onClick={handleNew} className="bg-sky-500 hover:bg-sky-600">
          <Plus className="w-4 h-4 mr-2" />
          Nova PÃ¡gina
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.map(page => (
          <Card key={page.id} className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{page.name}</CardTitle>
                <Badge variant={page.is_active ? "default" : "secondary"}>
                  {page.is_active ? "Ativa" : "Inativa"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <a href={page.url_slug} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-sky-400 hover:underline">
                <Link className="w-4 h-4" />
                {page.url_slug}
              </a>
              <p className="text-sm text-gray-400">Visibilidade: {page.visibility}</p>
              <div className="flex gap-2 pt-2 border-t border-gray-700">
                <Button variant="outline" size="sm" onClick={() => handleEdit(page)}><Edit className="w-3 h-3 mr-1"/> Editar</Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(page.id)}><Trash2 className="w-3 h-3 mr-1"/> Excluir</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>{editingPage ? "Editar" : "Nova"} PÃ¡gina de Captura</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <Input
              placeholder="Nome da PÃ¡gina (interno)"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="bg-gray-800 border-gray-700"
            />
            <Input
              placeholder="URL (ex: /lp/plano-x)"
              value={formData.url_slug}
              onChange={e => setFormData({...formData, url_slug: e.target.value})}
              className="bg-gray-800 border-gray-700"
            />
          </div>
          <Textarea
            placeholder="Cole seu cÃ³digo HTML aqui..."
            value={formData.html_content}
            onChange={e => setFormData({...formData, html_content: e.target.value})}
            className="bg-black border-gray-700 font-mono text-sm h-64"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
             <Select value={formData.visibility} onValueChange={v => setFormData({...formData, visibility: v})}>
                <SelectTrigger className="bg-gray-800 border-gray-700"><SelectValue/></SelectTrigger>
                <SelectContent>
                    <SelectItem value="hidden">Oculta (Acesso por Link)</SelectItem>
                    <SelectItem value="sidebar_link">Link na Barra Lateral</SelectItem>
                    <SelectItem value="hub_icon">Ãcone no Hub Principal</SelectItem>
                </SelectContent>
             </Select>
             <div className="flex items-center gap-2">
                <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} id="is_active_check"/>
                <label htmlFor="is_active_check">PÃ¡gina Ativa</label>
             </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button onClick={handleSubmit}>Salvar PÃ¡gina</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

