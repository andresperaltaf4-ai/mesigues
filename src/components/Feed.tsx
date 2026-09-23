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
  Image as ImageIcon,
  BarChart2,
  Calendar,
  Smile,
  RefreshCw,
  X,
  Send,
  Eye,
} from 'lucide-react';
import { Post, Creator, User } from '../types';
import { PostCard } from './PostCard';

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
  onDirectPublish?: (postData: {
    content: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
    isLocked: boolean;
    unlockPrice?: number;
  }) => void;
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
  onDirectPublish,
  darkMode,
}) => {
  const [feedFilter, setFeedFilter] = useState<'all' | 'subscribed' | 'exclusive'>('all');
  const [composerText, setComposerText] = useState('');
  const [composerMediaUrl, setComposerMediaUrl] = useState('');
  const [isPPVLocked, setIsPPVLocked] = useState(false);
  const [ppvPrice, setPpvPrice] = useState('10.00');
  const [isPollOpen, setIsPollOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const sampleMediaOptions = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80',
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handlePublishFromFeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composerText.trim() && !composerMediaUrl) return;

    if (onDirectPublish) {
      onDirectPublish({
        content: composerText.trim(),
        mediaUrl: composerMediaUrl || undefined,
        mediaType: composerMediaUrl ? 'image' : undefined,
        isLocked: isPPVLocked,
        unlockPrice: isPPVLocked ? parseFloat(ppvPrice) || 10 : undefined,
      });
    }

    setComposerText('');
    setComposerMediaUrl('');
    setIsPPVLocked(false);
  };

  const filteredPosts = posts.filter((post) => {
    if (feedFilter === 'subscribed') {
      return subscribedCreatorIds.includes(post.creatorId);
    }
    if (feedFilter === 'exclusive') {
      return post.isLocked;
    }
    return true;
  }).filter((post) =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.creator.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="main-feed-container" className="flex gap-6 w-full max-w-5xl mx-auto pb-20">
      {/* Central Feed Column */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* OnlyFans Sticky Top Header */}
        <div
          className={`sticky top-[72px] sm:top-[78px] z-10 p-3 sm:p-4 rounded-2xl border flex items-center justify-between backdrop-blur-md ${
            darkMode ? 'bg-[#12171e]/90 border-[#283240]' : 'bg-white/90 border-neutral-200 shadow-xs'
          }`}
        >
          <div className="flex items-center gap-3">
            <h1 className="text-base sm:text-lg font-black tracking-wide uppercase">INICIO</h1>
            <div className="flex items-center gap-1">
              {[
                { id: 'all', label: 'TODOS' },
                { id: 'subscribed', label: 'SUSCRIPCIONES' },
                { id: 'exclusive', label: 'EXCLUSIVOS PPV' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFeedFilter(tab.id as any)}
                  className={`px-3 py-1 rounded-full text-[11px] font-black tracking-wide transition-all cursor-pointer ${
                    feedFilter === tab.id
                      ? 'bg-[#00aff0] text-white shadow-xs'
                      : darkMode
                      ? 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleRefresh}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              isRefreshing ? 'animate-spin text-[#00aff0]' : darkMode ? 'text-neutral-400 hover:bg-neutral-800' : 'text-neutral-500 hover:bg-neutral-100'
            }`}
            title="Actualizar feed"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* OnlyFans Stories Carousel */}
        <div
          id="stories-carousel"
          className={`p-3.5 rounded-2xl border overflow-x-auto no-scrollbar flex items-center gap-3.5 ${
            darkMode ? 'bg-[#161b22] border-[#283240]' : 'bg-white border-neutral-200 shadow-xs'
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
              Tu historia
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
                      : 'bg-gradient-to-tr from-[#00aff0] to-sky-400'
                  }`}
                >
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-full h-full rounded-full object-cover border-2 border-white dark:border-[#161b22]"
                  />
                </div>
                <span className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300 truncate max-w-[68px] text-center">
                  @{creator.username.replace('_', '')}
                </span>
              </div>
            );
          })}
        </div>

        {/* Authentic OnlyFans In-Feed Post Composer Box */}
        <div
          id="of-feed-composer-box"
          className={`p-4 rounded-2xl border transition-all ${
            darkMode ? 'bg-[#161b22] border-[#283240]' : 'bg-white border-neutral-200 shadow-xs'
          }`}
        >
          <div className="flex gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover border border-[#00aff0] shrink-0"
            />
            <div className="flex-1">
              <textarea
                value={composerText}
                onChange={(e) => setComposerText(e.target.value)}
                placeholder="Escribe una nueva publicación..."
                rows={2}
                className={`w-full p-2.5 text-xs sm:text-sm rounded-xl outline-none resize-none border transition-colors ${
                  darkMode ? 'bg-[#12161a] border-[#283240] text-white focus:border-[#00aff0]' : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-[#00aff0]'
                }`}
              />

              {/* Attached Media Preview */}
              {composerMediaUrl && (
                <div className="relative mt-2 rounded-xl overflow-hidden max-h-48 border border-[#00aff0]/40 group">
                  <img
                    src={composerMediaUrl}
                    alt="Adjunto"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setComposerMediaUrl('')}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-rose-600 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  {isPPVLocked && (
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-[#00aff0] text-white text-[10px] font-bold flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>PPV: ${ppvPrice} USD</span>
                    </div>
                  )}
                </div>
              )}

              {/* PPV Pricing Tool Box */}
              {isPPVLocked && (
                <div className="mt-2.5 p-2.5 rounded-xl bg-[#00aff0]/10 border border-[#00aff0]/20 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#00aff0] font-bold">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Precio de desbloqueo PPV:</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-neutral-400">$</span>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      value={ppvPrice}
                      onChange={(e) => setPpvPrice(e.target.value)}
                      className="w-16 px-2 py-0.5 rounded-md bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs font-bold text-center outline-none"
                    />
                    <span className="text-[10px] text-neutral-400 font-bold">USD</span>
                  </div>
                </div>
              )}

              {/* Actions & Submit Toolbar */}
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-1 text-neutral-500">
                  {/* Photo picker */}
                  <button
                    type="button"
                    onClick={() => {
                      const random = sampleMediaOptions[Math.floor(Math.random() * sampleMediaOptions.length)];
                      setComposerMediaUrl(random);
                    }}
                    className={`p-2 rounded-full hover:text-[#00aff0] hover:bg-[#00aff0]/10 transition-colors cursor-pointer ${
                      composerMediaUrl ? 'text-[#00aff0]' : ''
                    }`}
                    title="Añadir foto o video"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>

                  {/* PPV Price Lock */}
                  <button
                    type="button"
                    onClick={() => setIsPPVLocked(!isPPVLocked)}
                    className={`p-2 rounded-full hover:text-[#00aff0] hover:bg-[#00aff0]/10 transition-colors cursor-pointer ${
                      isPPVLocked ? 'text-[#00aff0] bg-[#00aff0]/10' : ''
                    }`}
                    title="Definir precio de post bloqueado (PPV)"
                  >
                    <Lock className="w-4 h-4" />
                  </button>

                  {/* Poll */}
                  <button
                    type="button"
                    onClick={() => setIsPollOpen(!isPollOpen)}
                    className={`p-2 rounded-full hover:text-[#00aff0] hover:bg-[#00aff0]/10 transition-colors cursor-pointer ${
                      isPollOpen ? 'text-[#00aff0] bg-[#00aff0]/10' : ''
                    }`}
                    title="Crear encuesta"
                  >
                    <BarChart2 className="w-4 h-4" />
                  </button>

                  {/* Full modal open */}
                  <button
                    type="button"
                    onClick={onOpenNewPost}
                    className="p-2 rounded-full hover:text-[#00aff0] hover:bg-[#00aff0]/10 transition-colors cursor-pointer"
                    title="Editor completo"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  disabled={!composerText.trim() && !composerMediaUrl}
                  onClick={handlePublishFromFeed}
                  className="px-5 py-2 rounded-full bg-[#00aff0] hover:bg-[#009fe0] text-white text-xs font-black shadow-sm transition-all cursor-pointer disabled:opacity-40 active:scale-95 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>PUBLICAR</span>
                </button>
              </div>
            </div>
          </div>
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

      {/* Right Desktop Sidebar: Search, OnlyFans Suggestions & Footer */}
      <div className="hidden lg:flex flex-col w-72 shrink-0 space-y-4">
        {/* OnlyFans Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar publicaciones..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-full text-xs font-medium outline-none border transition-all ${
              darkMode ? 'bg-[#161b22] border-[#283240] text-white focus:border-[#00aff0]' : 'bg-white border-neutral-200 text-neutral-900 focus:border-[#00aff0] shadow-xs'
            }`}
          />
        </div>

        {/* Suggestions Widget (SUGERENCIAS) */}
        <div
          id="suggested-creators-widget"
          className={`p-4 rounded-2xl border ${
            darkMode ? 'bg-[#161b22] border-[#283240]' : 'bg-white border-neutral-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-black text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              SUGERENCIAS
            </h3>
            <Sparkles className="w-3.5 h-3.5 text-[#00aff0]" />
          </div>

          <div className="space-y-3.5">
            {creators.slice(0, 4).map((creator) => {
              const isSub = subscribedCreatorIds.includes(creator.id);
              return (
                <div
                  key={creator.id}
                  className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden group hover:border-[#00aff0] transition-colors"
                >
                  {/* Mini Cover */}
                  <div className="h-14 w-full bg-neutral-800 overflow-hidden relative">
                    <img
                      src={creator.banner}
                      alt={creator.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-3 pt-0 relative">
                    {/* Avatar overlapping banner */}
                    <div className="flex justify-between items-end -mt-6 mb-2">
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        onClick={() => onViewCreator(creator.id)}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-[#161b22] shadow-sm cursor-pointer"
                      />

                      <button
                        onClick={() => onSubscribe(creator)}
                        className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer active:scale-95 ${
                          isSub
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                            : 'bg-[#00aff0] hover:bg-[#009fe0] text-white shadow-xs'
                        }`}
                      >
                        {isSub ? 'Suscrito' : `+ $${creator.subscriptionPrice.toFixed(2)}`}
                      </button>
                    </div>

                    <div onClick={() => onViewCreator(creator.id)} className="cursor-pointer">
                      <div className="flex items-center gap-1">
                        <span className="font-extrabold text-xs group-hover:text-[#00aff0] truncate">
                          {creator.name}
                        </span>
                        {creator.isVerified && <BadgeCheck className="w-3.5 h-3.5 text-[#00aff0] shrink-0" />}
                      </div>
                      <span className="text-[10px] text-neutral-400 block truncate">
                        @{creator.username}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* OnlyFans Footer Links */}
        <div className="text-[11px] text-neutral-400 px-2 space-y-2">
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            <a href="#about" className="hover:underline">Acerca de</a>
            <span>•</span>
            <a href="#help" className="hover:underline">Ayuda</a>
            <span>•</span>
            <a href="#terms" className="hover:underline">Términos de servicio</a>
            <span>•</span>
            <a href="#privacy" className="hover:underline">Privacidad</a>
            <span>•</span>
            <a href="#cookies" className="hover:underline">Cookies</a>
          </div>
          <div>© 2026 ME SIGUES • Exclusive Creators Platform</div>
        </div>
      </div>
    </div>
  );
};
