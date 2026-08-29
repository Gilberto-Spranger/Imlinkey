// =====================================================
// Types & Interfaces
// =====================================================

export interface Link {
  id: string;
  title: string;
  link_url: string;
  platform: LinkPlatform;
  category: LinkCategory;
  icon: string;
  click_count: number;
  created_at: string;
  updated_at: string;
}

// =====================================================
// Enums
// =====================================================

export enum LinkPlatform {
  KORDDYFIRE = "korddyfire",
  FACEBOOK = "facebook",
  INSTAGRAM = "instagram",
  X = "x",
  TIKTOK = "tiktok",
  SNAPCHAT = "snapchat",
  PINTEREST = "pinterest",
  LINKEDIN = "linkedin",
  REDDIT = "reddit",
  THREADS = "threads",
  BLUESKY = "bluesky",
  MASTODON = "mastodon",
  TELEGRAM = "telegram",
  DISCORD = "discord",
  WHATSAPP = "whatsapp",
  YOUTUBE = "youtube",
  TWITCH = "twitch",
  VIMEO = "vimeo",
  DAILYMOTION = "dailymotion",
  KIWIFY = "kiwify",
  HOTMART = "hotmart",
  SOUNDCLOUD = "soundcloud",
  SPOTIFY = "spotify",
  APPLE_MUSIC = "apple_music",
  DEEZER = "deezer",
  PAYPAL = "paypal",
  TIDAL = "tidal",
  GITHUB = "github",
  GITLAB = "gitlab",
  BITBUCKET = "bitbucket",
  PATREON = "patreon",
  ONLYFANS = "onlyfans",
  KO_FI = "ko_fi",
  SUBSTACK = "substack",
  MEDIUM = "medium",
  BEHANCE = "behance",
  DRIBBBLE = "dribbble",
  AMAZON = "amazon",
  EBAY = "ebay",
  ETSY = "etsy",
  SHOPIFY = "shopify",
  STRIPE = "stripe",
  MPESA = "mpesa",
  BINANCE = "binance",
  STEAM = "steam",
  EPIC_GAMES = "epic_games",
  PLAYSTATION = "playstation",
  XBOX = "xbox",
  NINTENDO = "nintendo",
  RIOT_GAMES = "riot_games",
  BATTLE_NET = "battle_net",
  ROBLOX = "roblox"
}

export enum LinkCategory {
  SOCIAL = "social",
  MUSIC = "music",
  VIDEO = "video",
  DEV = "dev",
  ECOMMERCE = "ecommerce",
  FINANCE = "finance",
  GAMING = "gaming"
}


// =====================================================
// DTOs (Data Transfer Objects)
// =====================================================

export interface CreateLinkData {
  title: string;
  link_url: string;
  platform: LinkPlatform;
  category: LinkCategory;
  icon: string;
}

// usando `type` em vez de `interface` para evitar ESLint warning
export type UpdateLinkData = Partial<CreateLinkData>;