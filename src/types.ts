export type UserRole = 'fan' | 'creator';

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  role: UserRole;
  walletBalance: number;
  isVerified: boolean;
  ghostMode: boolean;
  watermarkProtection: boolean;
  e2eeKeyFingerprint: string;
}

export interface Creator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  banner: string;
  bio: string;
  category: string;
  isVerified: boolean;
  subscribersCount: number;
  likesCount: number;
  postsCount: number;
  mediaCount: number;
  subscriptionPrice: number; // Monthly price in USD
  tiers: SubscriptionTier[];
  joinedDate: string;
  location?: string;
  website?: string;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  period: string; // '1 mes', '3 meses (-15%)', '1 año (-30%)'
  discount?: number;
  perks: string[];
}

export interface Post {
  id: string;
  creatorId: string;
  creator: {
    name: string;
    username: string;
    avatar: string;
    isVerified: boolean;
  };
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'gallery';
  galleryUrls?: string[];
  isLocked: boolean;
  unlockPrice?: number; // Price to unlock individual PPV post
  createdAt: string;
  likes: number;
  commentsCount: number;
  tipsTotal: number;
  isLikedByMe?: boolean;
  isUnlockedByMe?: boolean;
  isSubscribedCreator?: boolean;
  moderation: ModerationStatus;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userUsername: string;
  userAvatar: string;
  text: string;
  createdAt: string;
  likes: number;
}

export interface ModerationStatus {
  approved: boolean;
  confidence: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  moderationTag: 'VERIFIED_SAFE' | 'REQUIRES_REVIEW' | 'REJECTED';
  explanation: string;
  verifiedAt: string;
}

export interface EncryptedMessage {
  id: string;
  senderId: string;
  receiverId: string;
  ciphertext: string;
  plaintext: string; // Decrypted representation for local view
  iv: string;
  algorithm: string;
  timestamp: string;
  isLocked?: boolean;
  unlockPrice?: number;
  isUnlocked?: boolean;
  mediaUrl?: string;
}

export interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    isVerified: boolean;
    isOnline: boolean;
    lastSeen?: string;
  };
  lastMessage?: string;
  lastTimestamp?: string;
  unreadCount: number;
  e2eeFingerprint: string;
  messages: EncryptedMessage[];
}

export interface NotificationItem {
  id: string;
  type: 'subscription' | 'tip' | 'post' | 'message' | 'system' | 'moderation';
  title: string;
  message: string;
  avatar?: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface AnalyticsData {
  totalRevenue: number;
  netEarnings: number; // 80%
  activeSubscribers: number;
  totalTips: number;
  ppvSales: number;
  chartData: { date: string; earnings: number; views: number; subs: number }[];
  topFans: {
    name: string;
    username: string;
    avatar: string;
    spentTotal: number;
    badge: string;
  }[];
}

export interface PaymentTransaction {
  id: string;
  amount: number;
  currency: string;
  type: 'subscription' | 'ppv_unlock' | 'tip' | 'wallet_topup' | 'payout';
  description: string;
  date: string;
  status: 'COMPLETED' | 'PENDING' | 'REFUNDED';
  method: 'CARD' | 'CRYPTO_USDT' | 'CRYPTO_BTC' | 'WALLET';
}
