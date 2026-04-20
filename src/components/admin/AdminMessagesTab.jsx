
import React, { useState, useMemo } from "react";
import { appClient } from "@/api/backendClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Loader2, MessageSquare, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function AdminMessagesTab({ messages, users, onRefresh }) {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [replyAs, setReplyAs] = useState("analyst_01");

  const personas = [
    { id: "analyst_01", name: "Analista de Desempenho" },
    { id: "physio_01", name: "Preparador FÃ­sico" },
    { id: "mentor_01", name: "Mentor de Carreira" },
    { id: "marketing_01", name: "Equipe de Marketing" },
  ];
  
  const personaIds = personas.map(p => p.id);

  const conversations = useMemo(() => {
    const groupedByConversation = {};

    messages.forEach(msg => {
      const convoId = msg.conversation_id;
      if (!convoId) return;

      if (!groupedByConversation[convoId]) {
        groupedByConversation[convoId] = [];
      }
      groupedByConversation[convoId].push(msg);
    });

    const conversationList = Object.entries(groupedByConversation).map(([convoId, convoMessages]) => {
      if (convoMessages.length === 0) return null;
      
      const firstMessage = convoMessages[0];
      let userId = null;

      if (!personaIds.includes(firstMessage.sender_id)) {
        userId = firstMessage.sender_id;
      } else if (!personaIds.includes(firstMessage.receiver_id)) {
        userId = firstMessage.receiver_id;
      }

      if (!userId) return null;

      const user = users.find(u => u.id === userId);
      if (!user) return null;

      convoMessages.sort((a,b) => new Date(b.created_date) - new Date(a.created_date));
      const lastMessageTime = new Date(convoMessages[0].created_date);

      return {
        id: convoId,
        user: user,
        messages: convoMessages,
        lastMessageTime: lastMessageTime,
      };
    }).filter(Boolean);

    return conversationList.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
  }, [messages, users, personaIds]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setIsSending(true);
    try {
      await appClient.entities.ChatMessage.create({
        sender_id: replyAs,
        receiver_id: selectedConversation.user.id,
        conversation_id: selectedConversation.id,
        content: newMessage,
        message_type: "text",
        read: false,
      });
      setNewMessage("");
      toast.success("Mensagem enviada!");
      if (onRefresh) onRefresh();
      // Optimistic update
      const updatedConversation = {
          ...selectedConversation,
          messages: [...selectedConversation.messages, {
              id: new Date().toISOString(), // temporary id
              sender_id: replyAs,
              receiver_id: selectedConversation.user.id,
              content: newMessage,
              created_date: new Date().toISOString()
          }].sort((a,b) => new Date(a.created_date) - new Date(b.created_date))
      }
      setSelectedConversation(updatedConversation);

    } catch (error) {
      console.error("Error sending message from admin:", error);
      toast.error("Erro ao enviar mensagem.");
    }
    setIsSending(false);
  };

  const currentMessages = selectedConversation 
    ? selectedConversation.messages.sort((a,b) => new Date(a.created_date) - new Date(b.created_date))
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[70vh]">
      {/* Conversations List */}
      <Card className={`lg:col-span-1 bg-gray-800/50 border-gray-700 flex-col ${selectedConversation ? 'hidden lg:flex' : 'flex'}`}>
        <CardContent className="p-2 overflow-y-auto flex-grow">
          <div className="p-3 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Conversas ({conversations.length})</h3>
          </div>
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3" />
              <p>Nenhuma conversa encontrada</p>
            </div>
          ) : (
            conversations.map(convo => (
              <div
                key={convo.id}
                onClick={() => setSelectedConversation(convo)}
                className={`p-3 cursor-pointer rounded-lg transition-colors border-l-4 ${
                  selectedConversation?.id === convo.id 
                    ? 'bg-blue-500/10 border-blue-500' 
                    : 'border-transparent hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={convo.user.profile_picture_url} />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {convo.user.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm truncate">
                      {convo.user.full_name || convo.user.email}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {convo.messages.length} mensagem{convo.messages.length > 1 ? 's' : ''}
                    </p>
                    <p className="text-gray-500 text-xs">
                       Ãšltima msg: {convo.lastMessageTime.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className={`lg:col-span-2 bg-gray-800/50 border-gray-700 flex flex-col ${!selectedConversation ? 'hidden lg:flex' : 'flex'}`}>
        {selectedConversation ? (
          <>
            <div className="p-4 border-b border-gray-700 flex items-center gap-3">
               <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSelectedConversation(null)}>
                  <ArrowLeft className="w-5 h-5"/>
               </Button>
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedConversation.user.profile_picture_url} />
                <AvatarFallback className="bg-blue-600 text-white">
                  {selectedConversation.user.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-white">{selectedConversation.user.full_name}</h3>
                <p className="text-gray-400 text-sm">{selectedConversation.user.email}</p>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto bg-black/20">
              <div className="space-y-4">
                {currentMessages.map((message) => {
                  const isFromUser = !personaIds.includes(message.sender_id);
                  return (
                    <div key={message.id} className={`flex ${isFromUser ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isFromUser ? 'bg-gray-700 text-gray-100' : 'bg-blue-600 text-white'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-1 text-right ${isFromUser ? 'text-gray-400' : 'text-blue-100/70'}`}>
                          {new Date(message.created_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-700 bg-gray-900/50 space-y-2">
              <div className="flex gap-2">
                <Textarea
                  placeholder={`Responder para ${selectedConversation.user.full_name}...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white resize-none"
                  rows={2}
                />
                <Button onClick={handleSendMessage} disabled={isSending || !newMessage} className="bg-blue-600 hover:bg-blue-700 self-end">
                  {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Responder como:</span>
                <Select value={replyAs} onValueChange={setReplyAs}>
                  <SelectTrigger className="w-[220px] bg-gray-800 border-gray-700 text-white h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {personas.map(p => (
                      <SelectItem key={p.id} value={p.id} className="text-xs">
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <MessageSquare className="w-16 h-16 mb-4" />
            <p>Selecione uma conversa para visualizar</p>
          </div>
        )}
      </Card>
    </div>
  );
}


