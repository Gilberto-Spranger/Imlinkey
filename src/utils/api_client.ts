import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  Link,
  CreateLinkData,
  UpdateLinkData,
  Message,
  Contact,
  ChatSession,
  ChatBot,
  User,
  ChatMessage
} from "@/types";

// TYPES & INTERFACES
export interface ApiErrorResponse {
  detail?: string;
  error?: string;
  message?: string;
  [key: string]: string | string[] | undefined;
}

export interface CreateChatPayload {
  name?: string;
  isGroup?: boolean;
  memberIds?: string[];
  isBotChat?: boolean;
  botId?: string;
  [key: string]: any;
}

export interface SendMessageResponse {
  reply: string;
  message_id?: string;
}

export interface MediaGenerationResponse {
  type: "image" | "document";
  media_url: string;
  revised_prompt?: string;
}

const API_BASE = "https://apis.imlinkey.store/api/v1/";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE,
      timeout: 60000,
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    // INTERCEPTOR DE REQUISIÇÃO (CSRF & AUTH TOKENS)
    this.client.interceptors.request.use((config) => {
      if (
        typeof document !== "undefined" &&
        ["post", "put", "patch", "delete"].includes((config.method || "").toLowerCase())
      ) {
        const csrfToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("csrftoken="))
          ?.split("=")[1];

        if (csrfToken && config.headers) {
          config.headers["X-CSRFToken"] = csrfToken;
        }
      }

      const token = this.getTokenFromCookie();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    // INTERCEPTOR DE RESPOSTA (REDIRECT EM ERROS DE AUTENTICAÇÃO)
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          if (typeof window !== "undefined") {
            window.location.href = "/auth/";
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private getTokenFromCookie(): string | null {
    if (typeof document === "undefined") return null;
    const cookies = document.cookie.split(";").map((c) => c.trim());
    const token = cookies.find((c) => c.startsWith("auth_token="));
    return token ? decodeURIComponent(token.split("=")[1]) : null;
  }

  // =========================
  // LINKS API
  // =========================
  async getLinks(): Promise<Link[]> {
    const { data } = await this.client.get<Link[]>("links/");
    return data;
  }

  async getLink(id: string): Promise<any> {
    const { data } = await this.client.get(`links/${id}/`);
    return data;
  }

  async createLink(payload: CreateLinkData): Promise<any> {
    const { data } = await this.client.post("links/", payload);
    return data;
  }

  async updateLink(id: string, payload: UpdateLinkData): Promise<any> {
    const { data } = await this.client.put(`links/${id}/`, payload);
    return data;
  }

  async deleteLink(id: string): Promise<void> {
    await this.client.delete(`links/${id}/`);
  }

  async incrementClick(id: string): Promise<void> {
    await this.client.post(`links/${id}/increment_click/`);
  }

  // =========================
  // GEMINI CHAT API (DJANGO)
  // =========================
  async createChat(payload?: CreateChatPayload): Promise<any> {
    const { data } = await this.client.post("chat/create/", payload || {});
    const chatId = data.public_id || (data as any).id;
    return {
      ...data,
      id: chatId,
      public_id: chatId,
    };
  }

  async getBots(): Promise<any[]> {
    try {
      const { data } = await this.client.get<ChatBot[]>("chat/list/");
      if (Array.isArray(data)) {
        return data.map((bot: any) => ({
          id: bot.id || bot.public_id,
          name: bot.name || bot.title || "Bot IA",
          avatar: bot.avatar_url || bot.avatar || "🤖",
          avatar_url: bot.avatar_url || bot.avatar || "🤖",
          description: bot.description || ""
        }));
      }
      return [];
    } catch {
      return [
        { id: "gemini-bot", name: "Gemini Pro", avatar: "🤖", avatar_url: "🤖", description: "O modelo de IA mais avançado do Google." }
      ];
    }
  }

  async getChats(): Promise<Contact[]> {
    try {
      const { data } = await this.client.get<ChatSession[]>("chat/list");
      if (Array.isArray(data)) {
        return data.map((chat) => {
          const id = chat.public_id || (chat as any).id;
          const isBot = !!chat.bot || (chat as any).is_bot_chat || false;
          const lastMsg = chat.messages && chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null;

          return {
            id,
            name: chat.title || chat.bot?.name || "Conversa",
            avatar: chat.bot?.avatar_url || "👤",
            isBot,
            isGroup: (chat as any).is_group || false,
            lastMessageTime: lastMsg && lastMsg.created_at 
              ? new Date(lastMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
              : undefined,
            lastMessageText: lastMsg ? lastMsg.message : undefined
          };
        });
      }
      return [];
    } catch {
      return [];
    }
  }

  async getChat(publicId: string): Promise<any> {
    const { data } = await this.client.get(`chat/${encodeURIComponent(publicId)}/`);
    const id = data.public_id || (data as any).id;
    return {
      ...data,
      id,
      public_id: id,
    };
  }

  async getMessages(publicId: string): Promise<Message[]> {
    try {
      const { data } = await this.client.get(`chat/${encodeURIComponent(publicId)}/`);
      if (!data || !data.messages) return [];
      return data.messages.map((msg: any) => ({
        id: msg.id || Math.random().toString(36).substring(7),
        chatId: publicId,
        sender: msg.sender || "bot",
        content: msg.message || "",
        type: msg.type || "text",
        timestamp: msg.created_at
          ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fileUrl: msg.file_url,
        fileName: msg.file_name || (msg.file_url ? "Ficheiro Anexo" : undefined),
      })) as Message[];
    } catch {
      return [];
    }
  }

  async deleteChat(publicId: string): Promise<void> {
    await this.client.delete(`chat/${encodeURIComponent(publicId)}/delete/`);
  }

  async clearMessages(publicId: string): Promise<void> {
    await this.client.post(`chat/${encodeURIComponent(publicId)}/clear/`);
  }

  async sendMessage(
    publicId: string,
    payload: { type: string; content: string; fileUrl?: string; fileName?: string; }
  ): Promise<{ userMsg: Message; replyMsg?: Message }> {
    const backendPayload = {
      type: payload.type,
      message: payload.content,
      file_url: payload.fileUrl,
      file_name: payload.fileName,
    };

    const { data } = await this.client.post<SendMessageResponse>(
      `chat/${encodeURIComponent(publicId)}/send/`,
      backendPayload
    );

    const userMsg: Message = {
      id: Math.random().toString(36).substring(7),
      chatId: publicId,
      sender: "user",
      content: payload.content,
      text: payload.content,
      status: "sent",
      type: payload.type as any,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fileUrl: payload.fileUrl,
      fileName: payload.fileName,
    };

    let replyMsg: Message | undefined = undefined;
    if (data && data.reply) {
      replyMsg = {
        id: data.message_id || Math.random().toString(36).substring(7),
        chatId: publicId,
        sender: "bot",
        content: data.reply,
        text: data.reply,
        status: "sent",
        type: "text",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    }

    return { userMsg, replyMsg };
  }

  async generateImage(publicId: string, prompt: string): Promise<any> {
    const { data } = await this.client.post(`chat/${encodeURIComponent(publicId)}/send/`, {
      type: "image",
      message: prompt,
    });
    return data;
  }

  async generateDocument(publicId: string, prompt: string): Promise<any> {
    const { data } = await this.client.post(`chat/${encodeURIComponent(publicId)}/send/`, {
      type: "document",
      message: prompt,
    });
    return data;
  }

  async uploadFile(publicId: string, file: File, type: "image" | "audio" | "document"): Promise<ChatMessage> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const { data } = await this.client.post<ChatMessage>(
      `chat/${encodeURIComponent(publicId)}/send/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  }

  async getUsers(query?: string): Promise<any[]> {
    try {
      const { data } = await this.client.get<User[]>("users/", {
        params: query ? { search: query } : {},
      });
      if (Array.isArray(data)) {
        return data.map((u) => ({
          ...u,
          name: u.username,
          avatar: u.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
        }));
      }
      return [];
    } catch {
      return [];
    }
  }

  async createBot(name: string, avatar: string, instructions: string): Promise<any> {
    const { data } = await this.client.post("chats/", {
      name,
      avatar_url: avatar,
      description: instructions,
      instructions: instructions
    });
    return {
      ...data,
      id: data.id || (data as any).public_id,
    };
  }

  async createUser(name: string): Promise<any> {
    const { data } = await this.client.post("users/", {
      username: name,
      email: `${name.toLowerCase().replace(/\s+/g, "")}@example.com`,
    });
    return {
      ...data,
      id: data.id,
      name: data.username,
      avatar: data.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
    };
  }

  // =========================
  // TTS / STT API (DJANGO)
  // =========================
  async textToSpeech(text: string): Promise<string> {
    const { data } = await this.client.post<{ audio: string }>("tts/", { text });
    return data.audio;
  }

  async speechToText(audio: string, mime: string): Promise<{ text: string }> {
    const { data } = await this.client.post<{ text: string }>("stt/", { audio, mime });
    return data;
  }

  async transcribeAudio(base64Data: string): Promise<string> {
    const res = await this.speechToText(base64Data, "audio/wav");
    return res.text;
  }
}

export const apiClient = new ApiClient();
