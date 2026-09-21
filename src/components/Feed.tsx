import React, { useState } from 'react';
import {
  Sparkles,
  PlusCircle,
  TrendingUp,
  ShieldCheck,
  Lock,
  Search,
  BadgeCheck,
  Check,
} from 'lucide-react';
import { Post, Creator, User } from '../types';
import { PostCard } from './PostCard';
import { BrandLogo } from './BrandLogo';

interface FeedProps {
  posts: Post[];
  creators: Creator[];
  currentUser: User;
  subscribedCreatorIds: string[];
  onUnlockPost: (post: Post) => void;
  onSendTip: (post: Post) => void;
  onViewCreator: (creatorId: string) => void;
  onToggleLike: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onOpenNewPost: () => void;
  onSubscribe: (creator: Creator) => void;
  darkMode: boolean;
}

export const Feed: React.FC<FeedProps> = ({
  posts,
  creators,
  currentUser,
  subscribedCreatorIds,
  onUnlockPost,
  onSendTip,
  onViewCreator,
  onToggleLike,
  onAddComment,
  onOpenNewPost,
  onSubscribe,
  darkMode,
}) => {
  const [feedFilter, setFeedFilter] = useState<'for-you' | 'subscribed' | 'exclusive'>('for-you');

  const filteredPosts = posts.filter((post) => {
    if (feedFilter === 'subscribed') {
      return subscribedCreatorIds.includes(post.creatorId);
    }
    if (feedFilter === 'exclusive') {
      return post.isLocked;
    }
    return true;
  });

  return (
    <div id="main-feed-container" className="flex gap-6 w-full max-w-5xl mx-auto pb-20">
      {/* Central Column: Stories, Composer, Feed Posts */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Stories / Featured Creators Carousel */}
        <div
          id="stories-carousel"
          className={`p-3.5 rounded-2xl border overflow-x-auto no-scrollbar flex items-center gap-3.5 ${
            darkMode ? 'bg-[#161b22] border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
          }`}
        >
          {/* Creator's own story button */}
          <div
            onClick={onOpenNewPost}
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
          >
            <div className="relative w-15 h-15 rounded-full p-0.5 border-2 border-dashed border-[#00aff0] flex items-center justify-center">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full rounded-full object-cover"
              />
              <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#00aff0] text-white flex items-center justify-center text-xs font-black shadow-md">
                +
              </div>
            </div>
            <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400 group-hover:text-[#00aff0]">
              Tu Historia
            </span>
          </div>

          {/* Creators Stories */}
          {creators.map((creator) => {
            const isSub = subscribedCreatorIds.includes(creator.id);
            return (
              <div
                key={creator.id}
                onClick={() => onViewCreator(creator.id)}
                className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
              >
                <div
                  className={`w-15 h-15 rounded-full p-0.5 transition-transform group-hover:scale-105 ${
                    isSub
                      ? 'bg-gradient-to-tr from-emerald-400 to-[#00aff0]'
                      : 'bg-gradient-to-tr from-[#00aff0] to-indigo-500'
                  }`}
                >
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-full h-full rounded-full object-cover border-2 border-white dark:border-[#161b22]"
                  />
                </div>
                <span className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 truncate max-w-[68px] text-center">
                  @{creator.username.replace('_', '')}
                </span>
              </div>
            );
          })}
        </div>

        {/* Quick Post Prompt Bar */}
        <div
          onClick={onOpenNewPost}
          className={`p-3 px-4 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all hover:border-[#00aff0] ${
            darkMode ? 'bg-[#161b22] border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
          }`}
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-9 h-9 rounded-full object-cover"
          />
          <div className="flex-1 text-xs text-neutral-400 font-medium truncate">
            ¿Quieres publicar nuevo contenido exclusivo con cifrado E2EE?...
          </div>
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#00aff0] text-white text-xs font-bold shadow-sm">
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Publicar</span>
          </button>
        </div>

        {/* Feed Filter Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
          <div className="flex items-center gap-2">
            {[
              { id: 'for-you', label: 'Para ti' },
              { id: 'subscribed', label: 'Siguiendo' },
              { id: 'exclusive', label: 'Exclusivo PPV' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFeedFilter(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                  feedFilter === tab.id
                    ? 'bg-[#00aff0] text-white shadow-sm'
                    : darkMode
                    ? 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-neutral-400 font-medium">
            {filteredPosts.length} publicaciones
          </span>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={{
                ...post,
                isSubscribedCreator: subscribedCreatorIds.includes(post.creatorId),
              }}
              currentUsername={currentUser.username}
              isWatermarkEnabled={currentUser.watermarkProtection}
              onUnlockPost={onUnlockPost}
              onSendTip={onSendTip}
              onViewCreator={onViewCreator}
              onToggleLike={onToggleLike}
              onAddComment={onAddComment}
              darkMode={darkMode}
            />
          ))}
        </div>
      </div>

      {/* Right Desktop Sidebar: Suggestions & Privacy Guaranteed */}
      <div className="hidden lg:flex flex-col w-72 shrink-0 space-y-4">
        {/* MeSigues Luxury Platform Card */}
        <div
          id="mesigues-luxury-badge-card"
          className={`p-4 rounded-2xl border relative overflow-hidden transition-all ${
            darkMode
              ? 'bg-gradient-to-br from-[#161b22] via-[#10141a] to-[#0d1015] border-neutral-800'
              : 'bg-gradient-to-br from-white via-neutral-50 to-neutral-100 border-neutral-200 shadow-sm'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
            <BrandLogo size="md" showText={true} />
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-500 dark:text-amber-400 border border-amber-400/30 self-start sm:self-center">
              Alta Gama
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Plataforma VIP de suscripción directa y contenido exclusivo con privacidad E2EE certificada.
          </p>
        </div>

        {/* Suggested Creators Widget */}
        <div
          id="suggested-creators-widget"
          className={`p-4 rounded-2xl border ${
            darkMode ? 'bg-[#161b22] border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Creadores Sugeridos
            </h3>
            <Sparkles className="w-3.5 h-3.5 text-[#00aff0]" />
          </div>

          <div className="space-y-3">
            {creators.slice(0, 3).map((creator) => {
              const isSub = subscribedCreatorIds.includes(creator.id);
              return (
                <div key={creator.id} className="flex items-center justify-between gap-2">
                  <div
                    onClick={() => onViewCreator(creator.id)}
                    className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
                  >
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-9 h-9 rounded-full object-cover border border-[#00aff0] shrink-0"
                    />
                    <div className="truncate">
                      <div className="flex items-center gap-0.5">
                        <span className="font-bold text-xs truncate group-hover:text-[#00aff0]">
                          {creator.name}
                        </span>
                        {creator.isVerified && (
                          <BadgeCheck className="w-3 h-3 text-[#00aff0] shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] text-neutral-400 block truncate">
                        @{creator.username}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSubscribe(creator)}
                    className={`px-3 py-1 rounded-full text-xs font-extrabold shrink-0 transition-all cursor-pointer ${
                      isSub
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                        : 'bg-[#00aff0] hover:bg-[#009fe0] text-white shadow-sm'
                    }`}
                  >
                    {isSub ? 'Suscrito' : `$${creator.subscriptionPrice}`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security & Anti-Leak Guarantee Card */}
        <div
          id="security-guarantee-box"
          className={`p-4 rounded-2xl border ${
            darkMode ? 'bg-[#161b22] border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-2 mb-2 font-black text-xs text-emerald-500">
            <ShieldCheck className="w-4 h-4" />
            <span>Garantía de Privacidad mesigues</span>
          </div>
          <ul className="text-[11px] text-neutral-500 dark:text-neutral-400 space-y-1.5">
            <li className="flex items-start gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span>Cifrado E2EE AES-GCM 256 en chats</span>
            </li>
            <li className="flex items-start gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span>Protección DRM y marcas de agua dinámicas</span>
            </li>
            <li className="flex items-start gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span>Moderación automatizada por IA (TOS)</span>
            </li>
            <li className="flex items-start gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span>Pagos 100% seguros PCI-DSS y Crypto Web3</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
