import React, { useState } from 'react';
import {
  ArrowLeft,
  BadgeCheck,
  MapPin,
  Globe,
  Calendar,
  Lock,
  Heart,
  MessageSquare,
  DollarSign,
  Share2,
  Image as ImageIcon,
  Film,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Creator, Post } from '../types';
import { PostCard } from './PostCard';

interface CreatorProfileProps {
  creator: Creator;
  posts: Post[];
  isSubscribed: boolean;
  onBack: () => void;
  onSubscribe: (creator: Creator, tierIndex?: number) => void;
  onSendTip: (creator: Creator) => void;
  onOpenDirectChat: (creator: Creator) => void;
  onUnlockPost: (post: Post) => void;
  onToggleLike: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  currentUsername: string;
  isWatermarkEnabled: boolean;
  darkMode: boolean;
}

export const CreatorProfile: React.FC<CreatorProfileProps> = ({
  creator,
  posts,
  isSubscribed,
  onBack,
  onSubscribe,
  onSendTip,
  onOpenDirectChat,
  onUnlockPost,
  onToggleLike,
  onAddComment,
  currentUsername,
  isWatermarkEnabled,
  darkMode,
}) => {
  const [activeMediaTab, setActiveMediaTab] = useState<'all' | 'photos' | 'videos' | 'exclusive'>('all');

  const filteredPosts = posts.filter((p) => {
    if (activeMediaTab === 'photos') return p.mediaType === 'image';
    if (activeMediaTab === 'videos') return p.mediaType === 'video';
    if (activeMediaTab === 'exclusive') return p.isLocked;
    return true;
  });

  return (
    <div id={`creator-profile-${creator.id}`} className="w-full pb-20 animate-fade-in">
      {/* Header Sticky Bar */}
      <div
        className={`sticky top-15 z-20 flex items-center gap-3 px-4 py-3 border-b backdrop-blur-md ${
          darkMode ? 'bg-[#12161a]/90 border-neutral-800' : 'bg-white/90 border-neutral-200'
        }`}
      >
        <button
          onClick={onBack}
          className={`p-2 rounded-full transition-colors cursor-pointer ${
            darkMode ? 'hover:bg-neutral-800 text-neutral-300' : 'hover:bg-neutral-100 text-neutral-700'
          }`}
          title="Regresar"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="truncate">
          <div className="flex items-center gap-1">
            <h1 className="font-extrabold text-base truncate">{creator.name}</h1>
            {creator.isVerified && <BadgeCheck className="w-4 h-4 text-[#00aff0]" />}
          </div>
          <p className="text-xs text-neutral-500">{creator.postsCount} publicaciones • {creator.mediaCount} fotos y videos</p>
        </div>
      </div>

      {/* Banner & Avatar */}
      <div className="relative">
        <div className="h-44 sm:h-64 w-full bg-neutral-800 overflow-hidden">
          <img
            src={creator.banner}
            alt={creator.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Avatar */}
        <div className="px-4 flex justify-between items-end -mt-16 sm:-mt-20 mb-3 relative z-10">
          <div className="relative">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-white dark:border-[#12161a] shadow-md"
            />
            <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white dark:border-[#12161a] flex items-center justify-center text-white text-[10px]" title="En línea">
              ✓
            </div>
          </div>

          {/* Quick Profile Actions */}
          <div className="flex items-center gap-2 mb-2">
            <button
              id="btn-profile-tip"
              onClick={() => onSendTip(creator)}
              className="p-2.5 rounded-full border border-neutral-300 dark:border-neutral-700 hover:border-[#00aff0] text-[#00aff0] bg-white dark:bg-neutral-900 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Enviar propina"
            >
              <DollarSign className="w-5 h-5" />
            </button>
            <button
              id="btn-profile-dm"
              onClick={() => onOpenDirectChat(creator)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#00aff0] hover:bg-[#009fe0] text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Mensaje E2EE</span>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Info Details */}
      <div className="px-4 mb-5">
        <div className="flex items-center gap-1.5 mb-1">
          <h2 className="text-xl font-black">{creator.name}</h2>
          {creator.isVerified && <BadgeCheck className="w-5 h-5 text-[#00aff0]" />}
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
          @{creator.username} • <span className="text-[#00aff0] font-semibold">{creator.category}</span>
        </p>

        {/* Bio Text */}
        <p className="text-sm leading-relaxed mb-4 whitespace-pre-line text-neutral-800 dark:text-neutral-200">
          {creator.bio}
        </p>

        {/* Metadata Badges */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 mb-4">
          {creator.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{creator.location}</span>
            </div>
          )}
          {creator.website && (
            <div className="flex items-center gap-1 text-[#00aff0] hover:underline cursor-pointer">
              <Globe className="w-3.5 h-3.5" />
              <span>{creator.website.replace('https://', '')}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Se unió en {creator.joinedDate}</span>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="flex items-center gap-6 py-2 border-y border-neutral-200 dark:border-neutral-800 text-xs">
          <div>
            <span className="font-extrabold text-sm block text-neutral-900 dark:text-white">
              {creator.postsCount}
            </span>
            <span className="text-neutral-500">Publicaciones</span>
          </div>
          <div>
            <span className="font-extrabold text-sm block text-neutral-900 dark:text-white">
              {(creator.likesCount / 1000).toFixed(1)}k
            </span>
            <span className="text-neutral-500">Me gusta</span>
          </div>
          <div>
            <span className="font-extrabold text-sm block text-neutral-900 dark:text-white">
              {(creator.subscribersCount / 1000).toFixed(1)}k
            </span>
            <span className="text-neutral-500">Suscriptores</span>
          </div>
        </div>
      </div>

      {/* Subscription Pricing Tiers Card */}
      <div className="px-4 mb-6">
        <div
          id="subscription-tiers-box"
          className={`p-4 sm:p-5 rounded-2xl border ${
            darkMode
              ? 'bg-[#161b22] border-neutral-800'
              : 'bg-white border-neutral-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-black text-sm uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Suscripciones & Beneficios Exclusivos
            </h3>
            <span className="flex items-center gap-1 text-xs text-emerald-500 font-bold">
              <ShieldCheck className="w-4 h-4" /> Pago 100% Protegido
            </span>
          </div>

          {isSubscribed ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="text-emerald-500 font-extrabold text-sm flex items-center justify-center gap-1.5 mb-1">
                ✓ Suscripción Activa
              </span>
              <p className="text-xs text-neutral-500">
                Tienes acceso ilimitado a todas las fotos, videos y publicaciones del feed de @{creator.username}.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {creator.tiers.map((tier, idx) => (
                <div
                  key={tier.id}
                  id={`tier-card-${tier.id}`}
                  className={`relative p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                    idx === 1
                      ? 'border-[#00aff0] bg-[#00aff0]/5'
                      : darkMode
                      ? 'border-neutral-700 bg-neutral-800/40'
                      : 'border-neutral-200 bg-neutral-50'
                  }`}
                >
                  {tier.discount && (
                    <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-[#00aff0] text-white text-[10px] font-extrabold">
                      Ahorra {tier.discount}%
                    </span>
                  )}
                  <div>
                    <h4 className="font-extrabold text-sm mb-1">{tier.name}</h4>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-xl font-black text-neutral-900 dark:text-white">
                        ${tier.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-neutral-500">/{tier.period}</span>
                    </div>
                    <ul className="text-[11px] text-neutral-600 dark:text-neutral-400 space-y-1 mb-3">
                      {tier.perks.map((perk, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-[#00aff0] font-bold">✓</span>
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    id={`btn-subscribe-tier-${idx}`}
                    onClick={() => onSubscribe(creator, idx)}
                    className="w-full py-2 px-3 rounded-full bg-[#00aff0] hover:bg-[#009fe0] text-white font-extrabold text-xs shadow-sm hover:shadow transition-all cursor-pointer active:scale-95"
                  >
                    SUSCRIBIRSE POR ${tier.price.toFixed(2)}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Media Tabs Filter */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800">
          {[
            { id: 'all', label: 'Todo', count: creator.postsCount },
            { id: 'photos', label: 'Fotos', count: 180, icon: ImageIcon },
            { id: 'videos', label: 'Videos', count: 68, icon: Film },
            { id: 'exclusive', label: 'Exclusivo (PPV)', count: 42, icon: Lock },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveMediaTab(tab.id as any)}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMediaTab === tab.id
                  ? 'border-[#00aff0] text-[#00aff0]'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
              <span>{tab.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Creator's Post Feed */}
      <div className="px-2 sm:px-4 space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={{
                ...post,
                isSubscribedCreator: isSubscribed,
              }}
              currentUsername={currentUsername}
              isWatermarkEnabled={isWatermarkEnabled}
              onUnlockPost={onUnlockPost}
              onSendTip={() => onSendTip(creator)}
              onViewCreator={() => {}}
              onToggleLike={onToggleLike}
              onAddComment={onAddComment}
              darkMode={darkMode}
            />
          ))
        ) : (
          <div className="text-center py-12 text-neutral-400 text-sm">
            No hay contenido en esta categoría.
          </div>
        )}
      </div>
    </div>
  );
};
