import { base44 } from "@/api/base44Client";

// Helper function to send notifications to users
export const sendNotificationToUsers = async (userIds, notificationData) => {
  try {
    const notifications = userIds.map(userId => ({
      user_id: userId,
      ...notificationData
    }));
    
    // Bulk create notifications
    await Promise.all(notifications.map(notification => 
      base44.entities.UserNotification.create(notification)
    ));
    
    return true;
  } catch (error) {
    console.error("Error sending notifications:", error);
    return false;
  }
};

// Send notification when new content is added
export const notifyNewContent = async (content, allUsers) => {
  const eligibleUsers = allUsers.filter(user => {
    if (content.access_level === 'elite') {
      return user.subscription_level === 'elite';
    }
    return true; // Basic content available to all
  });

  await sendNotificationToUsers(
    eligibleUsers.map(u => u.id),
    {
      notification_type: 'new_content',
      title: 'Novo conteúdo disponível!',
      message: `"${content.title}" foi adicionado à plataforma. Confira agora!`,
      related_id: content.id,
      priority: 'medium'
    }
  );
};

// Send notification for career plan updates
export const notifyCareerUpdate = async (userId, updateType) => {
  const notifications = {
    performance_analyzed: {
      title: 'Sua performance foi analisada!',
      message: 'Um especialista analisou sua última partida. Veja os insights no seu plano de carreira.',
      priority: 'high'
    },
    new_message: {
      title: 'Nova mensagem do especialista',
      message: 'Você recebeu uma nova mensagem no seu plano de carreira.',
      priority: 'medium'
    },
    schedule_reminder: {
      title: 'Lembrete de jogo',
      message: 'Você tem um jogo agendado para hoje. Boa sorte!',
      priority: 'medium'
    }
  };

  const notificationData = notifications[updateType];
  if (notificationData) {
    await sendNotificationToUsers([userId], {
      notification_type: 'career_update',
      ...notificationData
    });
  }
};

// Send live session notifications
export const notifyLiveSession = async (allUsers, sessionData) => {
  await sendNotificationToUsers(
    allUsers.map(u => u.id),
    {
      notification_type: 'live_session',
      title: 'Sessão ao vivo começando!',
      message: `"${sessionData.title}" está começando agora. Não perca!`,
      related_id: sessionData.id,
      priority: 'high'
    }
  );
};

export default function NotificationSystem() {
  return null; // This is a utility component, no UI
}
