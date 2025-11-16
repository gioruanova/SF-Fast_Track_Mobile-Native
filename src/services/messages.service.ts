import type { Message } from '../types/message';
import { apiClient } from './api';

export const messagesService = {
  async getMessages(): Promise<Message[]> {
    try {
      const response = await apiClient.get<Message[]>('/customersApi/platform/messages');
      
      if (response.success && response.data) {
        const sortedMessages = response.data.sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        return sortedMessages;
      }
      
      throw new Error(response.error || 'Error al obtener mensajes');
    } catch (error) {
      console.error('Error en getMessages:', error);
      throw error;
    }
  },

  async markAsRead(messageId: number): Promise<void> {
    try {
      const response = await apiClient.put(
        `/customersApi/platform/message/read/${messageId}`
      );
      
      if (!response.success) {
        throw new Error(response.error || 'Error al marcar mensaje como leído');
      }
    } catch (error) {
      console.error('Error en markAsRead:', error);
      throw error;
    }
  },

  getUnreadCount(messages: Message[]): number {
    return messages.filter(msg => msg.is_read === 0).length;
  },
};

