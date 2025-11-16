export interface PlatformMessage {
  platform_message_id: number;
  message_sender: string;
  platform_message_title: string;
  platform_message_content: string;
  company_id: number;
  user_id: number;
  apto_empresa: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: number;
  platform_message_id: number;
  user_id: number;
  is_read: number;
  created_at: string;
  updated_at: string;
  platformMessage: PlatformMessage;
}

export interface MessageResponse {
  messages: Message[];
  unreadCount: number;
}

