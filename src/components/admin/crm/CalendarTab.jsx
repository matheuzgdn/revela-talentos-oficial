
import React, { useState, useMemo, useEffect } from 'react';
import { Event } from '@/entities/Event';
import { toast } from 'sonner';
import { format, addMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const CalendarHeader = ({ currentMonth, onMonthChange }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-bold text-white capitalize">
      {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
    </h2>
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={() => onMonthChange(-1)}><ChevronLeft className="w-4 h-4" /></Button>
      <Button variant="outline" onClick={() => onMonthChange(0)}>Hoje</Button>
      <Button variant="outline" size="icon" onClick={() => onMonthChange(1)}><ChevronRight className="w-4 h-4" /></Button>
    </div>
  </div>
);

const EventModal = ({ isOpen, onClose, onSave, leads, salesRepId, eventData }) => {
  const [formData, setFormData] = useState(eventData || {
    title: '', event_type: 'reuniao', start_date: '', end_date: '',
    location: '', related_lead_id: '', description: '', assigned_to_id: salesRepId
  });

  useEffect(() => {
    if (eventData) setFormData(eventData);
    else setFormData({
      title: '', event_type: 'reuniao', start_date: '', end_date: '',
      location: '', related_lead_id: '', description: '', assigned_to_id: salesRepId
    });
  }, [eventData, salesRepId]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white border-gray-800">
        <DialogHeader><DialogTitle>{eventData ? "Editar" : "Novo"} Evento</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Título do evento" value={formData.title} onChange={e => setFormData(p => ({...p, title: e.target.value}))} className="bg-gray-800" />
          <div className="grid grid-cols-2 gap-4">
            <Select value={formData.event_type} onValueChange={v => setFormData(p => ({...p, event_type: v}))}>
              <SelectTrigger className="bg-gray-800"><SelectValue/></SelectTrigger>
              <SelectContent>
                <SelectItem value="reuniao">Reunião</SelectItem>
                <SelectItem value="ligacao">Ligação</SelectItem>
                <SelectItem value="avaliacao">Avaliação de Atleta</SelectItem>
                <SelectItem value="proposta">Apresentação de Proposta</SelectItem>
                <SelectItem value="viagem">Viagem</SelectItem>
                <SelectItem value="campeonato">Campeonato</SelectItem>
              </SelectContent>
            </Select>
            <Select value={formData.related_lead_id} onValueChange={v => setFormData(p => ({...p, related_lead_id: v}))}>
              <SelectTrigger className="bg-gray-800"><SelectValue placeholder="Vincular a um Lead..."/></SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>Nenhum</SelectItem>
                {leads.map(lead => <SelectItem key={lead.id} value={lead.id}>{lead.full_name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Início</Label><Input type="datetime-local" value={formData.start_date} onChange={e => setFormData(p => ({...p, start_date: e.target.value}))} className="bg-gray-800"/></div>
            <div><Label>Fim</Label><Input type="datetime-local" value={formData.end_date} onChange={e => setFormData(p => ({...p, end_date: e.target.value}))} className="bg-gray-800"/></div>
          </div>
          <Input placeholder="Local ou Link" value={formData.location} onChange={e => setFormData(p => ({...p, location: e.target.value}))} className="bg-gray-800" />
          <Textarea placeholder="Descrição" value={formData.description} onChange={e => setFormData(p => ({...p, description: e.target.value}))} className="bg-gray-800"/>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar Evento</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function CalendarTab({ events, leads, salesRepId, onRefresh }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleMonthChange = (direction) => {
    if (direction === 0) setCurrentMonth(new Date());
    else setCurrentMonth(addMonths(currentMonth, direction));
  };
  
  const handleSaveEvent = async (eventData) => {
    try {
      if (selectedEvent) {
        await Event.update(selectedEvent.id, eventData);
        toast.success("Evento atualizado!");
      } else {
        await Event.create({ ...eventData, assigned_to_id: salesRepId });
        toast.success("Evento criado!");
      }
      onRefresh();
    } catch(err) {
      toast.error("Erro ao salvar evento.");
    }
  }

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentMonth]);
  
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="p-4 bg-gray-800/50 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <CalendarHeader currentMonth={currentMonth} onMonthChange={handleMonthChange} />
        <Button onClick={() => { setSelectedEvent(null); setShowModal(true); }}><Plus className="w-4 h-4 mr-2"/>Adicionar Evento</Button>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-700 border border-gray-700 rounded-lg overflow-hidden">
        {weekDays.map(day => (
          <div key={day} className="text-center font-medium text-xs text-gray-300 py-2 bg-gray-800">{day}</div>
        ))}
        {days.map(day => {
          const eventsOnDay = events.filter(e => isSameDay(new Date(e.start_date), day));
          return (
            <div key={day.toString()} className={`p-2 h-32 bg-gray-900/50 relative ${!isSameMonth(day, currentMonth) ? 'opacity-50' : ''}`}>
              <span className={`text-xs ${isSameDay(day, new Date()) ? 'bg-blue-500 rounded-full px-1.5 text-white' : 'text-gray-400'}`}>
                {format(day, 'd')}
              </span>
              <div className="space-y-1 mt-1 overflow-y-auto max-h-24">
                {eventsOnDay.map(event => (
                  <div key={event.id} className="p-1 rounded bg-blue-600/50 text-white text-xs truncate cursor-pointer hover:bg-blue-600" onClick={() => { setSelectedEvent(event); setShowModal(true); }}>
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <EventModal isOpen={showModal} onClose={() => setShowModal(false)} onSave={handleSaveEvent} leads={leads} salesRepId={salesRepId} eventData={selectedEvent} />
    </div>
  );
}
