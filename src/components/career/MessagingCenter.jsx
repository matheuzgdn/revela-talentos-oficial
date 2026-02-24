import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Loader2, MessageSquare, ArrowLeft } from "lucide-react";
import { base44 } from '@/api/base44Client';
import { toast } from "sonner";

// Função unificada para gerar ID de conversa
const getConversationId = (userId, contactId) => {
  return [userId, contactId].sort().join(':');
};

export default function MessagingCenter({ user }) {
  const [contacts] = useState([
    { id: "analyst_01", name: "Analista de Desempenho", role: "Análise Técnica" },
    { id: "physio_01", name: "Preparador Físico", role: "Performance Física" },
    { id: "mentor_01", name: "Mentor de Carreira", role: "Aconselhamento" },
    { id: "marketing_01", name: "Equipe de Marketing", role: "Imagem & Mídia" },
  ]);

  const [selectedContactId, setSelectedContactId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const chatEndRef = useRef(null);

  const conversationId = useMemo(() => {
    if (!user || !selectedContactId) return null;
    return getConversationId(user.id, selectedContactId);
  }, [user, selectedContactId]);

  const loadMessages = useCallback(async () => {
    if (!conversationId) {
      setChatMessages([]);
      return;
    }
    setIsLoadingMessages(true);
    try {
      const messages = await ChatMessage.filter(
        { conversation_id: conversationId },
        "created_date"
      );
      setChatMessages(messages || []);
    } catch (error) {
      console.error("Error loading messages:", error);
      toast.error("Não foi possível carregar as mensagens.");
    }
    setIsLoadingMessages(false);
  }, [conversationId]);
  
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !selectedContactId || !conversationId) return;

    setIsSending(true);
    try {
      await ChatMessage.create({
        sender_id: user.id,
        receiver_id: selectedContactId,
        conversation_id: conversationId,
        content: newMessage,
        message_type: "text",
        read: false,
      });
      setNewMessage("");
      await loadMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Erro ao enviar mensagem.");
    }
    setIsSending(false);
  };

  const selectedContact = contacts.find(c => c.id === selectedContactId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[75vh]">
      {/* Contacts List */}
      <Card className={`lg:col-span-1 bg-gray-900/50 border-gray-800 flex flex-col ${selectedContactId ? 'hidden lg:flex' : 'flex'}`}>
        <CardContent className="p-2 overflow-y-auto flex-grow w-full">
          <h2 className="text-xl font-semibold text-white p-3">Contatos</h2>
          <div className="space-y-1">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedContactId(contact.id)}
                className={`p-3 cursor-pointer rounded-lg transition-colors border-l-4 ${
                  selectedContactId === contact.id
                    ? 'bg-blue-500/10 border-blue-500' 
                    : 'border-transparent hover:bg-gray-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-600">{contact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm truncate">{contact.name}</p>
                    <p className="text-gray-400 text-xs truncate">{contact.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className={`lg:col-span-2 bg-gray-900/50 border-gray-800 flex flex-col ${!selectedContactId ? 'hidden lg:flex' : 'flex'}`}>
        {selectedContact ? (
          <>
            <div className="p-4 border-b border-gray-700 flex items-center gap-3">
               <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSelectedContactId(null)}>
                  <ArrowLeft className="w-5 h-5"/>
               </Button>
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-blue-600">{selectedContact.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-white">{selectedContact.name}</h3>
                <p className="text-gray-400 text-sm">{selectedContact.role}</p>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto bg-black/20">
              {isLoadingMessages ? (
                <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin text-blue-400" /></div>
              ) : (
                <div className="space-y-4">
                  {chatMessages.map((message) => {
                    const isFromUser = message.sender_id === user.id;
                    return (
                      <div key={message.id} className={`flex ${isFromUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isFromUser ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-100'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <p className={`text-xs mt-1 text-right ${isFromUser ? 'text-blue-100/70' : 'text-gray-400'}`}>
                            {new Date(message.created_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-700 bg-gray-900/50">
              <div className="flex gap-2">
                <Textarea
                  placeholder={`Mensagem para ${selectedContact.name}...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                  className="bg-gray-800 border-gray-700 text-white resize-none"
                  rows={1}
                />
                <Button onClick={handleSendMessage} disabled={isSending || !newMessage} className="bg-blue-600 hover:bg-blue-700 self-end">
                  {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <MessageSquare className="w-16 h-16 mb-4" />
            <p>Selecione um contato para visualizar a conversa</p>
          </div>
        )}
      </Card>
    </div>
  );
}