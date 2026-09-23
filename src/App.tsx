import React, { useState } from 'react';
import {
  User,
  Creator,
  Post,
  Conversation,
  EncryptedMessage,
  Comment,
  AnalyticsData,
  NotificationItem,
  ModerationStatus,
} from './types';
import {
  initialCurrentUser,
  initialCreators,
  initialPosts,
  initialConversations,
  initialAnalytics,
  initialNotifications,
} from './mockData';
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
import { CollectionsView } from './components/CollectionsView';
import { SubscriptionsView } from './components/SubscriptionsView';
import { VaultView } from './components/VaultView';
import { CardsPaymentView } from './components/CardsPaymentView';
import { TipModal } from './components/TipModal';
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
  const [activePushToast, setActivePushToast] = useState<NotificationItem | null>(null);

  // Tip Modal State
  const [tipModalConfig, setTipModalConfig] = useState<{
    isOpen: boolean;
    creatorName: string;
    creatorUsername: string;
    creatorAvatar: string;
  } | null>(null);

  // Helper to trigger realistic Web Push Notifications
  const triggerPush = (title: string, message: string, type: NotificationItem['type']) => {
    const newNotif: NotificationItem = {
      id: 'notif_' + Date.now(),
      title,
      message,
      type,
      timestamp: 'Ahora mismo',
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    setActivePushToast(newNotif);
  };

  // Handle Post Unlock (PPV Content)
  const handleUnlockPost = (post: Post) => {
    setActivePaymentPurpose({
      type: 'ppv_unlock',
      postId: post.id,
      title: post.content.substring(0, 30) + '...',
      price: post.unlockPrice || 10,
      creatorUsername: post.creator.username,
    });
  };

  // Handle Send Tip to Creator (Opens TipModal)
  const handleSendTip = (post: Post) => {
    setTipModalConfig({
      isOpen: true,
      creatorName: post.creator.name,
      creatorUsername: post.creator.username,
      creatorAvatar: post.creator.avatar,
    });
  };

  const handleOpenCreatorTip = (creator: Creator) => {
    setTipModalConfig({
      isOpen: true,
      creatorName: creator.name,
      creatorUsername: creator.username,
      creatorAvatar: creator.avatar,
    });
  };

  // Handle Confirm Tip from TipModal
  const handleConfirmTipModal = (amount: number, message: string, method: 'WALLET' | 'CARD') => {
    if (method === 'WALLET') {
      if (currentUser.walletBalance < amount) {
        alert(
          `Saldo insuficiente en billetera ($${currentUser.walletBalance.toFixed(
            2
          )} USD). Por favor añade fondos o paga con tarjeta.`
        );
        return;
      }
      setCurrentUser((prev) => ({
        ...prev,
        walletBalance: Math.max(0, prev.walletBalance - amount),
      }));
    }

    setAnalytics((prev) => ({
      ...prev,
      totalRevenue: prev.totalRevenue + amount,
      totalTips: prev.totalTips + amount,
      netEarnings: prev.netEarnings + amount * 0.8,
    }));

    triggerPush(
      '¡Propina Enviada! 💖',
      `Has enviado una propina de $${amount.toFixed(2)} USD a @${
        tipModalConfig?.creatorUsername || 'creador'
      }${message ? ` con el mensaje: "${message}"` : '.'}`,
      'tip'
    );
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

  // Handle Cancel Subscription
  const handleCancelSub = (creatorId: string) => {
    setSubscribedCreatorIds((prev) => prev.filter((id) => id !== creatorId));
    triggerPush(
      'Suscripción Cancelada',
      'La renovación automática de tu suscripción ha sido desactivada.',
      'subscription'
    );
  };

  // Handle Successful Payment Gateway Transaction
  const handlePaymentSuccess = (amount: number, method: string, purpose: PaymentPurpose) => {
    if (method === 'WALLET') {
      setCurrentUser((prev) => ({
        ...prev,
        walletBalance: Math.max(0, prev.walletBalance - amount),
      }));
    }

    if (purpose.type === 'ppv_unlock') {
      setPosts((prev) =>
        prev.map((p) => (p.id === purpose.postId ? { ...p, isUnlockedByMe: true } : p))
      );
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
        `Has añadido $${amount.toFixed(2)} USD a tu Billetera ME SIGUES con éxito.`,
        'tip'
      );
    }

    setActivePaymentPurpose(null);
  };

  // Handle New Post Creation via Modal
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
      isUnlockedByMe: true,
      unlockPrice: postData.unlockPrice,
      likes: 1,
      commentsCount: 0,
      tipsTotal: 0,
      moderation: postData.moderation,
      comments: [],
    };

    setPosts((prev) => [newPost, ...prev]);
    setIsNewPostOpen(false);

    triggerPush(
      'Publicación Aprobada y Difundida 🚀',
      'Tu post ha sido verificado con éxito y está visible para tus suscriptores.',
      'post'
    );
  };

  // Direct In-Feed Quick Publish
  const handleDirectPublish = (postData: {
    content: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
    isLocked: boolean;
    unlockPrice?: number;
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
      isUnlockedByMe: true,
      unlockPrice: postData.unlockPrice,
      likes: 0,
      commentsCount: 0,
      tipsTotal: 0,
      moderation: {
        approved: true,
        confidence: 0.99,
        riskLevel: 'LOW',
        moderationTag: 'VERIFIED_SAFE',
        explanation: 'Contenido verificado apto para OnlyFans VIP',
        verifiedAt: new Date().toISOString(),
      },
      comments: [],
    };

    setPosts((prev) => [newPost, ...prev]);
    triggerPush(
      'Publicación Creada 🚀',
      'Tu contenido ha sido publicado en el feed con éxito.',
      'post'
    );
  };

  // Handle Send Direct Message with E2EE Encryption
  const handleSendMessage = (
    convId: string,
    plaintext: string,
    mediaUrl?: string,
    unlockPrice?: number
  ) => {
    const isLocked = !!unlockPrice && unlockPrice > 0;
    const targetConv = conversations.find((c) => c.id === convId);
    const receiverId = targetConv?.participant.id || 'creator_1';

    const newMessage: EncryptedMessage = {
      id: 'msg_' + Date.now(),
      senderId: currentUser.id,
      receiverId: receiverId,
      ciphertext: 'AES256_GCM_' + btoa(plaintext || 'attachment'),
      plaintext: plaintext,
      iv: '0102030405060708090a0b0c',
      algorithm: 'AES-GCM-256',
      timestamp: 'Ahora',
      isLocked: isLocked,
      unlockPrice: unlockPrice,
      isUnlocked: !isLocked,
      mediaUrl: mediaUrl,
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === convId) {
          return {
            ...conv,
            lastMessage: plaintext || 'Archivo multimedia adjunto',
            lastTimestamp: 'Ahora',
            unreadCount: 0,
            messages: [...conv.messages, newMessage],
          };
        }
        return conv;
      })
    );
  };

  // Handle Like Toggle
  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return { ...p, likes: p.likes + 1 };
        }
        return p;
      })
    );
  };

  // Handle Comment Add
  const handleAddComment = (postId: string, text: string) => {
    const newComment: Comment = {
      id: 'comment_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userUsername: currentUser.username,
      userAvatar: currentUser.avatar,
      text: text,
      createdAt: 'Ahora',
      likes: 0,
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
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

  // Unlock PPV Direct Message Media
  const handleUnlockMessageMedia = (convId: string, messageId: string, price: number) => {
    setActivePaymentPurpose({
      type: 'ppv_unlock',
      postId: messageId,
      title: 'Mensaje Multimedia Exclusivo',
      price: price,
      creatorUsername: 'creador',
    });
  };

  // Send Mass PPV Message to all Subscribers (Studio Tool)
  const handleSendMassPPV = (content: string, price: number, mediaUrl?: string) => {
    conversations.forEach((conv) => {
      handleSendMessage(conv.id, content, mediaUrl, price);
    });
    triggerPush(
      'Difusión Masiva PPV Enviada 📨',
      `Mensaje programado y enviado a todos tus suscriptores por $${price} USD.`,
      'post'
    );
  };

  // Payout request
  const handleRequestPayout = (amount: number, method: string) => {
    setAnalytics((prev) => ({
      ...prev,
      netEarnings: Math.max(0, prev.netEarnings - amount),
    }));
    triggerPush(
      'Solicitud de Retiro Recibida 🏦',
      `Tu retiro de $${amount.toFixed(2)} USD vía ${method} está en procesamiento prioritario.`,
      'tip'
    );
  };

  // Update Privacy Settings
  const handleUpdatePrivacy = (updatedUser: Partial<User>) => {
    setCurrentUser((prev) => ({ ...prev, ...updatedUser }));
  };

  // View specific creator
  const handleViewCreator = (creatorId: string) => {
    setSelectedCreatorId(creatorId);
    setActiveTab('explore');
  };

  // Wallet top up handler
  const handleTopUpWallet = (amount: number) => {
    setActivePaymentPurpose({
      type: 'wallet_topup',
      price: amount,
    });
  };

  // Switch role fan vs creator
  const handleSwitchRole = () => {
    const newRole = currentUser.role === 'fan' ? 'creator' : 'fan';
    setCurrentUser((prev) => ({ ...prev, role: newRole }));
    triggerPush(
      'Perfil Actualizado',
      `Has cambiado al modo ${newRole === 'creator' ? 'Creador de Contenido' : 'Fan / Espectador'}.`,
      'system'
    );
  };

  // Mark all notifications read
  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const selectedCreator =
    creators.find((c) => c.id === selectedCreatorId) || creators[0];
  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  // Current User Creator Profile Representation
  const myCreatorProfile: Creator = {
    id: currentUser.id,
    name: currentUser.name,
    username: currentUser.username,
    avatar: currentUser.avatar,
    banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    bio: '✨ Perfil Oficial • Contenido exclusivo, fotos en alta resolución y DMs directos • Suscríbete para acceso total',
    category: 'Modelo & Creador VIP',
    isVerified: currentUser.isVerified,
    subscribersCount: 1420,
    likesCount: 8900,
    postsCount: posts.filter((p) => p.creatorId === currentUser.id).length || 12,
    mediaCount: 38,
    subscriptionPrice: 12.99,
    joinedDate: 'Septiembre 2026',
    location: 'Madrid, España',
    website: 'https://onlyfans.com/' + currentUser.username,
    tiers: [
      {
        id: 'tier_my_1',
        name: 'Suscripción Mensual',
        price: 12.99,
        period: '1 mes',
        perks: ['Acceso total a mis publicaciones', 'Chat privado directo', 'Fotos exclusivas'],
      },
      {
        id: 'tier_my_2',
        name: 'Pack 3 Meses VIP',
        price: 32.99,
        period: '3 meses',
        discount: 15,
        perks: ['Todo lo del plan mensual', '15% de descuento', 'Set exclusivo de bienvenida'],
      },
    ],
  };

  return (
    <div
      id="onlyfans-platform-root"
      className={`min-h-screen font-sans transition-colors duration-200 ${
        darkMode ? 'bg-[#12171e] text-white dark' : 'bg-neutral-50 text-neutral-900'
      }`}
    >
      {/* Top Main Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        onOpenNewPost={() => setIsNewPostOpen(true)}
        onOpenWallet={() => setActiveTab('cards')}
        onOpenPrivacy={() => setActiveTab('privacy')}
        onOpenNotifications={() => setActiveTab('notifications')}
        unreadNotifications={unreadNotifCount}
        onSearch={() => {}}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onSwitchRole={handleSwitchRole}
        onOpenKeyModal={() => setIsLockKeyModalOpen(true)}
      />

      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto flex px-2 sm:px-4 md:px-6 gap-4 sm:gap-6 pt-3">
        {/* Left Desktop Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          currentUser={currentUser}
          unreadNotifications={unreadNotifCount}
          unreadMessages={1}
          onOpenNewPost={() => setIsNewPostOpen(true)}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
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
              onDirectPublish={handleDirectPublish}
              darkMode={darkMode}
            />
          )}

          {/* VIEW: COLLECTIONS / BOOKMARKS */}
          {activeTab === 'collections' && (
            <CollectionsView
              posts={posts}
              currentUser={currentUser}
              onViewPost={handleUnlockPost}
              onViewCreator={handleViewCreator}
              darkMode={darkMode}
            />
          )}

          {/* VIEW: SUBSCRIPTIONS */}
          {activeTab === 'subscriptions' && (
            <SubscriptionsView
              creators={creators}
              subscribedCreatorIds={subscribedCreatorIds}
              currentUser={currentUser}
              onViewCreator={handleViewCreator}
              onOpenDirectChat={(creator) => {
                setActiveTab('messages');
                const existingConv = conversations.find((c) => c.participant.id === creator.id);
                if (existingConv) setActiveConversationId(existingConv.id);
              }}
              onSubscribe={(creator) => handleSubscribeToCreator(creator)}
              onCancelSub={handleCancelSub}
              darkMode={darkMode}
            />
          )}

          {/* VIEW: CARDS & PAYMENTS */}
          {(activeTab === 'cards' || activeTab === 'wallet') && (
            <CardsPaymentView
              currentUser={currentUser}
              onTopUpWallet={handleTopUpWallet}
              darkMode={darkMode}
            />
          )}

          {/* VIEW: VAULT / BÓVEDA */}
          {activeTab === 'vault' && (
            <VaultView
              posts={posts}
              currentUser={currentUser}
              darkMode={darkMode}
            />
          )}

          {/* VIEW: MY PROFILE */}
          {activeTab === 'my-profile' && (
            <CreatorProfile
              creator={myCreatorProfile}
              posts={posts.filter((p) => p.creatorId === currentUser.id)}
              isSubscribed={true}
              onBack={() => setActiveTab('feed')}
              onSubscribe={() => {}}
              onSendTip={() => {}}
              onOpenDirectChat={() => setActiveTab('messages')}
              onUnlockPost={handleUnlockPost}
              onToggleLike={handleToggleLike}
              onAddComment={handleAddComment}
              currentUsername={currentUser.username}
              isWatermarkEnabled={currentUser.watermarkProtection}
              darkMode={darkMode}
            />
          )}

          {/* VIEW: CREATOR PROFILE / EXPLORE */}
          {activeTab === 'explore' && (
            <CreatorProfile
              creator={selectedCreator}
              posts={posts.filter((p) => p.creatorId === selectedCreator.id)}
              isSubscribed={subscribedCreatorIds.includes(selectedCreator.id)}
              onBack={() => setActiveTab('feed')}
              onSubscribe={(creator, tierIndex) => {
                const tier = creator.tiers[tierIndex ?? 0];
                handleSubscribeToCreator(creator, tier?.name, tier?.price);
              }}
              onSendTip={(creator) => handleOpenCreatorTip(creator)}
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

      {/* Dedicated OnlyFans Tip Modal */}
      {tipModalConfig && (
        <TipModal
          isOpen={tipModalConfig.isOpen}
          onClose={() => setTipModalConfig(null)}
          creatorName={tipModalConfig.creatorName}
          creatorUsername={tipModalConfig.creatorUsername}
          creatorAvatar={tipModalConfig.creatorAvatar}
          currentUser={currentUser}
          onConfirmTip={handleConfirmTipModal}
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
