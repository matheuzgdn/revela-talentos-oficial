
import React, { useState, useEffect, useCallback } from "react";
import { appClient } from "@/api/backendClient";

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
    const fetchedComments = await appClient.entities.Comment.filter({ content_id: contentId }, "-created_date");
    setComments(fetchedComments);

    // Fetch user data for comments
    const userIds = [...new Set(fetchedComments.map(c => c.user_id))];
    if (userIds.length === 0) return;

    const userPromises = userIds.map(id => appClient.entities.User.get(id).catch(() => null));
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
    if (!newComment.trim() || !currentUser) return;
    setIsPosting(true);
    try {
      await appClient.entities.Comment.create({
        user_id: currentUser.id,
        content_id: contentId,
        comment_text: newComment,
      });
      setNewComment("");
      toast.success("ComentÃ¡rio enviado!");
      fetchCommentsAndUsers(); // Refresh comments
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Erro ao enviar comentÃ¡rio.");
    }
    setIsPosting(false);
  };
  
  const getUserDisplayName = (userId) => {
    return users[userId]?.full_name || "UsuÃ¡rio";
  }

  const getUserAvatar = (userId) => {
      return users[userId]?.profile_picture_url || null;
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-white">DiscussÃ£o</h3>
      <div className="space-y-4">
        {/* Post Comment Form */}
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src={currentUser?.profile_picture_url} />
            <AvatarFallback>{currentUser?.full_name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="Adicione um comentÃ¡rio..."
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
            <div key={comment.id} className="flex gap-3">
              <Avatar>
                 <AvatarImage src={getUserAvatar(comment.user_id)} />
                <AvatarFallback>{getUserDisplayName(comment.user_id).charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="bg-gray-800/50 rounded-lg p-3 flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-sm text-white">{getUserDisplayName(comment.user_id)}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(comment.created_date).toLocaleString('pt-BR')}
                  </p>
                </div>
                <p className="text-gray-300 text-sm whitespace-pre-wrap">{comment.comment_text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}




