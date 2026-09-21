import React, { useState, useEffect } from 'react';
import {
  initialCurrentUser,
  initialCreators,
  initialPosts,
  initialConversations,
  initialAnalytics,
  initialNotifications,
} from './mockData';
import {
  User,
  Creator,
  Post,
  Conversation,
  EncryptedMessage,
  AnalyticsData,
  NotificationItem,
  ModerationStatus,
  Comment,
} from './types';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { Feed } from './components/Feed';
import { CreatorProfile } from './components/CreatorProfile';
import { CreatorDashboard } from './components/CreatorDashboard';
import { MessagesE2EE } from './components/MessagesE2EE';
import { PushNotificationManager } from './components/PushNotificationManager';
import { PrivacySettingsModal } from './components/PrivacySettingsModal';
import { LockKeyModal } from './components/LockKeyModal';
import { PaymentModal, PaymentPurpose } from './components/PaymentModal';
import { NewPostModal } from './components/NewPostModal';
import { encryptE2EEMessage } from './utils/crypto';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState(true);

  // App Navigation state
  const [activeTab, setActiveTab] = useState<ActiveTab>('feed');

  // Core Data States
  const [currentUser, setCurrentUser] = useState<User>(initialCurrentUser);
  const [creators, setCreators] = useState<Creator[]>(initialCreators);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [analytics, setAnalytics] = useState<AnalyticsData>(initialAnalytics);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  // Subscribed Creators Tracking
  const [subscribedCreatorIds, setSubscribedCreatorIds] = useState<string[]>(['creator_1']);

  // Selected Creator for Profile View
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>('creator_1');

  // Active E2EE Conversation ID
  const [activeConversationId, setActiveConversationId] = useState<string>('conv_1');

  // Modal States
  const [activePaymentPurpose, setActivePaymentPurpose] = useState<PaymentPurpose | null>(null);
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [isLockKeyModalOpen, setIsLockKeyModalOpen] = useState(false);

  // Real-time Push Notification Toast
  const [activePushToast, setActivePushToast] = useState<NotificationItem | null>(null);

  // Dark mode effect on document body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Push notification simulation for engagement
  useEffect(() => {
    const timer = setTimeout(() => {
      const samplePush: NotificationItem = {
        id: 'push_' + Date.now(),
        type: 'tip',
        title: '¡Nueva Propina Recibida! 💸',
        message: '@carlos_vip te acaba de enviar una propina de $25.00 con un mensaje de aprecio.',
        timestamp: 'Ahora mismo',
        isRead: false,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      };
      setNotifications((prev) => [samplePush, ...prev]);
      setActivePushToast(samplePush);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  // --- Handlers ---

  // Handle Post Unlock (PPV purchase)
  const handleUnlockPost = (post: Post) => {
    setActivePaymentPurpose({
      type: 'ppv_unlock',
      postId: post.id,
      title: post.content.substring(0, 30) + '...',
      price: post.unlockPrice || 10,
      creatorUsername: post.creator.username,
    });
  };

  // Handle Send Tip to Creator
  const handleSendTip = (post: Post) => {
    setActivePaymentPurpose({
      type: 'tip',
      creatorName: post.creator.name,
      creatorUsername: post.creator.username,
      price: 10, // Default tip
    });
  };

  // Handle Creator Subscription Click
  const handleSubscribeToCreator = (creator: Creator, tierName?: string, tierPrice?: number) => {
    setActivePaymentPurpose({
      type: 'subscription',
      creatorName: creator.name,
      creatorUsername: creator.username,
      tierName: tierName || 'Suscripción Mensual',
      price: tierPrice || creator.subscriptionPrice,
    });
  };

  // Handle Successful Payment Gateway Transaction
  const handlePaymentSuccess = (amount: number, method: string, purpose: PaymentPurpose) => {
    // 1. Deduct wallet if paid via wallet
    if (method === 'WALLET') {
      setCurrentUser((prev) => ({
        ...prev,
        walletBalance: Math.max(0, prev.walletBalance - amount),
      }));
    }

    // 2. Perform business logic depending on purpose
    if (purpose.type === 'ppv_unlock') {
      setPosts((prev) =>
        prev.map((p) => (p.id === purpose.postId ? { ...p, isUnlockedByMe: true } : p))
      );
      // Trigger push notification confirmation
      triggerPush(
        'Contenido Desbloqueado 🔓',
        `Has adquirido acceso exclusivo con éxito mediante ${method}.`,
        'post'
      );
    } else if (purpose.type === 'subscription') {
      const creator = creators.find((c) => c.username === purpose.creatorUsername);
      if (creator && !subscribedCreatorIds.includes(creator.id)) {
        setSubscribedCreatorIds((prev) => [...prev, creator.id]);
        setCreators((prev) =>
          prev.map((c) => (c.id === creator.id ? { ...c, subscribersCount: c.subscribersCount + 1 } : c))
        );
      }
      triggerPush(
        '¡Suscripción Activada! 🌟',
        `Ya tienes acceso VIP a todas las publicaciones y fotos de @${purpose.creatorUsername}.`,
        'subscription'
      );
    } else if (purpose.type === 'tip') {
      // Update creator analytics if user is the creator
      setAnalytics((prev) => ({
        ...prev,
        totalRevenue: prev.totalRevenue + amount,
        totalTips: prev.totalTips + amount,
        netEarnings: prev.netEarnings + amount * 0.8,
      }));
      triggerPush(
        'Propina Enviada ✨',
        `Has agradecido a @${purpose.creatorUsername} con una propina de $${amount.toFixed(2)}.`,
        'tip'
      );
    } else if (purpose.type === 'wallet_topup') {
      setCurrentUser((prev) => ({
        ...prev,
        walletBalance: prev.walletBalance + amount,
      }));
      triggerPush(
        '¡Saldo Recargado! 💳',
        `Has añadido $${amount.toFixed(2)} USD a tu Billetera mesigues con éxito.`,
        'tip'
      );
    }

    // Close modal
    setActivePaymentPurpose(null);
  };

  // Handle New Post Creation (Already passed server AI moderation)
  const handlePublishPost = (postData: {
    content: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
    isLocked: boolean;
    unlockPrice?: number;
    moderation: ModerationStatus;
  }) => {
    const newPost: Post = {
      id: 'post_' + Date.now(),
      creatorId: currentUser.id,
      creator: {
        name: currentUser.name,
        username: currentUser.username,
        avatar: currentUser.avatar,
        isVerified: currentUser.isVerified,
      },
      createdAt: 'Hace un momento',
      content: postData.content,
      mediaUrl: postData.mediaUrl,
      mediaType: postData.mediaType,
      isLocked: postData.isLocked,
      isUnlockedByMe: true, // Creator sees own post unlocked
      unlockPrice: postData.unlockPrice,
      likes: 1,
      commentsCount: 0,
      tipsTotal: 0,
      moderation: postData.moderation,
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setIsNewPostOpen(false);

    // Trigger confirmation push
    triggerPush(
      'Publicación Aprobada & Publicada 🛡️',
      'Tu contenido ha pasado la auditoría de moderación de IA con éxito y ya está disponible en el feed.',
      'moderation'
    );
  };

  // Handle Post Likes
  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = p.isLikedByMe;
          return {
            ...p,
            isLikedByMe: !isLiked,
            likes: isLiked ? p.likes - 1 : p.likes + 1,
          };
        }
        return p;
      })
    );
  };

  // Handle Post Comments
  const handleAddComment = (postId: string, text: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newComment: Comment = {
            id: 'comment_' + Date.now(),
            userId: currentUser.id,
            userName: currentUser.name,
            userUsername: currentUser.username,
            userAvatar: currentUser.avatar,
            text,
            createdAt: 'Ahora',
            likes: 0,
          };
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...(p.comments || []), newComment],
          };
        }
        return p;
      })
    );
  };

  // Handle Sending E2EE Encrypted Message
  const handleSendMessage = async (
    convId: string,
    plaintext: string,
    mediaUrl?: string,
    unlockPrice?: number
  ) => {
    const { ciphertextHex, ivHex } = await encryptE2EEMessage(plaintext);
    const targetConv = conversations.find((c) => c.id === convId);

    const newMsg: EncryptedMessage = {
      id: 'msg_' + Date.now(),
      senderId: currentUser.id,
      receiverId: targetConv ? targetConv.participant.id : 'unknown',
      plaintext,
      ciphertext: ciphertextHex,
      iv: ivHex,
      algorithm: 'AES-GCM-256',
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      mediaUrl,
      isLocked: !!unlockPrice,
      isUnlocked: false,
      unlockPrice,
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === convId) {
          return {
            ...conv,
            lastMessage: plaintext,
            lastTimestamp: 'Ahora',
            messages: [...conv.messages, newMsg],
          };
        }
        return conv;
      })
    );
  };

  // Handle Unlocking Message Media inside E2EE Chat
  const handleUnlockMessageMedia = (convId: string, messageId: string, price: number) => {
    const targetConv = conversations.find((c) => c.id === convId);
    setActivePaymentPurpose({
      type: 'ppv_unlock',
      postId: messageId,
      title: 'Contenido Privado E2EE en Chat',
      price,
      creatorUsername: targetConv ? targetConv.participant.username : 'creador',
    });
  };

  // Handle Mass PPV Blast from Creator Studio
  const handleSendMassPPV = (message: string, price: number) => {
    setAnalytics((prev) => ({
      ...prev,
      ppvSales: prev.ppvSales + price * 12,
      totalRevenue: prev.totalRevenue + price * 12,
      netEarnings: prev.netEarnings + price * 12 * 0.8,
    }));

    triggerPush(
      'Difusión Masiva PPV Enviada 🚀',
      `Mensaje encriptado E2EE enviado a 1,482 suscriptores con precio de desbloqueo $${price.toFixed(2)}.`,
      'post'
    );
  };

  // Handle Creator Payout Request
  const handleRequestPayout = (amount: number, method: 'BANK' | 'CRYPTO') => {
    setAnalytics((prev) => ({
      ...prev,
      netEarnings: Math.max(0, prev.netEarnings - amount),
    }));

    triggerPush(
      'Retiro Procesado 💳',
      `Se ha enviado la orden de transferencia de $${amount.toLocaleString()} vía ${method}.`,
      'tip'
    );
  };

  // Trigger Custom Push Alert helper
  const triggerPush = (title: string, message: string, type: NotificationItem['type'] = 'post') => {
    const newNotif: NotificationItem = {
      id: 'notif_' + Date.now(),
      type,
      title,
      message,
      timestamp: 'Ahora',
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    setActivePushToast(newNotif);
  };

  // Mark all notifications read
  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Update Privacy Settings
  const handleUpdatePrivacy = (updates: Partial<User>) => {
    setCurrentUser((prev) => ({ ...prev, ...updates }));
  };

  // Switch role between Creator and Fan
  const handleSwitchRole = () => {
    setCurrentUser((prev) => ({
      ...prev,
      role: prev.role === 'creator' ? 'fan' : 'creator',
    }));
  };

  // View Creator Profile Helper
  const handleViewCreator = (creatorId: string) => {
    setSelectedCreatorId(creatorId);
    setActiveTab('explore'); // Shows profile/explore view
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedCreator =
    creators.find((c) => c.id === selectedCreatorId) || creators[0];

  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div
      id="mesigues-app-root"
      className={`min-h-screen font-sans transition-colors duration-200 ${
        darkMode ? 'bg-[#0e1217] text-neutral-100' : 'bg-[#f4f6f8] text-neutral-900'
      }`}
    >
      {/* Top Main Navbar */}
      <Navbar
        currentUser={currentUser}
        unreadNotifications={unreadNotifCount}
        onOpenNewPost={() => setIsNewPostOpen(true)}
        onOpenWallet={() => setActiveTab('wallet')}
        onOpenPrivacy={() => setActiveTab('privacy')}
        onOpenKeyModal={() => setIsLockKeyModalOpen(true)}
        onOpenNotifications={() => setActiveTab('notifications')}
        onSearch={() => {}}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onSwitchRole={handleSwitchRole}
      />

      {/* Main Responsive Grid Layout */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pt-4 flex gap-6">
        {/* Left Desktop Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          currentUser={currentUser}
          unreadNotifications={unreadNotifCount}
          unreadMessages={1}
          onOpenNewPost={() => setIsNewPostOpen(true)}
          darkMode={darkMode}
        />

        {/* Central Dynamic View Area */}
        <main className="flex-1 min-w-0">
          {/* VIEW: MAIN FEED */}
          {activeTab === 'feed' && (
            <Feed
              posts={posts}
              creators={creators}
              currentUser={currentUser}
              subscribedCreatorIds={subscribedCreatorIds}
              onUnlockPost={handleUnlockPost}
              onSendTip={handleSendTip}
              onViewCreator={handleViewCreator}
              onToggleLike={handleToggleLike}
              onAddComment={handleAddComment}
              onOpenNewPost={() => setIsNewPostOpen(true)}
              onSubscribe={(creator) => handleSubscribeToCreator(creator)}
              darkMode={darkMode}
            />
          )}

          {/* VIEW: CREATOR PROFILE / EXPLORE */}
          {(activeTab === 'explore' || activeTab === 'subscriptions') && (
            <CreatorProfile
              creator={selectedCreator}
              posts={posts.filter((p) => p.creatorId === selectedCreator.id)}
              isSubscribed={subscribedCreatorIds.includes(selectedCreator.id)}
              onBack={() => setActiveTab('feed')}
              onSubscribe={(creator, tierIndex) => {
                const tier = creator.tiers[tierIndex ?? 0];
                handleSubscribeToCreator(creator, tier?.name, tier?.price);
              }}
              onSendTip={(creator) => {
                setActivePaymentPurpose({
                  type: 'tip',
                  creatorName: creator.name,
                  creatorUsername: creator.username,
                  price: 15,
                });
              }}
              onOpenDirectChat={(creator) => {
                setActiveTab('messages');
                const existingConv = conversations.find(
                  (c) => c.participant.id === creator.id
                );
                if (existingConv) setActiveConversationId(existingConv.id);
              }}
              onUnlockPost={handleUnlockPost}
              onToggleLike={handleToggleLike}
              onAddComment={handleAddComment}
              currentUsername={currentUser.username}
              isWatermarkEnabled={currentUser.watermarkProtection}
              darkMode={darkMode}
            />
          )}

          {/* VIEW: CREATOR STUDIO & ANALYTICS DASHBOARD */}
          {activeTab === 'creator-studio' && (
            <CreatorDashboard
              analytics={analytics}
              currentUser={currentUser}
              onSendMassPPV={handleSendMassPPV}
              onRequestPayout={handleRequestPayout}
              darkMode={darkMode}
            />
          )}

          {/* VIEW: MESSAGES WITH END-TO-END ENCRYPTION (E2EE) */}
          {activeTab === 'messages' && (
            <MessagesE2EE
              conversations={conversations}
              activeConvId={activeConversationId}
              onSelectConversation={setActiveConversationId}
              currentUser={currentUser}
              onSendMessage={handleSendMessage}
              onUnlockMessageMedia={handleUnlockMessageMedia}
              darkMode={darkMode}
            />
          )}

          {/* VIEW: PUSH NOTIFICATIONS CENTER */}
          {activeTab === 'notifications' && (
            <PushNotificationManager
              notifications={notifications}
              activeToast={null}
              onDismissToast={() => {}}
              onMarkAllAsRead={handleMarkAllNotificationsRead}
              onTriggerCustomPush={(title, message, type) => triggerPush(title, message, type)}
              darkMode={darkMode}
            />
          )}

          {/* VIEW: PRIVACY & ENCRYPTION SETTINGS */}
          {activeTab === 'privacy' && (
            <PrivacySettingsModal
              currentUser={currentUser}
              onUpdatePrivacy={handleUpdatePrivacy}
              darkMode={darkMode}
            />
          )}

          {/* VIEW: WALLET */}
          {activeTab === 'wallet' && (
            <div
              id="wallet-quick-view"
              className={`p-6 rounded-3xl border space-y-5 animate-fade-in ${
                darkMode ? 'bg-[#161b22] border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black">Billetera mesigues</h2>
                  <p className="text-xs text-neutral-400">
                    Fondos seguros para suscripciones, desbloqueo PPV y propinas instantáneas.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setActivePaymentPurpose({
                      type: 'wallet_topup',
                      price: 50,
                    })
                  }
                  className="px-5 py-2.5 rounded-full bg-[#00aff0] hover:bg-[#009fe0] text-white text-xs font-black shadow-md cursor-pointer transition-transform active:scale-95"
                >
                  + RECARGAR SALDO
                </button>
              </div>

              {/* Saldo Disponible Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#00aff0] to-blue-600 text-white shadow-lg flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider opacity-80 block">Saldo Disponible</span>
                  <span className="text-3xl sm:text-4xl font-black">${currentUser.walletBalance.toFixed(2)} USD</span>
                </div>
                <div className="text-right text-xs opacity-90">
                  <div className="font-mono">•••• •••• •••• 8921</div>
                  <div className="text-[10px] mt-1">Cifrado con tokenización PCI-DSS</div>
                </div>
              </div>

              {/* Fila de Selección Rápida de Montos ($10, $25, $50) debajo del Saldo */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Selección rápida de recarga:
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    Acreditación inmediata
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[10, 25, 50].map((amount) => (
                    <button
                      key={amount}
                      id={`btn-quick-wallet-${amount}`}
                      onClick={() =>
                        setActivePaymentPurpose({
                          type: 'wallet_topup',
                          price: amount,
                        })
                      }
                      className={`p-3.5 sm:p-4 rounded-2xl border text-center transition-all cursor-pointer font-black flex flex-col items-center justify-center gap-1 group shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] ${
                        darkMode
                          ? 'bg-[#10141b] hover:bg-[#18202b] border-neutral-700/80 hover:border-[#00aff0] text-white'
                          : 'bg-neutral-50 hover:bg-white border-neutral-200 hover:border-[#00aff0] text-neutral-900'
                      }`}
                      title={`Recargar $${amount} USD`}
                    >
                      <span className="text-xl sm:text-2xl font-black text-[#00aff0] group-hover:text-sky-400">
                        ${amount}
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                        Recargar
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        unreadNotifications={unreadNotifCount}
        unreadMessages={1}
        onOpenNewPost={() => setIsNewPostOpen(true)}
        darkMode={darkMode}
      />

      {/* Floating Web Push Toast Notification */}
      {activePushToast && (
        <PushNotificationManager
          notifications={notifications}
          activeToast={activePushToast}
          onDismissToast={() => setActivePushToast(null)}
          onMarkAllAsRead={handleMarkAllNotificationsRead}
          onTriggerCustomPush={(t, m, tp) => triggerPush(t, m, tp)}
          darkMode={darkMode}
        />
      )}

      {/* Secure Payment Gateway Modal (Card, 3D Secure, Crypto Web3, Wallet) */}
      {activePaymentPurpose && (
        <PaymentModal
          purpose={activePaymentPurpose}
          currentUser={currentUser}
          onClose={() => setActivePaymentPurpose(null)}
          onPaymentSuccess={handlePaymentSuccess}
          darkMode={darkMode}
        />
      )}

      {/* New Post Creator Modal with Live Gemini AI Moderation */}
      {isNewPostOpen && (
        <NewPostModal
          onClose={() => setIsNewPostOpen(false)}
          onPublish={handlePublishPost}
          darkMode={darkMode}
        />
      )}

      {/* Lock Key Modal (Clave del Candadito Visible) */}
      <LockKeyModal
        isOpen={isLockKeyModalOpen}
        onClose={() => setIsLockKeyModalOpen(false)}
        currentUser={currentUser}
        onUpdatePrivacy={handleUpdatePrivacy}
        onOpenFullPrivacy={() => {
          setIsLockKeyModalOpen(false);
          setActiveTab('privacy');
        }}
        darkMode={darkMode}
      />
    </div>
  );
}
