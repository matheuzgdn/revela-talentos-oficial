
import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function CommentSection({ contentId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState({});
  const [newComment, setNewComment] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const fetchCommentsAndUsers = useCallback(async () => {
    if (!contentId) return;
    const fetchedComments = await base44.entities.Comment.filter({ content_id: contentId }, "-created_date");
    setComments(fetchedComments);

    // Fetch user data for comments
    const userIds = [...new Set(fetchedComments.map(c => c.user_id))];
    if (userIds.length === 0) return;

    const userPromises = userIds.map(id => User.get(id));
    const fetchedUsers = await Promise.all(userPromises);
    
    const usersMap = {};
    fetchedUsers.forEach(user => {
      if(user) usersMap[user.id] = user;
    });
    setUsers(usersMap);
  }, [contentId]);

  useEffect(() => {
    fetchCommentsAndUsers();
  }, [fetchCommentsAndUsers]);

  const handlePostComment = async () => {
    if (!newbase44.entities.Comment.trim() || !currentUser) return;
    setIsPosting(true);
    try {
      await base44.entities.Comment.create({
        user_id: currentUser.id,
        content_id: contentId,
        comment_text: newComment,
      });
      setNewComment("");
      toast.success("Comentário enviado!");
      fetchCommentsAndUsers(); // Refresh comments
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Erro ao enviar comentário.");
    }
    setIsPosting(false);
  };
  
  const getUserDisplayName = (userId) => {
    return users[userId]?.full_name || "Usuário";
  }

  const getUserAvatar = (userId) => {
      return users[userId]?.profile_picture_url || null;
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-white">Discussão</h3>
      <div className="space-y-4">
        {/* Post Comment Form */}
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src={currentUser?.profile_picture_url} />
            <AvatarFallback>{currentUser?.full_name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="Adicione um comentário..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
            <Button onClick={handlePostComment} disabled={isPosting} className="mt-2 bg-blue-600 hover:bg-blue-700">
              {isPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span className="ml-2">Comentar</span>
            </Button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-6 pt-4">
          {comments.map(comment => (
            <div key={base44.entities.Comment.id} className="flex gap-3">
              <Avatar>
                 <AvatarImage src={getUserAvatar(base44.entities.Comment.user_id)} />
                <AvatarFallback>{getUserDisplayName(base44.entities.Comment.user_id).charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="bg-gray-800/50 rounded-lg p-3 flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-sm text-white">{getUserDisplayName(base44.entities.Comment.user_id)}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(base44.entities.Comment.created_date).toLocaleString('pt-BR')}
                  </p>
                </div>
                <p className="text-gray-300 text-sm whitespace-pre-wrap">{base44.entities.Comment.comment_text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



