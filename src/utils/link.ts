import {
  LinkPlatform,
  LinkCategory,
  CreateLinkData,
  Link
} from "@/types";

// =====================================================
// Icon Enum
// =====================================================

export const LinkPlatformIcon: Record<LinkPlatform, string> = {
  [LinkPlatform.KORDDYFIRE]: "/icon/korddyfire.png",
  [LinkPlatform.FACEBOOK]: "/icon/facebook.png",
  [LinkPlatform.INSTAGRAM]: "/icon/instagram.png",
  [LinkPlatform.X]: "/icon/x.png",
  [LinkPlatform.TIKTOK]: "/icon/tiktok.png",
  [LinkPlatform.SNAPCHAT]: "/icon/snapchat.png",
  [LinkPlatform.PINTEREST]: "/icon/pinterest.png",
  [LinkPlatform.LINKEDIN]: "/icon/linkedin.png",
  [LinkPlatform.REDDIT]: "/icon/reddit.png",
  [LinkPlatform.THREADS]: "/icon/threads.png",
  [LinkPlatform.BLUESKY]: "/icon/bluesky.png",
  [LinkPlatform.MASTODON]: "/icon/mastodon.png",
  [LinkPlatform.TELEGRAM]: "/icon/telegram.png",
  [LinkPlatform.DISCORD]: "/icon/discord.png",
  [LinkPlatform.WHATSAPP]: "/icon/whatsapp.png",
  [LinkPlatform.YOUTUBE]: "/icon/youtube.png",
  [LinkPlatform.TWITCH]: "/icon/twitch.png",
  [LinkPlatform.VIMEO]: "/icon/vimeo.png",
  [LinkPlatform.DAILYMOTION]: "/icon/dailymotion.png",
  [LinkPlatform.KIWIFY]: "/icon/kiwify.png",
  [LinkPlatform.HOTMART]: "/icon/hotmart.png",
  [LinkPlatform.SOUNDCLOUD]: "/icon/soundcloud.png",
  [LinkPlatform.SPOTIFY]: "/icon/spotify.png",
  [LinkPlatform.APPLE_MUSIC]: "/icon/apple_music.png",
  [LinkPlatform.DEEZER]: "/icon/deezer.png",
  [LinkPlatform.PAYPAL]: "/icon/paypal.png",
  [LinkPlatform.TIDAL]: "/icon/tidal.png",
  [LinkPlatform.GITHUB]: "/icon/github.png",
  [LinkPlatform.GITLAB]: "/icon/gitlab.png",
  [LinkPlatform.BITBUCKET]: "/icon/bitbucket.png",
  [LinkPlatform.PATREON]: "/icon/patreon.png",
  [LinkPlatform.ONLYFANS]: "/icon/onlyfans.png",
  [LinkPlatform.KO_FI]: "/icon/ko_fi.png",
  [LinkPlatform.SUBSTACK]: "/icon/substack.png",
  [LinkPlatform.MEDIUM]: "/icon/medium.png",
  [LinkPlatform.BEHANCE]: "/icon/behance.png",
  [LinkPlatform.DRIBBBLE]: "/icon/dribbble.png",
  [LinkPlatform.AMAZON]: "/icon/amazon.png",
  [LinkPlatform.EBAY]: "/icon/ebay.png",
  [LinkPlatform.ETSY]: "/icon/etsy.png",
  [LinkPlatform.SHOPIFY]: "/icon/shopify.png",
  [LinkPlatform.STRIPE]: "/icon/stripe.png",
  [LinkPlatform.MPESA]: "/icon/mpesa.png",
  [LinkPlatform.BINANCE]: "/icon/binance.png",
  [LinkPlatform.STEAM]: "/icon/steam.png",
  [LinkPlatform.EPIC_GAMES]: "/icon/epic_games.png",
  [LinkPlatform.PLAYSTATION]: "/icon/playstation.png",
  [LinkPlatform.XBOX]: "/icon/xbox.png",
  [LinkPlatform.NINTENDO]: "/icon/nintendo.png",
  [LinkPlatform.RIOT_GAMES]: "/icon/riot_games.png",
  [LinkPlatform.BATTLE_NET]: "/icon/battle_net.png",
  [LinkPlatform.ROBLOX]: "/icon/roblox.png"
};

// =====================================================
// Helper function to get icon path
// =====================================================

export function getPlatformIcon(platform: LinkPlatform): string {
  return LinkPlatformIcon[platform];
}

// =====================================================
// Platform to Category mapping
// =====================================================

export const PlatformCategoryMap: Record<LinkPlatform, LinkCategory> = {
  [LinkPlatform.KORDDYFIRE]: LinkCategory.SOCIAL,
  [LinkPlatform.FACEBOOK]: LinkCategory.SOCIAL,
  [LinkPlatform.INSTAGRAM]: LinkCategory.SOCIAL,
  [LinkPlatform.X]: LinkCategory.SOCIAL,
  [LinkPlatform.TIKTOK]: LinkCategory.SOCIAL,
  [LinkPlatform.SNAPCHAT]: LinkCategory.SOCIAL,
  [LinkPlatform.PINTEREST]: LinkCategory.SOCIAL,
  [LinkPlatform.LINKEDIN]: LinkCategory.SOCIAL,
  [LinkPlatform.REDDIT]: LinkCategory.SOCIAL,
  [LinkPlatform.THREADS]: LinkCategory.SOCIAL,
  [LinkPlatform.BLUESKY]: LinkCategory.SOCIAL,
  [LinkPlatform.MASTODON]: LinkCategory.SOCIAL,
  [LinkPlatform.TELEGRAM]: LinkCategory.SOCIAL,
  [LinkPlatform.DISCORD]: LinkCategory.SOCIAL,
  [LinkPlatform.WHATSAPP]: LinkCategory.SOCIAL,
  [LinkPlatform.YOUTUBE]: LinkCategory.VIDEO,
  [LinkPlatform.TWITCH]: LinkCategory.VIDEO,
  [LinkPlatform.VIMEO]: LinkCategory.VIDEO,
  [LinkPlatform.DAILYMOTION]: LinkCategory.VIDEO,
  [LinkPlatform.SOUNDCLOUD]: LinkCategory.MUSIC,
  [LinkPlatform.SPOTIFY]: LinkCategory.MUSIC,
  [LinkPlatform.APPLE_MUSIC]: LinkCategory.MUSIC,
  [LinkPlatform.DEEZER]: LinkCategory.MUSIC,
  [LinkPlatform.TIDAL]: LinkCategory.MUSIC,
  [LinkPlatform.GITHUB]: LinkCategory.DEV,
  [LinkPlatform.GITLAB]: LinkCategory.DEV,
  [LinkPlatform.BITBUCKET]: LinkCategory.DEV,
  [LinkPlatform.KIWIFY]: LinkCategory.ECOMMERCE,
  [LinkPlatform.HOTMART]: LinkCategory.ECOMMERCE,
  [LinkPlatform.PATREON]: LinkCategory.ECOMMERCE,
  [LinkPlatform.ONLYFANS]: LinkCategory.ECOMMERCE,
  [LinkPlatform.KO_FI]: LinkCategory.ECOMMERCE,
  [LinkPlatform.SUBSTACK]: LinkCategory.ECOMMERCE,
  [LinkPlatform.MEDIUM]: LinkCategory.ECOMMERCE,
  [LinkPlatform.BEHANCE]: LinkCategory.ECOMMERCE,
  [LinkPlatform.DRIBBBLE]: LinkCategory.ECOMMERCE,
  [LinkPlatform.AMAZON]: LinkCategory.ECOMMERCE,
  [LinkPlatform.EBAY]: LinkCategory.ECOMMERCE,
  [LinkPlatform.ETSY]: LinkCategory.ECOMMERCE,
  [LinkPlatform.SHOPIFY]: LinkCategory.ECOMMERCE,
  [LinkPlatform.PAYPAL]: LinkCategory.FINANCE,
  [LinkPlatform.STRIPE]: LinkCategory.FINANCE,
  [LinkPlatform.MPESA]: LinkCategory.FINANCE,
  [LinkPlatform.BINANCE]: LinkCategory.FINANCE,
  [LinkPlatform.STEAM]: LinkCategory.GAMING,
  [LinkPlatform.EPIC_GAMES]: LinkCategory.GAMING,
  [LinkPlatform.PLAYSTATION]: LinkCategory.GAMING,
  [LinkPlatform.XBOX]: LinkCategory.GAMING,
  [LinkPlatform.NINTENDO]: LinkCategory.GAMING,
  [LinkPlatform.RIOT_GAMES]: LinkCategory.GAMING,
  [LinkPlatform.BATTLE_NET]: LinkCategory.GAMING,
  [LinkPlatform.ROBLOX]: LinkCategory.GAMING
};

// =====================================================
// Utility Functions
// =====================================================

export function getCategoryByPlatform(platform: LinkPlatform): LinkCategory {
  return PlatformCategoryMap[platform];
}

export function createLinkWithDefaults(data: CreateLinkData): Omit<Link, 'id' | 'click_count' | 'created_at' | 'updated_at'> {
  return {
    title: data.title,
    link_url: data.link_url,
    platform: data.platform,
    category: data.category,
    icon: data.icon || getPlatformIcon(data.platform)
  };
}

export function formatClickCount(count: number): string {
  if (count < 1_000) return count.toString();
  if (count < 1_000_000) return (count / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  if (count < 1_000_000_000) return (count / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (count < 1_000_000_000_000) return (count / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  if (count < 1_000_000_000_000_000) return (count / 1_000_000_000_000).toFixed(1).replace(/\.0$/, '') + 'T';
  if (count < 1_000_000_000_000_000_000) return (count / 1_000_000_000_000_000).toFixed(1).replace(/\.0$/, '') + 'Qa';
  if (count < 1_000_000_000_000_000_000_000) return (count / 1_000_000_000_000_000_000).toFixed(1).replace(/\.0$/, '') + 'Qi';
  if (count < 1_000_000_000_000_000_000_000_000) return (count / 1_000_000_000_000_000_000_000).toFixed(1).replace(/\.0$/, '') + 'Sx';
  if (count < 1_000_000_000_000_000_000_000_000_000) return (count / 1_000_000_000_000_000_000_000_000).toFixed(1).replace(/\.0$/, '') + 'Sp';
  if (count < 1_000_000_000_000_000_000_000_000_000_000) return (count / 1_000_000_000_000_000_000_000_000_000).toFixed(1).replace(/\.0$/, '') + 'Oc';
  if (count < 1_000_000_000_000_000_000_000_000_000_000_000) return (count / 1_000_000_000_000_000_000_000_000_000_000).toFixed(1).replace(/\.0$/, '') + 'No';
  if (count < 1_000_000_000_000_000_000_000_000_000_000_000_000) return (count / 1_000_000_000_000_000_000_000_000_000_000_000).toFixed(1).replace(/\.0$/, '') + 'Dc';
  if (count < 1_000_000_000_000_000_000_000_000_000_000_000_000_000) return (count / 1_000_000_000_000_000_000_000_000_000_000_000_000).toFixed(1).replace(/\.0$/, '') + 'Ud';

  return (count / 1_000_000_000_000_000_000_000_000_000_000_000_000_000).toFixed(1).replace(/\.0$/, '') + 'Dd';
}
