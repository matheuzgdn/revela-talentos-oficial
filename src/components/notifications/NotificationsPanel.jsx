import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Bell, X, Check, Eye, MessageCircle, Trophy, Star, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import moment from 'moment';
import 'moment/locale/pt-br';

moment.locale('pt-br');

export default function NotificationsPanel({ user }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotifications();

      // Check for new notifications every 30 seconds
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const data = await base44.entities.Notification.filter(
        { user_id: user.id },
        '-created_date',
        50
      );
      setNotifications(data || []);
      setUnreadCount((data || []).filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await base44.entities.Notification.update(notificationId, { is_read: true });
      await loadNotifications();
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setLoading(true);
      const unreadNotifications = notifications.filter(n => !n.is_read);
      await Promise.all(
        unreadNotifications.map(n =>
          base44.entities.Notification.update(n.id, { is_read: true })
        )
      );
      await loadNotifications();
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message':
        return MessageCircle;
      case 'profile_visit':
        return Eye;
      case 'achievement':
        return Trophy;
      case 'live_session':
        return Radio;
      case 'general':
        return Bell;
      default:
        return Star;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'message':
        return 'from-blue-500 to-cyan-500';
      case 'profile_visit':
        return 'from-purple-500 to-pink-500';
      case 'achievement':
        return 'from-yellow-500 to-orange-500';
      case 'live_session':
        return 'from-red-500 to-pink-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) markAsRead(notification.id);
    if (notification.type === 'live_session' || notification.notification_type === 'live_session') {
      setIsOpen(false);
      navigate(createPageUrl('Lives'));
    }
  };

  return (
    <>
      {/* Notification Bell Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all ${unreadCount > 0
          ? 'bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/30'
          : 'bg-white/5 border border-white/10 hover:bg-white/10'
          }`}
      >
        <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'text-white' : 'text-gray-400'}`} />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
          >
            <span className="text-white text-[10px] font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>
          </motion.div>
        )}
      </motion.button>

      {/* Notifications Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-gradient-to-b from-[#0A1A2A] to-[#050d14] border-l border-white/10 z-50 flex flex-col"
              style={{ height: '100dvh', maxHeight: '100dvh' }}
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Notificações</h2>
                      <p className="text-xs text-gray-400">
                        {unreadCount > 0 ? `${unreadCount} não lida${unreadCount > 1 ? 's' : ''}` : 'Tudo em dia'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {unreadCount > 0 && (
                  <Button
                    onClick={markAllAsRead}
                    disabled={loading}
                    size="sm"
                    className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Marcar todas como lidas
                  </Button>
                )}
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto overscroll-contain p-4 pb-safe space-y-3" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <Bell className="w-16 h-16 text-gray-700 mb-4" />
                    <p className="text-gray-400 text-sm">Nenhuma notificação ainda</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {notifications.map((notification) => {
                      const Icon = getNotificationIcon(notification.type);
                      const colorClass = getNotificationColor(notification.type);

                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          onClick={() => handleNotificationClick(notification)}
                          className={`relative rounded-xl p-4 cursor-pointer transition-all ${notification.is_read
                            ? 'bg-white/5 border border-white/10'
                            : 'bg-gradient-to-br ' + colorClass + ' bg-opacity-20 border-2 border-blue-500/50 shadow-lg'
                            }`}
                        >
                          {/* Unread indicator */}
                          {!notification.is_read && (
                            <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                          )}

                          <div className="flex gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${notification.is_read ? 'bg-white/10' : 'bg-white/20'
                              }`}>
                              <Icon className={`w-5 h-5 ${notification.is_read ? 'text-gray-400' : 'text-white'}`} />
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className={`font-bold text-sm mb-1 ${notification.is_read ? 'text-gray-300' : 'text-white'}`}>
                                {notification.title}
                              </p>
                              <p className={`text-xs mb-2 ${notification.is_read ? 'text-gray-500' : 'text-gray-200'}`}>
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-2">
                                <Badge className={`text-[10px] ${notification.priority === 'high' || notification.priority === 'urgent'
                                  ? 'bg-red-500/20 text-red-400'
                                  : 'bg-gray-500/20 text-gray-400'
                                  }`}>
                                  {notification.type === 'message' ? 'Mensagem' :
                                    notification.type === 'profile_visit' ? 'Visita' :
                                      notification.type === 'live_session' ? '🔴 Live' :
                                        notification.type === 'achievement' ? 'Conquista' : 'Geral'}
                                </Badge>
                                <span className="text-[10px] text-gray-500">
                                  {moment(notification.created_date).fromNow()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}