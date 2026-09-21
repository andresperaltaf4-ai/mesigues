import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  DollarSign,
  Bookmark,
  Share2,
  Lock,
  BadgeCheck,
  ShieldCheck,
  MoreHorizontal,
  Send,
  Sparkles,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { Post, Comment } from '../types';

interface PostCardProps {
  post: Post;
  currentUsername: string;
  isWatermarkEnabled: boolean;
  onUnlockPost: (post: Post) => void;
  onSendTip: (post: Post) => void;
  onViewCreator: (creatorId: string) => void;
  onToggleLike: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  darkMode: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUsername,
  isWatermarkEnabled,
  onUnlockPost,
  onSendTip,
  onViewCreator,
  onToggleLike,
  onAddComment,
  darkMode,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showModerationDetails, setShowModerationDetails] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isUnlocked = !post.isLocked || post.isUnlockedByMe || post.isSubscribedCreator;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(post.id, commentInput.trim());
    setCommentInput('');
  };

  const handleCopyLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <article
      id={`post-card-${post.id}`}
      className={`rounded-2xl border transition-all mb-4 overflow-hidden ${
        darkMode
          ? 'bg-[#161b22] border-neutral-800 text-neutral-100 shadow-sm'
          : 'bg-white border-neutral-200 text-neutral-900 shadow-sm'
      }`}
    >
      {/* Header: Creator Info */}
      <div className="p-4 flex items-center justify-between">
        <div
          onClick={() => onViewCreator(post.creatorId)}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img
            src={post.creator.avatar}
            alt={post.creator.name}
            className="w-11 h-11 rounded-full object-cover border border-[#00aff0] transition-transform group-hover:scale-105"
            loading="lazy"
          />
          <div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-sm hover:text-[#00aff0] transition-colors">
                {post.creator.name}
              </span>
              {post.creator.isVerified && (
                <BadgeCheck className="w-4 h-4 text-[#00aff0] shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <span>@{post.creator.username}</span>
              <span>•</span>
              <span>{post.createdAt}</span>
            </div>
          </div>
        </div>

        {/* Action Menu & Moderation Badge */}
        <div className="flex items-center gap-1.5">
          <button
            id={`btn-moderation-badge-${post.id}`}
            onClick={() => setShowModerationDetails(!showModerationDetails)}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors cursor-pointer"
            title="Verificado por IA de moderación"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden sm:inline">IA Segura</span>
          </button>

          <button
            onClick={handleCopyLink}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              darkMode ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-100 text-neutral-500'
            }`}
            title="Copiar enlace"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Moderation Details Popup Banner */}
      {showModerationDetails && (
        <div
          id={`moderation-details-${post.id}`}
          className={`mx-4 mb-3 p-3 rounded-xl text-xs border ${
            darkMode ? 'bg-neutral-900 border-neutral-700' : 'bg-emerald-50/70 border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between font-bold mb-1 text-emerald-700 dark:text-emerald-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Auditoría de Moderación Automatizada (Gemini AI)
            </span>
            <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.2 rounded-full">
              {post.moderation.moderationTag}
            </span>
          </div>
          <p className="text-neutral-600 dark:text-neutral-300 mb-1.5 leading-relaxed">
            {post.moderation.explanation}
          </p>
          <div className="flex items-center justify-between text-[10px] text-neutral-400 border-t border-neutral-200/50 dark:border-neutral-700/50 pt-1.5">
            <span>Nivel de riesgo: <b className="text-emerald-500">{post.moderation.riskLevel}</b></span>
            <span>Confianza: {(post.moderation.confidence * 100).toFixed(0)}%</span>
            <span>Fecha: {post.moderation.verifiedAt}</span>
          </div>
        </div>
      )}

      {/* Post Text Content */}
      <div className="px-4 pb-3">
        <p className="text-sm leading-relaxed whitespace-pre-line break-words">
          {post.content}
        </p>
      </div>

      {/* Media Container: Photo, Video, or Paywalled Exclusive Lock */}
      {post.mediaUrl && (
        <div className="relative w-full bg-black/90 select-none overflow-hidden max-h-[600px] flex items-center justify-center">
          {isUnlocked ? (
            /* UNLOCKED VIEW: High Quality Media with dynamic DRM Watermark */
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={post.mediaUrl}
                alt="Contenido exclusivo"
                className="w-full object-cover max-h-[580px]"
                loading="lazy"
              />

              {/* Dynamic Watermark Protection against Screen Recording & Leaks */}
              {isWatermarkEnabled && (
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 opacity-25">
                  <div className="flex justify-between text-[11px] font-mono tracking-widest text-white uppercase drop-shadow">
                    <span>mesigues DRM Protected</span>
                    <span>ID: #{post.id}</span>
                  </div>
                  <div className="text-center text-xs font-mono tracking-widest text-white/40 rotate-[-15deg] select-none">
                    LICENCIADO PARA @{currentUsername} • NO DISTRIBUIR
                  </div>
                  <div className="flex justify-between text-[11px] font-mono tracking-widest text-white uppercase drop-shadow">
                    <span>@{post.creator.username}</span>
                    <span>E2EE Certified</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* LOCKED PAYWALL VIEW: Frosted Blur Overlay with Unlock CTA */
            <div className="relative w-full min-h-[380px] sm:min-h-[440px] flex flex-col items-center justify-center overflow-hidden">
              {/* Heavy Frosted Blurred Background */}
              <img
                src={post.mediaUrl}
                alt="Contenido bloqueado"
                className="absolute inset-0 w-full h-full object-cover filter blur-2xl scale-110 opacity-40 brightness-75"
              />

              {/* Dark translucent overlay */}
              <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-md" />

              {/* Centered Lock Card */}
              <div className="relative z-10 p-6 max-w-sm text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-[#00aff0]/20 border border-[#00aff0]/40 flex items-center justify-center text-[#00aff0] mb-4 shadow-lg shadow-[#00aff0]/20 animate-pulse">
                  <Lock className="w-7 h-7" />
                </div>

                <h3 className="text-white font-extrabold text-lg mb-1">
                  Contenido Exclusivo Bloqueado
                </h3>
                <p className="text-neutral-300 text-xs mb-5 leading-relaxed">
                  Esta publicación contiene fotos y videos exclusivos de @{post.creator.username} protegidos con cifrado de extremo a extremo.
                </p>

                <div className="w-full space-y-2.5">
                  {/* PPV Instant Unlock Button */}
                  {post.unlockPrice && (
                    <button
                      id={`btn-unlock-post-${post.id}`}
                      onClick={() => onUnlockPost(post)}
                      className="w-full py-2.5 px-4 rounded-full bg-[#00aff0] hover:bg-[#009fe0] text-white text-sm font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Lock className="w-4 h-4" />
                      <span>DESBLOQUEAR POR ${post.unlockPrice.toFixed(2)}</span>
                    </button>
                  )}

                  {/* Subscribe to Creator Button */}
                  <button
                    id={`btn-subscribe-from-post-${post.id}`}
                    onClick={() => onViewCreator(post.creatorId)}
                    className="w-full py-2 px-4 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>O suscríbete para acceso total</span>
                  </button>
                </div>

                <div className="mt-4 flex items-center gap-2 text-[10px] text-neutral-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Pago Seguro PCI-DSS • Encriptación 256-bit</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Engagement Stats Bar */}
      <div className="px-4 py-2 flex items-center justify-between text-xs text-neutral-500 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <span>{post.likes} Me gusta</span>
          <span>•</span>
          <span>{post.commentsCount} Comentarios</span>
        </div>
        {post.tipsTotal > 0 && (
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
            <DollarSign className="w-3.5 h-3.5" />
            <span>${post.tipsTotal.toFixed(2)} en propinas</span>
          </div>
        )}
      </div>

      {/* Action Buttons: Like, Comment, Tip, Bookmark, Share */}
      <div className="px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Like Button */}
          <button
            id={`btn-like-post-${post.id}`}
            onClick={() => onToggleLike(post.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-90 ${
              post.isLikedByMe
                ? 'text-rose-500 bg-rose-500/10'
                : darkMode
                ? 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            <Heart
              className={`w-5 h-5 ${
                post.isLikedByMe ? 'fill-rose-500 text-rose-500 scale-110' : ''
              } transition-transform`}
            />
            <span>{post.likes}</span>
          </button>

          {/* Comments Toggle */}
          <button
            id={`btn-toggle-comments-${post.id}`}
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              darkMode
                ? 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span>{post.commentsCount}</span>
          </button>

          {/* Tip Button (Enviar Propina) */}
          <button
            id={`btn-tip-post-${post.id}`}
            onClick={() => onSendTip(post)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-extrabold bg-[#00aff0]/10 text-[#00aff0] hover:bg-[#00aff0] hover:text-white transition-all cursor-pointer active:scale-95"
            title="Enviar propina al creador"
          >
            <DollarSign className="w-4 h-4" />
            <span>PROPINA</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          {/* Bookmark */}
          <button
            id={`btn-bookmark-post-${post.id}`}
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isBookmarked
                ? 'text-[#00aff0]'
                : darkMode
                ? 'text-neutral-400 hover:bg-neutral-800'
                : 'text-neutral-500 hover:bg-neutral-100'
            }`}
            title="Guardar publicación"
          >
            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-[#00aff0]' : ''}`} />
          </button>

          {/* Share */}
          <button
            id={`btn-share-post-${post.id}`}
            onClick={handleCopyLink}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              copiedLink
                ? 'text-emerald-500'
                : darkMode
                ? 'text-neutral-400 hover:bg-neutral-800'
                : 'text-neutral-500 hover:bg-neutral-100'
            }`}
            title="Compartir"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {copiedLink && (
        <div className="px-4 pb-2 text-xs text-emerald-500 font-semibold animate-fade-in">
          ✓ Enlace copiado al portapapeles
        </div>
      )}

      {/* Expandable Comments Section */}
      {showComments && (
        <div
          id={`comments-section-${post.id}`}
          className={`px-4 py-3 border-t ${
            darkMode ? 'border-neutral-800 bg-neutral-900/50' : 'border-neutral-100 bg-neutral-50/50'
          }`}
        >
          {/* Comments List */}
          <div className="space-y-3 mb-3 max-h-60 overflow-y-auto pr-1">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comm) => (
                <div key={comm.id} className="flex items-start gap-2.5 text-xs">
                  <img
                    src={comm.userAvatar}
                    alt={comm.userName}
                    className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="flex-1 bg-neutral-100 dark:bg-neutral-800 p-2.5 rounded-xl">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-neutral-900 dark:text-white">
                        {comm.userName}
                      </span>
                      <span className="text-[10px] text-neutral-400">{comm.createdAt}</span>
                    </div>
                    <p className="text-neutral-700 dark:text-neutral-300">{comm.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-neutral-400 text-center py-2">
                Aún no hay comentarios. ¡Sé el primero en comentar!
              </p>
            )}
          </div>

          {/* New Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Escribe un comentario respetuoso..."
              className={`flex-1 px-3.5 py-1.5 text-xs rounded-full outline-none transition-all ${
                darkMode
                  ? 'bg-neutral-800 border border-neutral-700 text-white focus:border-[#00aff0]'
                  : 'bg-white border border-neutral-300 text-neutral-900 focus:border-[#00aff0]'
              }`}
            />
            <button
              type="submit"
              disabled={!commentInput.trim()}
              className="p-1.5 rounded-full bg-[#00aff0] text-white hover:bg-[#009fe0] disabled:opacity-40 transition-opacity cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </article>
  );
};
