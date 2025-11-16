import { apiClient } from './api';
import { ApiResponse } from './auth.service';

interface FeedbackData {
  message_content: string;
}

export async function sendFeedback(messageContent: string): Promise<ApiResponse<any>> {
  return apiClient.post<any>('/customersApi/platform/feedback', {
    message_content: messageContent,
  });
}

