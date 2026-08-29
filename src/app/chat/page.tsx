"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  MoreVertical,
  Trash2,
  X,
  Phone,
  Settings,
  Plus,
  Smile,
  MessageSquare,
  CheckCheck,
  ArrowLeft,
  AlertTriangle,
  ChevronRight,
  Download,
  Sparkles,
  Bot,
  User,
  Clock,
  Search,
  MessageCircle,
  Menu,
  Image as ImageIcon,
  Video as VideoIcon,
  FileText,
  Link2,
  Maximize2,
  Play,
  Pause,
  Volume2,
  Mic,
  ExternalLink,
  Users,
  PlusCircle,
  RefreshCw,
  AlertCircle,
  Square,
  Moon,
  Sun,
  User as UserIcon,
  Bell
} from "lucide-react";
import { Contact, Message } from "@/types";
import AudioRecorder from "@/components/gemini/audioRecorder";
import LinkShare from "@/components/gemini/linkShare";
import VoiceCall from "@/components/gemini/voiceCall";
import GenerateMedia from "@/components/gemini/generateMedia";
import { apiClient } from "@/utils";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function App() {
  // --- STATES ---
  const [chats, setChats] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  
  // Tab/Search lists
  const [activeTab, setActiveTab] = useState<"people" | "bots">("people");
  const [searchQuery, setSearchQuery] = useState("");
  const [peopleList, setPeopleList] = useState<any[]>([]);
  const [botsList, setBotsList] = useState<any[]>([]);

  // Input states
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [errorAlert, setErrorAlert] = useState<string | null>(null);

  // Creating modais
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<string[]>([]);

  const [showCreateBot, setShowCreateBot] = useState(false);
  const [newBotName, setNewBotName] = useState("");
  const [newBotInstructions, setNewBotInstructions] = useState("");
  const [newBotAvatar, setNewBotAvatar] = useState("https://imlinkey.store/Gavin.png");

  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUserName, setNewUserName] = useState("");

  const [showSettings, setShowSettings] = useState(false);
  const [myUserName, setMyUserName] = useState("Imlinkey");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Widget Toggles
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showRecorder, setShowRecorder] = useState(false);
  const [showLinkShare, setShowLinkShare] = useState(false);
  const [showMediaGenerator, setShowMediaGenerator] = useState(false);
  const [isVoiceCallActive, setIsVoiceCallActive] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [activeAudioPlaying, setActiveAudioPlaying] = useState<string | null>(null);
  const [activeTtsId, setActiveTtsId] = useState<string | null>(null);

  // Layout states
  const [showHeaderDropdown, setShowHeaderDropdown] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // File selectors references
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const audioFileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Audio object references
  const audioPlayersRef = useRef<{ [key: string]: HTMLAudioElement }>({});

  // --- IN-BAR RECORDING STATES & REFS ---
  const [isBarRecording, setIsBarRecording] = useState(false);
  const [barRecordTime, setBarRecordTime] = useState(0);
  const [barAudioUrl, setBarAudioUrl] = useState<string | null>(null);
  const [barAudioBlob, setBarAudioBlob] = useState<Blob | null>(null);
  
  const barMediaRecorderRef = useRef<MediaRecorder | null>(null);
  const barChunksRef = useRef<Blob[]>([]);
  const barTimerRef = useRef<any>(null);

  const formatBarTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // --- INITIAL DATA LOAD ---
  useEffect(() => {
    let ignore = false;
    const fetchInit = async () => {
      try {
        const activeChats = await apiClient.getChats();
        if (ignore) return;
        setChats(activeChats);
        setErrorAlert(null);

        const users = await apiClient.getUsers();
        if (ignore) return;
        setPeopleList(users);

        const bots = await apiClient.getBots();
        if (ignore) return;
        setBotsList(bots);

        if (activeChats.length > 0 && !activeChatId) {
          setActiveChatId(activeChats[0].id);
        }
      } catch (err: any) {
        if (!ignore) {
          setErrorAlert(`Erro ao ligar ao servidor: ${err.message}. Verifique se o backend está ativo.`);
        }
      }
    };
    fetchInit();
    return () => { ignore = true; };
  }, [activeChatId]);

  const loadInitialData = async () => {
    try {
      const activeChats = await apiClient.getChats();
      setChats(activeChats);
      setErrorAlert(null);

      const users = await apiClient.getUsers();
      setPeopleList(users);

      const bots = await apiClient.getBots();
      setBotsList(bots);
    } catch (err: any) {
      setErrorAlert(`Erro ao ligar ao servidor: ${err.message}. Verifique se o backend está ativo.`);
    }
  };

  // Sync users list if search query changes
  useEffect(() => {
    const fetchFilteredPeople = async () => {
      try {
        const users = await apiClient.getUsers(searchQuery);
        setPeopleList(users);
      } catch (err: any) {
        setErrorAlert(`Erro ao pesquisar utilizadores: ${err.message}`);
      }
    };
    fetchFilteredPeople();
  }, [searchQuery]);

  // Sync messages whenever activeChatId changes
  useEffect(() => {
    if (!activeChatId) return;

    const fetchMessages = async () => {
      try {
        const msgs = await apiClient.getMessages(activeChatId);
        setMessages(msgs);
        setErrorAlert(null);
        setShowAttachmentMenu(false);
        setShowRecorder(false);
        setShowLinkShare(false);
        setShowMediaGenerator(false);
      } catch (err: any) {
        setErrorAlert(`Falha ao carregar mensagens: ${err.message}`);
      }
    };

    fetchMessages();

    // Auto close sidebar on mobile when chat is opened
    if (window.innerWidth < 768) {
      setTimeout(() => setIsSidebarOpen(false), 0);
    }
  }, [activeChatId]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  // --- HANDLERS & INTERACTIONS ---

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    setShowHeaderDropdown(false);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // Create or retrieve 1-on-1 direct chat
  const handleStartDirectChat = async (personId: string) => {
    try {
      setErrorAlert(null);

      // Enforce unique direct chat to avoid spam
      const existingChat = chats.find(c => !c.isGroup && !c.isBot && c.memberIds?.includes(personId) && c.memberIds?.length === 2);
      if (existingChat) {
        setActiveChatId(existingChat.id);
        if (window.innerWidth < 768) setIsSidebarOpen(false);
        return;
      }

      const newChat = await apiClient.createChat({
        isGroup: false,
        memberIds: ["user-me", personId],
        isBotChat: false
      });
      
      // Reload chats list
      const updatedChats = await apiClient.getChats();
      setChats(updatedChats);
      setActiveChatId(newChat.public_id || newChat.id);
      if (window.innerWidth < 768) setIsSidebarOpen(false);
    } catch (err: any) {
      setErrorAlert(`Erro ao iniciar conversa: ${err.message}`);
    }
  };

  // Create or retrieve bot chat
  const handleStartBotChat = async (botId: string) => {
    try {
      setErrorAlert(null);

      // Enforce unique bot chat
      const existingChat = chats.find(c => c.isBot && c.memberIds?.includes(botId));
      if (existingChat) {
        setActiveChatId(existingChat.id);
        if (window.innerWidth < 768) setIsSidebarOpen(false);
        return;
      }

      const newChat = await apiClient.createChat({
        isGroup: false,
        memberIds: ["user-me", botId],
        isBotChat: true,
        botId
      });

      // Reload chats list
      const updatedChats = await apiClient.getChats();
      setChats(updatedChats);
      setActiveChatId(newChat.id);
      if (window.innerWidth < 768) setIsSidebarOpen(false);
    } catch (err: any) {
      setErrorAlert(`Erro ao iniciar conversa com IA: ${err.message}`);
    }
  };

  // Send a message
  const handleSendTextMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || !activeChatId) return;

    const textToSend = inputMessage.trim();
    setInputMessage("");
    setIsTyping(true);
    setErrorAlert(null);

    try {
      const response = await apiClient.sendMessage(activeChatId, {
        type: "text",
        content: textToSend
      });

      // Update messages list immediately
      setMessages((prev) => [...prev, response.userMsg]);

      // If there was a reply from bot, append it too
      if (response.replyMsg) {
        setMessages((prev) => [...prev, response.replyMsg!]);
      }

      // Reload chats list to update sidebar snippets
      const updatedChats = await apiClient.getChats();
      setChats(updatedChats);
    } catch (err: any) {
      setErrorAlert(`Falha de conexão com o Gemini ou Servidor: ${err.message}`);
    } finally {
      setIsTyping(false);
    }
  };

  // --- ATTACHMENTS & UPLOADS ---

  const handleTriggerFileInput = (type: "image" | "video" | "doc" | "audio") => {
    setShowAttachmentMenu(false);
    if (type === "image") fileInputRef.current?.click();
    if (type === "video") videoInputRef.current?.click();
    if (type === "doc") docInputRef.current?.click();
    if (type === "audio") audioFileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video" | "document" | "audio") => {
    const file = e.target.files?.[0];
    if (!file || !activeChatId) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setIsTyping(true);
      setErrorAlert(null);

      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${(file.size / 1024).toFixed(0)} KB`;

      try {
        const response = await apiClient.sendMessage(activeChatId, {
          type: type === "document" ? "document" : type === "audio" ? "audio" : type,
          content: file.name,
          fileUrl: dataUrl,
          fileName: `${file.name} (${sizeStr})`
        });

        setMessages((prev) => [...prev, response.userMsg]);
        if (response.replyMsg) {
          setMessages((prev) => [...prev, response.replyMsg!]);
        }

        const updatedChats = await apiClient.getChats();
        setChats(updatedChats);
      } catch (err: any) {
        setErrorAlert(`Falha ao carregar e enviar arquivo: ${err.message}`);
      } finally {
        setIsTyping(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // --- IN-BAR RECORDING OPERATIONS ---
  const startBarRecording = async () => {
    barChunksRef.current = [];
    setBarAudioUrl(null);
    setBarAudioBlob(null);
    setBarRecordTime(0);
    setErrorAlert(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      barMediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          barChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(barChunksRef.current, { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        setBarAudioBlob(blob);
        setBarAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsBarRecording(true);
      barTimerRef.current = setInterval(() => {
        setBarRecordTime((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      setErrorAlert("Permissão de microfone negada ou indisponível.");
    }
  };

  const stopBarRecordingAndSave = () => {
    if (barMediaRecorderRef.current && isBarRecording) {
      barMediaRecorderRef.current.stop();
      setIsBarRecording(false);
      if (barTimerRef.current) {
        clearInterval(barTimerRef.current);
        barTimerRef.current = null;
      }
    }
  };

  const cancelBarRecording = () => {
    if (barMediaRecorderRef.current && isBarRecording) {
      try {
        barMediaRecorderRef.current.stop();
      } catch (e) {}
    }
    setIsBarRecording(false);
    if (barTimerRef.current) {
      clearInterval(barTimerRef.current);
      barTimerRef.current = null;
    }
    setBarAudioUrl(null);
    setBarAudioBlob(null);
    setBarRecordTime(0);
  };

  const sendBarAudio = async (blobToSend?: Blob) => {
    const finalBlob = blobToSend || barAudioBlob;
    if (!finalBlob || !activeChatId) return;

    setIsTyping(true);
    setErrorAlert(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const dataUrl = reader.result as string;
          const response = await apiClient.sendMessage(activeChatId, {
            type: "audio",
            content: "Mensagem de voz",
            fileUrl: dataUrl
          });

          setMessages((prev) => [...prev, response.userMsg]);
          if (response.replyMsg) {
            setMessages((prev) => [...prev, response.replyMsg!]);
          }

          const updatedChats = await apiClient.getChats();
          setChats(updatedChats);
        } catch (innerErr: any) {
          setErrorAlert(`Falha ao enviar áudio: ${innerErr.message}`);
        } finally {
          setIsTyping(false);
          setBarAudioBlob(null);
          setBarAudioUrl(null);
          setBarRecordTime(0);
        }
      };
      reader.readAsDataURL(finalBlob);
    } catch (err: any) {
      setErrorAlert(`Erro ao ler arquivo de áudio: ${err.message}`);
      setIsTyping(false);
    }
  };

  const transcribeBarAudio = async (blobToTranscribe?: Blob) => {
    const finalBlob = blobToTranscribe || barAudioBlob;
    if (!finalBlob) return;
    setIsTranscribing(true);
    setErrorAlert(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = (reader.result as string).split(",")[1];
          const text = await apiClient.transcribeAudio(base64Data);
          setInputMessage(text);
          setBarAudioBlob(null);
          setBarAudioUrl(null);
          setBarRecordTime(0);
        } catch (err: any) {
          setErrorAlert(`Falha ao transcrever: ${err.message}`);
        } finally {
          setIsTranscribing(false);
        }
      };
      reader.readAsDataURL(finalBlob);
    } catch (e: any) {
      setErrorAlert("Erro ao processar arquivo de áudio.");
      setIsTranscribing(false);
    }
  };

  // --- MEDIA HANDLERS FROM FLOATING WIDGETS ---

  const handleAudioRecordingReady = async (url: string, blob: Blob) => {
    if (!activeChatId) return;
    setIsTyping(true);
    setErrorAlert(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const dataUrl = reader.result as string;
          const response = await apiClient.sendMessage(activeChatId, {
            type: "audio",
            content: "Mensagem de voz enviada",
            fileUrl: dataUrl
          });

          setMessages((prev) => [...prev, response.userMsg]);
          if (response.replyMsg) {
            setMessages((prev) => [...prev, response.replyMsg!]);
          }

          const updatedChats = await apiClient.getChats();
          setChats(updatedChats);
        } catch (innerErr: any) {
          setErrorAlert(`Falha ao enviar áudio: ${innerErr.message}`);
        } finally {
          setIsTyping(false);
          setShowRecorder(false);
        }
      };
      reader.readAsDataURL(blob);
    } catch (err: any) {
      setErrorAlert(`Erro ao ler arquivo de áudio: ${err.message}`);
      setIsTyping(false);
    }
  };

  const handleTranscriptionReady = (text: string) => {
    setInputMessage(text);
    setShowRecorder(false);
  };

  const handleLinkAdded = async (title: string, url: string) => {
    if (!activeChatId) return;
    setIsTyping(true);
    setErrorAlert(null);

    try {
      const response = await apiClient.sendMessage(activeChatId, {
        type: "link",
        content: title,
        fileUrl: url,
        fileName: title
      });

      setMessages((prev) => [...prev, response.userMsg]);
      if (response.replyMsg) {
        setMessages((prev) => [...prev, response.replyMsg!]);
      }

      const updatedChats = await apiClient.getChats();
      setChats(updatedChats);
    } catch (err: any) {
      setErrorAlert(`Falha ao enviar link: ${err.message}`);
    } finally {
      setIsTyping(false);
      setShowLinkShare(false);
    }
  };

  const handleMediaGenerated = async (imageUrl: string, prompt: string) => {
  if (!activeChatId) return;

  setIsTyping(true);
  setErrorAlert(null);

  try {
    const response = await apiClient.sendMessage(activeChatId, {
      type: "image",
      content: `Mídia IA: "${prompt}"`,
      fileUrl: imageUrl,
      fileName: undefined
    });

    setMessages((prev) => [...prev, response.userMsg]);

    if (response.replyMsg) {
      setMessages((prev) => [...prev, response.replyMsg!]);
    }

    const updatedChats = await apiClient.getChats();
    setChats(updatedChats);
  } catch (err: any) {
    setErrorAlert(
      `Falha ao guardar mídia gerada no chat: ${err.message}`
    );
  } finally {
    setIsTyping(false);
    setShowMediaGenerator(false);
  }
};

  // --- AUDIO TTS READ ALOUD ---
  const handleTextToSpeech = async (msgId: string, text: string) => {
    if (activeTtsId === msgId) {
      if (audioPlayersRef.current[msgId]) {
        audioPlayersRef.current[msgId].pause();
      }
      setActiveTtsId(null);
      return;
    }

    setActiveTtsId(msgId);
    setErrorAlert(null);

    try {
      const audioB64 = await apiClient.textToSpeech(text);
      
      const byteCharacters = atob(audioB64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "audio/wav" });
      const blobUrl = URL.createObjectURL(blob);

      if (activeTtsId && audioPlayersRef.current[activeTtsId]) {
        audioPlayersRef.current[activeTtsId].pause();
      }

      const player = new Audio(blobUrl);
      audioPlayersRef.current[msgId] = player;
      player.onended = () => {
        setActiveTtsId(null);
        URL.revokeObjectURL(blobUrl);
      };

      player.play();
    } catch (err: any) {
      // Alert user gracefully
      setErrorAlert(`Falha ao converter texto para voz no Gemini: ${err.message}.`);
      setActiveTtsId(null);
    }
  };

  const toggleAudioPlayback = (msgId: string, url: string) => {
    const player = audioPlayersRef.current[msgId];
    if (player) {
      if (activeAudioPlaying === msgId) {
        player.pause();
        setActiveAudioPlaying(null);
      } else {
        if (activeAudioPlaying && audioPlayersRef.current[activeAudioPlaying]) {
          audioPlayersRef.current[activeAudioPlaying].pause();
        }
        player.play();
        setActiveAudioPlaying(msgId);
      }
    } else {
      const newPlayer = new Audio(url);
      audioPlayersRef.current[msgId] = newPlayer;
      newPlayer.onended = () => {
        setActiveAudioPlaying(null);
      };
      
      if (activeAudioPlaying && audioPlayersRef.current[activeAudioPlaying]) {
        audioPlayersRef.current[activeAudioPlaying].pause();
      }
      newPlayer.play();
      setActiveAudioPlaying(msgId);
    }
  };

  // --- CREATION MODALS HANDLERS ---

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setErrorAlert("Por favor, indique um nome para o grupo.");
      return;
    }
    if (selectedGroupMembers.length < 2) {
      setErrorAlert("Por favor, selecione pelo menos mais 2 pessoas para criar um grupo.");
      return;
    }

    try {
      setErrorAlert(null);

      // Enforce unique group name
      const existingGroup = chats.find(c => c.isGroup && c.name.toLowerCase() === groupName.trim().toLowerCase());
      if (existingGroup) {
        setActiveChatId(existingGroup.id);
        setGroupName("");
        setSelectedGroupMembers([]);
        setShowCreateGroup(false);
        if (window.innerWidth < 768) setIsSidebarOpen(false);
        return;
      }

      const newChat = await apiClient.createChat({
        name: groupName.trim(),
        isGroup: true,
        memberIds: ["user-me", ...selectedGroupMembers],
        isBotChat: false
      });

      const updatedChats = await apiClient.getChats();
      setChats(updatedChats);
      setActiveChatId(newChat.id);
      
      // Reset group states
      setGroupName("");
      setSelectedGroupMembers([]);
      setShowCreateGroup(false);
      if (window.innerWidth < 768) setIsSidebarOpen(false);
    } catch (err: any) {
      setErrorAlert(`Erro ao criar o grupo de chat: ${err.message}`);
    }
  };

  const handleCreateBot = async () => {
    if (!newBotName.trim()) {
      setErrorAlert("Nome do Bot IA é obrigatório.");
      return;
    }

    try {
      setErrorAlert(null);
      
      const existingBot = botsList.find(b => b.name.toLowerCase() === newBotName.trim().toLowerCase());
      let botId = existingBot?.id;

      if (!botId) {
        const newBot = await apiClient.createBot(
          newBotName.trim(),
          newBotAvatar,
          newBotInstructions.trim()
        );
        botId = newBot.id;
      }

      // Instantly start chat with this new AI bot
      const existingChat = chats.find(c => c.isBot && c.memberIds?.includes(botId!));
      let chatId = existingChat?.id;
      if (!chatId) {
        const newChat = await apiClient.createChat({
          isGroup: false,
          memberIds: ["user-me", botId],
          isBotChat: true,
          botId: botId
        });
        chatId = newChat.id;
      }

      await loadInitialData();
      setActiveChatId(chatId!);

      // Reset
      setNewBotName("");
      setNewBotInstructions("");
      setShowCreateBot(false);
      if (window.innerWidth < 768) setIsSidebarOpen(false);
    } catch (err: any) {
      setErrorAlert(`Erro ao registar nova IA no backend: ${err.message}`);
    }
  };

  const handleQuickCreateBot = async (presetName: string, presetAvatar: string, presetInstructions: string) => {
    try {
      setErrorAlert(null);
      const existingBot = botsList.find(b => b.name.toLowerCase() === presetName.toLowerCase());
      let botId = existingBot?.id;

      if (!botId) {
        const newBot = await apiClient.createBot(presetName, presetAvatar, presetInstructions);
        botId = newBot.id;
      }

      const existingChat = chats.find(c => c.isBot && c.memberIds?.includes(botId!));
      let chatId = existingChat?.id;

      if (!chatId) {
         const newChat = await apiClient.createChat({
          isGroup: false,
          memberIds: ["user-me", botId],
          isBotChat: true,
          botId: botId
        });
        chatId = newChat.id;
      }

      await loadInitialData();
      setActiveChatId(chatId!);
      setShowCreateBot(false);
      if (window.innerWidth < 768) setIsSidebarOpen(false);
    } catch (err: any) {
      setErrorAlert(`Erro ao configurar IA rápida: ${err.message}`);
    }
  };

  const handleCreateUser = async () => {
    if (!newUserName.trim()) {
      setErrorAlert("Nome do utilizador é obrigatório.");
      return;
    }

    try {
      setErrorAlert(null);
      const newUser = await apiClient.createUser(newUserName.trim());
      
      // Auto start DM chat
      const newChat = await apiClient.createChat({
        isGroup: false,
        memberIds: ["user-me", newUser.id],
        isBotChat: false
      });

      await loadInitialData();
      setActiveChatId(newChat.id);

      setNewUserName("");
      setShowCreateUser(false);
      if (window.innerWidth < 768) setIsSidebarOpen(false);
    } catch (err: any) {
      setErrorAlert(`Erro ao adicionar pessoa no servidor: ${err.message}`);
    }
  };

  // --- DELETE & CLEAR ACTIONS ---

  const handleClearChatHistory = async () => {
    if (!activeChatId) return;
    if (confirm("Tens a certeza que queres eliminar todas as mensagens desta conversa?")) {
      try {
        setErrorAlert(null);
        await apiClient.clearMessages(activeChatId);
        setMessages([]);
        setShowHeaderDropdown(false);
      } catch (err: any) {
        setErrorAlert(`Erro ao limpar mensagens: ${err.message}`);
      }
    }
  };

  const handleDeleteConversation = async () => {
    if (!activeChatId || !activeChat) return;
    if (confirm(`Queres eliminar em definitivo a conversa com ${activeChat.name}?`)) {
      try {
        setErrorAlert(null);
        await apiClient.deleteChat(activeChatId);
        
        const updated = await apiClient.getChats();
        setChats(updated);
        
        if (updated.length > 0) {
          setActiveChatId(updated[0].id);
        } else {
          setActiveChatId(null);
        }
        setShowHeaderDropdown(false);
      } catch (err: any) {
        setErrorAlert(`Erro ao eliminar conversa: ${err.message}`);
      }
    }
  };

  const handleDeleteAllChats = async () => {
    if (confirm("Tens a certeza que queres eliminar TODAS as conversas? Isto não pode ser revertido.")) {
      try {
        setErrorAlert(null);
        for (const chat of chats) {
          await apiClient.deleteChat(chat.id);
        }
        setChats([]);
        setMessages([]);
        setActiveChatId(null);
        setShowSettings(false);
      } catch(err: any) {
        setErrorAlert(`Erro ao limpar todas as conversas: ${err.message}`);
      }
    }
  };

  return (
    <div className="flex h-[100dvh] w-screen bg-[#020617] text-slate-100 overflow-hidden font-sans relative antialiased">
      
      {/* Hidden file input elements */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileUpload(e, "image")}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={videoInputRef}
        onChange={(e) => handleFileUpload(e, "video")}
        accept="video/*"
        className="hidden"
      />
      <input
        type="file"
        ref={docInputRef}
        onChange={(e) => handleFileUpload(e, "document")}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.md"
        className="hidden"
      />
      <input
        type="file"
        ref={audioFileInputRef}
        onChange={(e) => handleFileUpload(e, "audio")}
        accept="audio/*"
        className="hidden"
      />

      {/* --- GLOBAL ERROR BANNER / ALERT --- */}
      {errorAlert && (
        <div className="absolute top-4 left-4 right-4 md:left-1/4 md:right-1/4 bg-rose-950 border-2 border-rose-800 text-rose-200 rounded-2xl p-4 shadow-2xl z-50 flex items-start gap-3.5 animate-in slide-in-from-top-4 duration-300">
          <AlertCircle className="shrink-0 mt-0.5 text-rose-400" size={18} />
          <div className="flex-1 text-xs">
            <h4 className="font-extrabold text-white mb-0.5">Alerta</h4>
            <p className="leading-relaxed font-semibold">{errorAlert}</p>
          </div>
          <button
            onClick={() => setErrorAlert(null)}
            className="p-1 rounded-lg bg-rose-900/40 hover:bg-rose-900 text-white shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* --- SIDEBAR PANEL (LEFT) --- */}
      <aside
        className={`bg-[#030712] border-r border-slate-900/60 flex flex-col h-full shrink-0 transition-all duration-300 z-30 ${
          isSidebarOpen ? "w-full md:w-[350px] lg:w-[380px] flex absolute md:relative inset-0" : "w-0 hidden md:flex md:w-[350px] lg:w-[380px] -translate-x-full md:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-900/80 flex flex-col gap-4 shrink-0 bg-[#030712]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img src={activeChat ? (activeChat.isBot ? "https://imlinkey.store/favicon.png" : (activeChat.avatar || "https://imlinkey.store/favicon.png")) : "https://imlinkey.store/favicon.png"} alt="Avatar" className="w-9 h-9 rounded-xl object-cover shadow-lg shadow-indigo-950/50" />
              <div>
                <h1 className="text-base font-extrabold tracking-tight text-white leading-none">{activeChat ? activeChat.name : "Imlinkey"}</h1>
                <span className="text-[9px] text-indigo-400 font-mono tracking-wider uppercase font-extrabold">{activeChat ? (activeChat.isBot ? "Chat Bot" : `@${activeChat.name.toLowerCase().replace(/\s/g, '')}`) : "Chat Bot"}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadInitialData}
                className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-900 text-slate-400 hover:text-white transition-colors"
                title="Sincronizar dados"
              >
                <RefreshCw size={13} />
              </button>

              {/* Mobile Close Button */}
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden p-1.5 rounded-lg bg-slate-950 border border-slate-900 text-slate-400 hover:text-white"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Search bar input */}
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Pesquisar utilizadores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-900/80 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500/50 transition-colors"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <X size={12} />
              </button>
            )}
          </div>

          {/* Sidebar Tab switches */}
          <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-900/80">
            <button
              onClick={() => setActiveTab("people")}
              className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "people"
                  ? "bg-slate-900 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <User size={13} />
              <span>Pessoas / Grupos</span>
            </button>
            <button
              onClick={() => setActiveTab("bots")}
              className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "bots"
                  ? "bg-slate-900 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Bot size={13} />
              <span>Bots de IA</span>
            </button>
          </div>
        </div>

        {/* --- LIST AREA --- */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          
          {/* A. PEOPLE TAB CONTROLS */}
          {activeTab === "people" && (
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setShowCreateGroup(true)}
                className="flex-1 p-2.5 bg-indigo-950/40 hover:bg-indigo-950/75 border border-indigo-900/40 rounded-xl text-[11px] font-extrabold text-indigo-400 flex items-center justify-center gap-1.5 transition-colors shadow-lg cursor-pointer"
              >
                <Users size={13} />
                <span>Criar Grupo (+2)</span>
              </button>

              <button
                onClick={() => setShowCreateUser(true)}
                className="flex-1 p-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-900 rounded-xl text-[11px] font-extrabold text-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus size={13} />
                <span>Adicionar Pessoa</span>
              </button>
            </div>
          )}

          {/* B. BOTS TAB CONTROLS */}
          {activeTab === "bots" && (
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() => setShowCreateBot(true)}
                className="w-full p-2.5 bg-gradient-to-r from-indigo-950/50 to-indigo-900/10 border border-indigo-900/40 rounded-xl text-[11px] font-extrabold text-indigo-400 flex items-center justify-center gap-1.5 hover:border-indigo-850 transition-colors shadow-lg cursor-pointer"
              >
                <PlusCircle size={14} />
                <span>Configurar IA Manualmente</span>
              </button>
              <button
                onClick={() => {
                  const uniqueNames = ["Gavin", "Aria", "Neon", "Zephyr", "Lumina", "Orion", "Nova", "Atlas"];
                  const roles = ["Especialista em Programação", "Conselheiro de Vida", "Tradutor Universal", "Guia de Turismo", "Assistente Criativo", "Detetive Virtual", "Especialista em UX", "Cientista de Dados"];
                  const name = uniqueNames[Math.floor(Math.random() * uniqueNames.length)] + " " + Math.floor(Math.random() * 1000);
                  const role = roles[Math.floor(Math.random() * roles.length)];
                  handleQuickCreateBot(name, "https://imlinkey.store/favicon.png", `Você é um ${role}. Você tem características únicas, uma personalidade distinta e evita repetir o comportamento padrão de outras IAs.`);
                }}
                className="w-full p-2.5 bg-gradient-to-r from-violet-950/50 to-purple-900/10 border border-violet-900/40 rounded-xl text-[11px] font-extrabold text-violet-400 flex items-center justify-center gap-1.5 hover:border-violet-850 transition-colors shadow-lg cursor-pointer"
              >
                <Sparkles size={14} />
                <span>Criação de IA Única (1 Clique)</span>
              </button>
            </div>
          )}

          {/* C. ACTIVE DISCUSSIONS LIST */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase block pl-1.5 pb-1">Conversas Recentes</span>
            
            {chats.filter(c => activeTab === "bots" ? c.isBot : !c.isBot).map((chat) => {
              const isSelected = chat.id === activeChatId;

              return (
                <div
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? "bg-slate-900/90 border-indigo-950 shadow-md"
                      : "bg-transparent border-transparent hover:bg-slate-950"
                  }`}
                >
                  <div className="relative shrink-0">
                    {chat.isBot ? (
                      <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-900/30 flex items-center justify-center text-lg shadow-inner">
                        {chat.avatar}
                      </div>
                    ) : chat.isGroup ? (
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-lg shadow-inner">
                        👥
                      </div>
                    ) : (
                      <img
                        src={chat.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${chat.name}`}
                        alt={chat.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-900"
                      />
                    )}
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#020617] ${
                      chat.isBot ? "bg-indigo-400" : "bg-emerald-500"
                    }`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-xs text-white truncate">{chat.name}</span>
                      <span className="text-[9px] text-slate-500">{chat.lastMessageTime || "Agora"}</span>
                    </div>
                    <p className="text-xs truncate text-slate-400">
                      {chat.lastMessageText || "Nenhuma mensagem."}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* D. DISCOVER DIRECTORY & IA LIST */}
          <div className="space-y-1.5 pt-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase block pl-1.5">
              {activeTab === "bots" ? "Modelos de IA Disponíveis" : "Diretório Geral de Pessoas"}
            </span>

            {activeTab === "people" ? (
              peopleList.map((person) => {
                // Skip if this is user-me
                if (person.id === "user-me") return null;

                return (
                  <div
                    key={person.id}
                    onClick={() => handleStartDirectChat(person.id)}
                    className="flex items-center justify-between p-2.5 bg-slate-950/65 hover:bg-slate-900 border border-slate-900/50 rounded-xl cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={person.avatar} alt={person.name} className="w-8 h-8 rounded-lg object-cover" />
                      <span className="text-xs font-semibold text-slate-200 truncate">{person.name}</span>
                    </div>
                    <ChevronRight size={13} className="text-slate-600 shrink-0" />
                  </div>
                );
              })
            ) : (
              botsList.map((bot) => {
                return (
                  <div
                    key={bot.id}
                    onClick={() => handleStartBotChat(bot.id)}
                    className="flex items-center justify-between p-2.5 bg-indigo-950/15 hover:bg-indigo-950/30 border border-indigo-900/20 rounded-xl cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-900/40 flex items-center justify-center text-sm shrink-0">
                        {bot.avatar || "🤖"}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-slate-200 block truncate">{bot.name}</span>
                        <span className="text-[9px] text-indigo-400 truncate block">Iniciar sessão IA</span>
                      </div>
                    </div>
                    <ChevronRight size={13} className="text-indigo-400 shrink-0" />
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* User Footer Account Profile */}
        <div className="p-4 bg-slate-950 border-t border-slate-900/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img src="https://imlinkey.store/favicon.png" alt={myUserName} className="w-8 h-8 rounded-full object-cover" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{myUserName}</p>
              <p className="text-[10px] text-emerald-400 font-medium truncate">● online</p>
            </div>
          </div>
          <button onClick={() => setShowSettings(true)} className="p-1.5 rounded-lg hover:bg-slate-900 shrink-0 cursor-pointer text-slate-500 hover:text-white transition-colors">
            <Settings size={16} />
          </button>
        </div>
      </aside>

      {/* --- CHAT VIEWPORT (RIGHT) --- */}
      <main className={`flex-1 h-full flex flex-col bg-[#020617] relative transition-all ${isSidebarOpen ? "hidden md:flex" : "flex"}`}>
        
        {activeChat ? (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            
            {/* Viewport Header */}
            <header className="h-16 border-b border-slate-900/60 px-4 flex items-center justify-between shrink-0 bg-[#020617]/80 backdrop-blur z-20">
              <div className="flex items-center gap-3 min-w-0">
                
                {/* Mobile sidebar toggle or back button */}
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 -ml-1 rounded-xl bg-slate-950 border border-slate-900 text-slate-400 hover:text-white md:hidden shrink-0 transition-colors"
                >
                  <ArrowLeft size={16} />
                </button>

                <div className="relative shrink-0">
                  {activeChat.isBot ? (
                    <div className="w-9 h-9 rounded-xl bg-indigo-950/80 border border-indigo-900/30 flex items-center justify-center text-base">
                      {activeChat.avatar}
                    </div>
                  ) : activeChat.isGroup ? (
                    <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-base">
                      👥
                    </div>
                  ) : (
                    <img
                      src={activeChat.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${activeChat.name}`}
                      alt={activeChat.name}
                      className="w-9 h-9 rounded-xl object-cover border border-slate-900"
                    />
                  )}
                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#020617] ${
                    activeChat.isBot ? "bg-indigo-400" : "bg-emerald-500"
                  }`} />
                </div>

                <div className="min-w-0">
                  <h2 className="font-bold text-xs text-white truncate leading-none">{activeChat.name}</h2>
                  <span className="text-[10px] text-slate-500 font-semibold tracking-wide truncate block">
                    {activeChat.isBot ? "Chat Bot" : `@${activeChat.name.toLowerCase().replace(/\s/g, '')}`}
                  </span>
                </div>
              </div>

              {/* Header Action Tools */}
              <div className="flex items-center gap-2">
                
                {activeChat.isBot && (
                  <button
                    onClick={() => setIsVoiceCallActive(true)}
                    className="h-9 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-950/50 cursor-pointer shrink-0"
                    title="Iniciar chamada de voz em tempo real com a IA"
                  >
                    <Phone size={14} className="animate-pulse" />
                    <span className="hidden sm:inline text-xs font-bold">Chamada de Voz IA</span>
                  </button>
                )}

                <button
                  onClick={() => setShowHeaderDropdown(!showHeaderDropdown)}
                  className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-900 text-slate-400 hover:text-white flex items-center justify-center transition-colors relative shrink-0 cursor-pointer"
                >
                  <MoreVertical size={14} />
                  
                  {showHeaderDropdown && (
                    <div className="absolute right-0 top-11 bg-slate-950 border border-slate-900/80 rounded-xl p-1.5 shadow-2xl z-50 w-44 text-left animate-in slide-in-from-top-2">
                      <button
                        onClick={handleClearChatHistory}
                        className="w-full px-3 py-2 hover:bg-slate-900 rounded-lg text-xs font-bold text-slate-300 hover:text-white flex items-center gap-2"
                      >
                        <Trash2 size={13} className="text-rose-500" />
                        <span>Limpar mensagens</span>
                      </button>
                      <button
                        onClick={handleDeleteConversation}
                        className="w-full px-3 py-2 hover:bg-rose-950/10 rounded-lg text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-2"
                      >
                        <Trash2 size={13} />
                        <span>Eliminar conversa</span>
                      </button>
                    </div>
                  )}
                </button>
              </div>
            </header>

            {/* Chat Messages Scrolling Space */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#020617]/30 custom-scrollbar relative">
              
              {messages.length > 0 ? (
                messages.map((msg) => {
                  const isUser = msg.sender === "user";

                  return (
                    <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"} w-full animate-in fade-in-20 duration-150`}>
                      <div className={`max-w-[85%] md:max-w-[75%] p-3.5 rounded-2xl relative shadow-md flex flex-col gap-2 ${
                        isUser 
                          ? "bg-indigo-600 text-white rounded-tr-none" 
                          : "bg-slate-900/90 border border-slate-800/50 text-slate-200 rounded-tl-none"
                      }`}>
                        
                        {/* 1. TEXT MESSAGE TYPE */}
                        {msg.type === "text" && (
                          <div className="flex items-start gap-2.5 justify-between">
                            <div className={`text-xs md:text-sm leading-relaxed whitespace-pre-wrap break-words prose ${isUser ? 'prose-invert' : 'prose-invert'} prose-sm max-w-none`}>
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content || ""}</ReactMarkdown>
                            </div>
                            
                            {/* Read Aloud Button */}
                            <button
                              onClick={() => handleTextToSpeech(msg.id, msg.content!)}
                              className={`p-1 rounded-lg shrink-0 transition-all ${
                                isUser 
                                  ? "hover:bg-indigo-500/50 text-indigo-200" 
                                  : "hover:bg-slate-800 text-slate-400 hover:text-white"
                              }`}
                              title="Ouvir mensagem (Texto para áudio)"
                            >
                              {activeTtsId === msg.id ? (
                                <Volume2 size={14} className="animate-bounce text-amber-400" />
                              ) : (
                                <Volume2 size={14} />
                              )}
                            </button>
                          </div>
                        )}

                        {/* 2. PHOTO / IMAGE MESSAGE TYPE */}
                        {msg.type === "image" && (
                          <div className="space-y-1.5">
                            <div 
                              className="relative rounded-xl overflow-hidden border border-slate-800/80 bg-slate-950 cursor-zoom-in group"
                              onClick={() => setLightboxImage(msg.fileUrl || null)}
                            >
                              <img src={msg.fileUrl} alt="Uploaded attachment" className="max-h-56 object-contain w-full" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs gap-1 font-bold">
                                <Maximize2 size={14} /> Ampliar Imagem
                              </div>
                            </div>
                            {msg.content && <p className="text-[11px] opacity-90 leading-relaxed">{msg.content}</p>}
                          </div>
                        )}

                        {/* 3. VIDEO MESSAGE TYPE */}
                        {msg.type === "video" && (
                          <div className="space-y-1.5">
                            <video controls className="rounded-xl w-full max-h-56 bg-black border border-slate-800" src={msg.fileUrl} />
                            {msg.content && <p className="text-[11px] opacity-90">{msg.content}</p>}
                          </div>
                        )}

                        {/* 4. DOCUMENT MESSAGE TYPE */}
                        {msg.type === "document" && (
                          <div className={`p-2.5 rounded-xl flex items-center gap-3 border ${
                            isUser 
                              ? "bg-indigo-750 border-indigo-500/30" 
                              : "bg-slate-950 border-slate-800"
                          }`}>
                            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                              <FileText size={18} />
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                              <p className="text-xs font-bold truncate text-white">{msg.content}</p>
                              <span className="text-[9px] text-slate-400 font-semibold block">Documento de Texto IA</span>
                            </div>
                            <a
                              href={msg.fileUrl}
                              download={msg.fileName || msg.content}
                              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:text-indigo-400 shrink-0"
                              title="Descarregar arquivo"
                            >
                              <Download size={14} />
                            </a>
                          </div>
                        )}

                        {/* 5. LINK PREVIEW MESSAGE TYPE */}
                        {msg.type === "link" && (
                          <div className={`p-3 rounded-xl border flex flex-col gap-2 ${
                            isUser 
                              ? "bg-indigo-750 border-indigo-500/30" 
                              : "bg-slate-950 border-slate-800"
                          }`}>
                            <div className="flex items-start gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                                <Link2 size={16} />
                              </div>
                              <div className="min-w-0 text-left">
                                <h4 className="text-xs font-bold text-white truncate">{msg.fileName || msg.content}</h4>
                                <span className="text-[9px] text-slate-400 font-mono block truncate">{msg.fileUrl}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-1 border-t border-slate-800/40 mt-1">
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                                Link de Partilha
                              </span>
                              <a
                                href={msg.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 shrink-0 font-sans"
                              >
                                Visitar <ExternalLink size={11} />
                              </a>
                            </div>
                          </div>
                        )}

                        {/* 6. AUDIO MESSAGE TYPE */}
                        {msg.type === "audio" && (
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => toggleAudioPlayback(msg.id, msg.fileUrl || "")}
                              className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 hover:bg-slate-900 text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                            >
                              {activeAudioPlaying === msg.id ? (
                                <Pause size={12} />
                              ) : (
                                <Play size={12} className="ml-0.5" />
                              )}
                            </button>

                            {/* Waveform indicator */}
                            <div className="flex items-center gap-0.5 h-6">
                              {[3, 5, 2, 6, 4, 7, 3, 5, 8, 2, 4, 6, 3, 7, 5, 4].map((h, i) => (
                                <span
                                  key={i}
                                  className={`w-[2.5px] rounded-full transition-all ${
                                    activeAudioPlaying === msg.id
                                      ? "bg-amber-400 animate-pulse"
                                      : "bg-slate-600"
                                  }`}
                                  style={{ height: `${h * 12}%` }}
                                />
                              ))}
                            </div>

                            <span className="text-[10px] text-slate-400 font-mono font-bold shrink-0">
                              Áudio de Voz
                            </span>
                          </div>
                        )}

                        </div>
                      </div>
                    
                  );
                })
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40 px-6 py-12">
                  <MessageCircle size={36} className="text-indigo-400 mb-2.5 animate-bounce" />
                  <p className="text-xs font-bold text-slate-300">Nenhuma mensagem neste chat</p>
                  <p className="text-[10px] text-slate-500 mt-1 max-w-[260px]">
                    Escreva algo, envie fotos, vídeos ou use as ferramentas do Gemini no &apos;+&apos; para criar conteúdo!
                  </p>
                </div>
              )}

              {/* Typing loader */}
              {isTyping && (
                <div className="flex justify-start w-full">
                  <div className="bg-slate-900 border border-slate-800/40 text-slate-400 p-3 px-4 rounded-2xl rounded-tl-none flex items-center gap-1 shadow">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-75" />
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150" />
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-300" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* FLOATING ACTION PANELS FOR AUDIO, GENERATIVE MEDIA, AND LINKS */}
            {(showRecorder || showLinkShare || showMediaGenerator) && (
              <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-900/80 shrink-0 flex flex-col gap-2 z-10 animate-in slide-in-from-bottom-5 duration-200">
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setShowRecorder(false);
                      setShowLinkShare(false);
                      setShowMediaGenerator(false);
                    }}
                    className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800/50 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>

                {showRecorder && (
                  <AudioRecorder
                    onAudioReady={handleAudioRecordingReady}
                    onTranscriptionReady={handleTranscriptionReady}
                    isTranscribing={isTranscribing}
                    setIsTranscribing={setIsTranscribing}
                  />
                )}

                {showLinkShare && (
                  <LinkShare onLinkAdded={handleLinkAdded} isLoading={false} />
                )}

                {showMediaGenerator && (
                  <GenerateMedia
                    onMediaGenerated={handleMediaGenerated}
                    onClose={() => setShowMediaGenerator(false)}
                  />
                )}
              </div>
            )}

            {/* Bottom Writing Action Bar */}
            <footer className="p-3 bg-[#020617] border-t border-slate-900/40 shrink-0 relative">
              
              {/* Attachment selector menu panel */}
              {showAttachmentMenu && (
                <div className="absolute bottom-16 left-4 bg-[#030712]/95 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-3.5 shadow-2xl z-40 w-72 flex flex-col gap-2 animate-in fade-in-20 slide-in-from-bottom-2 duration-150">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider pl-1 mb-1">Anexar ou Criar Mídia</span>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleTriggerFileInput("image")}
                      className="flex flex-col items-start gap-2 p-3 bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 rounded-xl transition-all text-left cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                        <ImageIcon size={15} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-200 block">Enviar Foto</span>
                        <span className="text-[9px] text-slate-500 block">Imagens e prints</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTriggerFileInput("video")}
                      className="flex flex-col items-start gap-2 p-3 bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 rounded-xl transition-all text-left cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                        <VideoIcon size={15} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-200 block">Enviar Vídeo</span>
                        <span className="text-[9px] text-slate-500 block">Clipes MP4/WEBM</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTriggerFileInput("doc")}
                      className="flex flex-col items-start gap-2 p-3 bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 rounded-xl transition-all text-left cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                        <FileText size={15} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-200 block">Documento</span>
                        <span className="text-[9px] text-slate-500 block">PDF, Word, ZIP</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTriggerFileInput("audio")}
                      className="flex flex-col items-start gap-2 p-3 bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 rounded-xl transition-all text-left cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
                        <Mic size={15} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-200 block">Ficheiro Áudio</span>
                        <span className="text-[9px] text-slate-500 block">MP3, WAV, AAC</span>
                      </div>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowAttachmentMenu(false);
                      setShowLinkShare(true);
                      setShowRecorder(false);
                      setShowMediaGenerator(false);
                    }}
                    className="w-full p-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                      <Link2 size={13} />
                    </div>
                    <div className="text-left">
                      <span className="block font-bold">Partilhar Link Dinâmico</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowAttachmentMenu(false);
                      setShowMediaGenerator(true);
                      setShowLinkShare(false);
                      setShowRecorder(false);
                    }}
                    className="w-full p-2.5 bg-indigo-950/40 hover:bg-indigo-950/60 border border-indigo-900/30 rounded-xl text-xs font-bold text-indigo-300 flex items-center gap-2.5 transition-all cursor-pointer shadow-lg"
                  >
                    <div className="w-6 h-6 rounded bg-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                      <Sparkles size={13} className="animate-pulse" />
                    </div>
                    <div className="text-left">
                      <span className="block font-black">Gerador de Mídia Inteligente IA</span>
                    </div>
                  </button>
                </div>
              )}

              <div className="max-w-4xl mx-auto w-full">
                {isBarRecording ? (
                  /* PREMIUM IN-PLACE VOICE RECORDER BAR */
                  <div className="flex items-center justify-between bg-rose-950/15 border border-rose-900/35 rounded-2xl p-2.5 w-full animate-in fade-in slide-in-from-bottom-2 duration-150">
                    <div className="flex items-center gap-3">
                      <div className="relative flex items-center justify-center shrink-0">
                        <span className="absolute inline-flex h-4 w-4 rounded-full bg-rose-500 opacity-30 animate-ping" />
                        <span className="relative w-2.5 h-2.5 rounded-full bg-rose-500" />
                      </div>
                      <span className="text-xs font-mono font-extrabold text-rose-400 tracking-wider">
                        {Math.floor(barRecordTime / 60).toString().padStart(2, "0")}:
                        {(barRecordTime % 60).toString().padStart(2, "0")}
                      </span>
                      
                      {/* Live Waveform visualizer */}
                      <div className="flex items-center gap-1 pl-1 shrink-0 h-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                          <span
                            key={val}
                            className="w-1 bg-rose-500 rounded-full animate-bounce"
                            style={{
                              height: `${(val * 3) % 12 + 4}px`,
                              animationDelay: `${val * 0.08}s`,
                              animationDuration: "0.5s"
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={cancelBarRecording}
                        className="p-2 px-3 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl flex items-center gap-1.5 cursor-pointer transition-all border border-slate-800/40"
                        title="Cancelar Gravação"
                      >
                        <Trash2 size={13} className="text-rose-400" />
                        <span className="text-xs font-bold hidden sm:inline">Descartar</span>
                      </button>

                      <button
                        type="button"
                        onClick={stopBarRecordingAndSave}
                        className="p-2 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-800/40 text-slate-300 hover:text-white rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
                        title="Parar gravação para ouvir/rever"
                      >
                        <Square size={12} className="text-amber-500" fill="currentColor" />
                        <span className="text-xs font-bold hidden sm:inline">Ouvir</span>
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          if (barMediaRecorderRef.current) {
                            barMediaRecorderRef.current.addEventListener("stop", () => {
                              const blob = new Blob(barChunksRef.current, { type: "audio/wav" });
                              transcribeBarAudio(blob);
                            }, { once: true });
                            barMediaRecorderRef.current.stop();
                            setIsBarRecording(false);
                            if (barTimerRef.current) clearInterval(barTimerRef.current);
                          }
                        }}
                        disabled={isTranscribing}
                        className="p-2 px-3 bg-indigo-950 hover:bg-indigo-900 border border-indigo-900/40 text-indigo-400 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
                        title="Transcrever áudio para texto com Gemini"
                      >
                        <Sparkles size={13} className={isTranscribing ? "animate-spin text-violet-400" : "text-violet-400"} />
                        <span className="text-xs font-bold hidden sm:inline">{isTranscribing ? "Screvendo..." : "Transcrever"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (barMediaRecorderRef.current) {
                            barMediaRecorderRef.current.addEventListener("stop", () => {
                              const blob = new Blob(barChunksRef.current, { type: "audio/wav" });
                              sendBarAudio(blob);
                            }, { once: true });
                            barMediaRecorderRef.current.stop();
                            setIsBarRecording(false);
                            if (barTimerRef.current) clearInterval(barTimerRef.current);
                          }
                        }}
                        className="p-2 px-4.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-lg font-bold"
                        title="Terminar e enviar áudio"
                      >
                        <Send size={13} />
                        <span className="text-xs hidden sm:inline">Enviar</span>
                      </button>
                    </div>
                  </div>
                ) : barAudioUrl ? (
                  /* STOPPED PREVIEWING STATE FOR AUDIO */
                  <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 w-full animate-in fade-in duration-150">
                    <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                      <Mic size={14} className="text-rose-500 shrink-0" />
                      <audio src={barAudioUrl} controls className="h-9 w-full max-w-sm bg-slate-950 rounded-lg animate-pulse" />
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={cancelBarRecording}
                        className="p-2 px-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Trash2 size={13} className="text-rose-500" />
                        <span className="hidden sm:inline">Descartar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => transcribeBarAudio()}
                        disabled={isTranscribing}
                        className="p-2 px-3 bg-indigo-950 hover:bg-indigo-900 border border-indigo-900/40 rounded-xl text-xs font-bold text-indigo-400 flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
                      >
                        <Sparkles size={13} className={isTranscribing ? "animate-spin text-violet-400" : "text-violet-400"} />
                        <span className="hidden sm:inline">{isTranscribing ? "Transcrevendo..." : "Transcrever"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => sendBarAudio()}
                        className="p-2 px-4.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-extrabold text-white flex items-center gap-1.5 shadow-lg shadow-indigo-950/50 cursor-pointer transition-all"
                      >
                        <Send size={13} />
                        <span className="hidden sm:inline">Enviar</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* STANDARD ACTION BAR */
                  <form onSubmit={handleSendTextMessage} className="flex items-center gap-2">
                    
                    {/* Plus Selector Button */}
                    <button
                      type="button"
                      onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all shrink-0 cursor-pointer ${
                        showAttachmentMenu
                          ? "bg-indigo-950/40 border-indigo-800 text-indigo-400 shadow-md shadow-indigo-950/45"
                          : "bg-slate-950 border-slate-900 text-slate-400 hover:text-white hover:border-slate-800"
                      }`}
                      title="Anexar mídias, documentos ou partilhar"
                    >
                      <Plus size={16} className={`transition-transform duration-200 ${showAttachmentMenu ? "rotate-45 text-indigo-400" : ""}`} />
                    </button>

                    {/* Microphone Record Button */}
                    <button
                      type="button"
                      onClick={startBarRecording}
                      className="w-11 h-11 rounded-xl flex items-center justify-center border bg-slate-950 border-slate-900 hover:border-slate-800 text-rose-500 hover:text-rose-400 transition-all shrink-0 cursor-pointer group"
                      title="Gravar mensagem de voz"
                    >
                      <Mic size={15} className="group-hover:scale-110 transition-transform" />
                    </button>

                    {/* Input Text box */}
                    <div className="flex-1 h-11 bg-slate-950 border border-slate-900 rounded-xl px-3 flex items-center focus-within:border-indigo-500/50 transition-colors">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder={isTyping ? "Processando resposta..." : `Escrever para ${activeChat.name}...`}
                        disabled={isTyping}
                        className="flex-1 bg-transparent border-none outline-none text-xs md:text-sm text-slate-200 placeholder-slate-600 focus:ring-0 min-w-0"
                      />
                      
                      {/* Quick emoji helper */}
                      <button
                        type="button"
                        onClick={() => setInputMessage((prev) => prev + "🤝")}
                        className="text-slate-500 hover:text-slate-300 p-1 cursor-pointer transition-colors shrink-0"
                      >
                        <Smile size={16} />
                      </button>
                    </div>

                    {/* Send Button */}
                    <button
                      type="submit"
                      disabled={!inputMessage.trim() || isTyping}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                        inputMessage.trim() && !isTyping
                          ? "bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shadow shadow-indigo-950/50 hover:scale-102"
                          : "bg-slate-950 border border-slate-900 text-slate-500 cursor-not-allowed"
                      }`}
                    >
                      <Send size={14} />
                    </button>

                  </form>
                )}
              </div>
            </footer>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#020617]">
            <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-900 flex items-center justify-center text-slate-500 mb-4 animate-pulse">
              <MessageSquare size={26} />
            </div>
            <h2 className="text-base font-bold text-white mb-1.5">Sem conversa ativa</h2>
            <p className="text-xs text-slate-400 max-w-xs mb-4">
              Selecione uma pessoa no Diretório ou inicie um chat inteligente com Gemini IA para testar a comunicação híbrida.
            </p>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all md:hidden"
            >
              Exibir Conversas e Diretório
            </button>
          </div>
        )}

      </main>

      {/* --- LIGHTBOX IMAGE POPUP DISPLAY --- */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out"
          onClick={() => setLightboxImage(null)}
        >
          <button 
            onClick={() => setLightboxImage(null)}
            className="absolute top-5 right-5 p-2 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-white rounded-xl cursor-pointer"
          >
            <X size={18} />
          </button>
          <img src={lightboxImage} alt="Fullscreen Attachment" className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />
        </div>
      )}

      {/* --- AI VOICE CALL OVERLAY --- */}
      {isVoiceCallActive && activeChat && (
        <VoiceCall
          botName={activeChat.name}
          botAvatar={activeChat.avatar || "🤖"}
          onSendMessage={async (msg: string) => {
            const response = await apiClient.sendMessage(activeChatId!, {
              type: "text",
              content: msg
            });
            // Fetch messages updates
            const msgs = await apiClient.getMessages(activeChatId!);
            setMessages(msgs);
            return response.replyMsg?.content || "Sem resposta.";
          }}
          onClose={() => setIsVoiceCallActive(false)}
        />
      )}

      {/* --- MODAL: CREATE GROUP CHAT (2+ Members) --- */}
      {showCreateGroup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 w-full max-w-md shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-150 text-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Users size={16} className="text-indigo-400" />
                <span>Criar Novo Grupo de Papo (Mais de 2 pessoas)</span>
              </h3>
              <button
                onClick={() => setShowCreateGroup(false)}
                className="p-1 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Nome do Grupo</label>
              <input
                type="text"
                placeholder="Ex: Equipe de Engenharia, Papo de Amigos"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500/50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Selecione os membros (Min. 2 pessoas)</label>
              <div className="max-h-40 overflow-y-auto border border-slate-900 bg-slate-950 p-2 rounded-xl space-y-1.5 custom-scrollbar">
                {peopleList.map((p) => {
                  if (p.id === "user-me") return null;
                  const isChecked = selectedGroupMembers.includes(p.id);

                  return (
                    <label key={p.id} className="flex items-center gap-2.5 p-2 hover:bg-slate-900 rounded-lg cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setSelectedGroupMembers(prev => prev.filter(id => id !== p.id));
                          } else {
                            setSelectedGroupMembers(prev => [...prev, p.id]);
                          }
                        }}
                        className="rounded border-slate-800 text-indigo-600 focus:ring-0"
                      />
                      <img src={p.avatar} alt={p.name} className="w-6 h-6 rounded object-cover" />
                      <span className="font-semibold text-slate-200">{p.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateGroup(false)}
                className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 rounded-xl text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCreateGroup}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-950/40"
              >
                Criar Grupo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: CREATE BOT (AI Assistant) --- */}
      {showCreateBot && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 w-full max-w-md shadow-2xl flex flex-col gap-4 text-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Bot size={16} className="text-violet-400" />
                <span>Adicionar Nova IA Customizada</span>
              </h3>
              <button
                onClick={() => setShowCreateBot(false)}
                className="p-1 rounded-lg hover:bg-slate-900 text-slate-400"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 flex flex-col gap-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase">Nome da IA</label>
                <input
                  type="text"
                  placeholder="Ex: Professor de Matemática"
                  value={newBotName}
                  onChange={(e) => setNewBotName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500/50"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase">Avatar Emoji</label>
                <input
                  type="text"
                  value={newBotAvatar}
                  onChange={(e) => setNewBotAvatar(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-center text-white outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Instruções de Sistema (Comportamento)</label>
              <textarea
                placeholder="Ex: Você é um professor amigável que explica conceitos com metáforas divertidas e nunca dá a resposta de primeira."
                value={newBotInstructions}
                onChange={(e) => setNewBotInstructions(e.target.value)}
                rows={4}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-500/50 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateBot(false)}
                className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 rounded-xl text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCreateBot}
                className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold"
              >
                Configurar IA
              </button>
            </div>
            
            <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-slate-800/80">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Ou crie com 1 clique:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleQuickCreateBot("Tutor de Inglês", "🇬🇧", "Você é um tutor de inglês nativo. Ajude-me a praticar conversação corrigindo meus erros e sugerindo vocabulário mais natural. Fale apenas em inglês.")}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-violet-900/30 border border-slate-800 hover:border-violet-800/50 text-left transition-colors cursor-pointer group"
                >
                  <span className="text-xs font-bold text-slate-200 block group-hover:text-violet-300">🇬🇧 Tutor de Inglês</span>
                  <span className="text-[9px] text-slate-500 block truncate">Pratique conversação...</span>
                </button>
                <button
                  onClick={() => handleQuickCreateBot("Assistente de Código", "💻", "Você é um engenheiro de software sênior especialista em Next.js e Tailwind. Ajude-me a escrever e revisar código, fornecendo exemplos limpos e explicando a lógica.")}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-violet-900/30 border border-slate-800 hover:border-violet-800/50 text-left transition-colors cursor-pointer group"
                >
                  <span className="text-xs font-bold text-slate-200 block group-hover:text-violet-300">💻 Assist. de Código</span>
                  <span className="text-[9px] text-slate-500 block truncate">Revise códigos...</span>
                </button>
                <button
                  onClick={() => handleQuickCreateBot("Psicólogo IA", "🛋️", "Você é um ouvinte empático e calmo. Ofereça conselhos amigáveis e acolhedores, sem julgamentos. Use tom suave.")}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-violet-900/30 border border-slate-800 hover:border-violet-800/50 text-left transition-colors cursor-pointer group"
                >
                  <span className="text-xs font-bold text-slate-200 block group-hover:text-violet-300">🛋️ Psicólogo IA</span>
                  <span className="text-[9px] text-slate-500 block truncate">Apoio emocional...</span>
                </button>
                <button
                  onClick={() => handleQuickCreateBot("Redator Criativo", "✍️", "Você é um redator criativo especialista em marketing. Escreva posts, emails e roteiros inovadores com gatilhos mentais efetivos.")}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-violet-900/30 border border-slate-800 hover:border-violet-800/50 text-left transition-colors cursor-pointer group"
                >
                  <span className="text-xs font-bold text-slate-200 block group-hover:text-violet-300">✍️ Redator Criativo</span>
                  <span className="text-[9px] text-slate-500 block truncate">Posts, emails e ideias...</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- MODAL: CREATE USER --- */}
      {showCreateUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 w-full max-w-sm shadow-2xl flex flex-col gap-4 text-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <User size={16} className="text-indigo-400" />
                <span>Registrar Nova Pessoa no Diretório</span>
              </h3>
              <button
                onClick={() => setShowCreateUser(false)}
                className="p-1 rounded-lg hover:bg-slate-900 text-slate-400"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Nome Completo</label>
              <input
                type="text"
                placeholder="Ex: João Silva"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500/50"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateUser(false)}
                className="px-3.5 py-2.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCreateUser}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: SETTINGS (REAL FUNCTIONALITIES) --- */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl flex flex-col gap-5 text-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Settings size={18} className="text-indigo-400" />
                <span>Configurações</span>
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1.5">
                  <UserIcon size={12} />
                  Nome de Exibição
                </label>
                <input
                  type="text"
                  value={myUserName}
                  onChange={(e) => setMyUserName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500/50"
                  placeholder="Seu nome"
                />
              </div>

              <div className="flex items-center justify-between bg-slate-900/50 p-3 rounded-xl border border-slate-800/50">
                <div className="flex items-center gap-2.5">
                  <Bell size={16} className="text-slate-400" />
                  <span className="text-xs font-semibold">Notificações</span>
                </div>
                <button
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`w-9 h-5 rounded-full relative transition-colors ${notificationsEnabled ? "bg-indigo-600" : "bg-slate-700"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${notificationsEnabled ? "translate-x-4" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between bg-slate-900/50 p-3 rounded-xl border border-slate-800/50">
                <div className="flex items-center gap-2.5">
                  <Moon size={16} className="text-slate-400" />
                  <span className="text-xs font-semibold">Modo Escuro (Padrão)</span>
                </div>
                <div className="px-2 py-0.5 bg-slate-800 rounded text-[10px] font-bold text-slate-400">Ativo</div>
              </div>

              <div className="pt-2 border-t border-slate-800/50">
                <button
                  onClick={handleDeleteAllChats}
                  className="w-full p-2.5 bg-rose-950/20 hover:bg-rose-950/50 border border-rose-900/40 text-rose-400 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>Apagar todas as conversas e dados</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-950/40 transition-colors"
              >
                Guardar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
