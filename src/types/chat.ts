export type SenderType = "me" | "other" | "ai" | "user" | "bot";

export interface ChatPreview {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  lastMessage: string;
  time: string;
  unread: number;
  type: "user" | "bot" | "group" | "ai";
}

export interface ChatMedia {
  id: string;
  file: string;
  media_type: "image" | "video" | "audio" | "file";
  created_at: string;
}

export type ChatMessageStatus =
  | "sent"
  | "delivered"
  | "read";

export interface ChatMessage {
  id?: string;
  sender?: string;
  receiver?: string;
  message?: string;
  media?: ChatMedia | null;
  status?: ChatMessageStatus;
  edited?: boolean;
  deleted?: boolean;
  reply_to?: string | null;
  read_at?: string | null;
  type?: "text" | "image" | "document" | "audio";
  file_url?: string;
  file_name?: string;
  delivered_at?: string | null;
  updated_at?: string;
  created_at?: string;
}

export interface Message {
  id: string;

  text: string;

  content?: string;

  sender: SenderType;

  status: ChatMessageStatus;

  timestamp: string;

  chatId?: string;

  type?: "text" | "image" | "video" | "document" | "audio" | "link";

  fileUrl?: string;
  fileName?: string;

  isDeleted?: boolean;
  isEdited?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  memberIds?: string[];
  isBot: boolean;
  isGroup?: boolean;

  lastMessageTime?: string;
  lastMessageText?: string;
}

export interface ChatBot {
  id: string;
  name: string;
  description?: string;
  avatar_url?: string;
}

export interface ChatSession {
  public_id: string;

  title: string;

  bot?: ChatBot;

  created_at: string;
  updated_at: string;

  messages?: ChatMessage[];

  // compatibilidade com UI
  id?: string;
}
