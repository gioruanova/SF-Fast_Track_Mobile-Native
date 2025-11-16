import { useState, useEffect, useCallback } from 'react';
import { messagesService } from '../services/messages.service';
import type { Message } from '../types/message';

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      setError(null);
      const data = await messagesService.getMessages();
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar mensajes');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await fetchMessages();
  }, [fetchMessages]);

  const markAsRead = useCallback(async (messageId: number) => {
    try {
      await messagesService.markAsRead(messageId);
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === messageId ? { ...msg, is_read: 1 } : msg
        )
      );
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  }, []);

  const unreadCount = messagesService.getUnreadCount(messages);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    loading,
    error,
    refreshing,
    refresh,
    markAsRead,
    unreadCount,
  };
}

