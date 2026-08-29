export interface GeminiChat {
  id?: number;
  private_id: string;
  public_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages?: GeminiMessage[];
}

export interface GeminiMessage {
  id: number;
  chat: number | string;
  role: "user" | "assistant";
  type: "text" | "image" | "audio" | "video" | "document" | "link";
  content: string | null;
  file: string | null; // URL to the attachment
  created_at: string;
}

// Frontend representations for contacts & messages
export interface Contact {
  id: string; // matches public_id for bots, or generic id for people
  name: string;
  avatar: string; // Emoji or image URL
  isGroup?: boolean;
  isBot: boolean;
  isMuted?: boolean;
  isArchived?: boolean;
  lastMessageText?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  systemInstruction?: string;
}

export interface Message {
  id: string;
  chatId: string;
  sender: "user" | "other";
  type: "text" | "image" | "audio" | "video" | "document" | "link";
  content: string;
  fileUrl?: string; // URL of media
  fileName?: string; // name of file/document
  timestamp: string;
  transcribedText?: string; // for audio
}
