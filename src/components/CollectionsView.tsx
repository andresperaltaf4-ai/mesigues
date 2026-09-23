import React, { useState } from 'react';
import { Bookmark, Image, Film, Lock, Search, Heart, MessageCircle, Share2, ExternalLink } from 'lucide-react';
import { Post, User } from '../types';

interface CollectionsViewProps {
  posts: Post[];
  currentUser: User;
  onViewPost: (post: Post) => void;
  onViewCreator: (creatorId: string) => void;
  darkMode: boolean;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({
  posts,
  currentUser,
  onViewPost,
  onViewCreator,
  darkMode,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'photos' | 'videos' | 'locked'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // We filter posts for the bookmark view
  const bookmarkedPosts = posts.filter((post) => {
    if (activeTab === 'photos') return post.mediaType === 'image';
    if (activeTab === 'videos') return post.mediaType === 'video';
    if (activeTab === 'locked') return post.isLocked;
    return true;
  }).filter((post) =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.creator.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="of-collections-view" className="max-w-4xl mx-auto pb-20 animate-fade-in space-y-4">
      {/* Header */}
      <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-[#161b22] border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#00aff0]/15 flex items-center justify-center text-[#00aff0]">
              <Bookmark className="w-5 h-5 fill-[#00aff0]" />
            </div>
            <div>
              <h1 className="text-xl font-black">Colecciones & Marcadores</h1>
              <p className="text-xs text-neutral-400">Tus publicaciones y contenidos guardados favoritos</p>
            </div>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-[#00aff0]/10 text-[#00aff0] font-bold">
            {bookmarkedPosts.length} guardados
          </span>
        </div>

        {/* Search */}
        <div className="mt-4 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar en tus publicaciones guardadas..."
            className={`w-full pl-10 pr-4 py-2 text-xs rounded-full border outline-none transition-all ${
              darkMode ? 'bg-neutral-800/80 border-neutral-700 text-white focus:border-[#00aff0]' : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-[#00aff0]'
            }`}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2">
        {[
          { id: 'all', label: 'Todas las publicaciones', icon: Bookmark },
          { id: 'photos', label: 'Fotos', icon: Image },
          { id: 'videos', label: 'Videos', icon: Film },
          { id: 'locked', label: 'Exclusivo PPV', icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#00aff0] text-white shadow-sm'
                  : darkMode
                  ? 'text-neutral-400 hover:bg-neutral-800'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid of Saved Posts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {bookmarkedPosts.map((post) => (
          <div
            key={post.id}
            className={`rounded-2xl border overflow-hidden transition-all group hover:border-[#00aff0] ${
              darkMode ? 'bg-[#161b22] border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
            }`}
          >
            {/* Thumbnail */}
            <div className="relative aspect-square bg-neutral-900 overflow-hidden cursor-pointer" onClick={() => onViewPost(post)}>
              {post.mediaUrl ? (
                <img
                  src={post.mediaUrl}
                  alt={post.content}
                  className={`w-full h-full object-cover transition-transform group-hover:scale-105 ${post.isLocked ? 'blur-md opacity-60' : ''}`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-4 text-xs text-neutral-400 text-center">
                  {post.content.substring(0, 100)}...
                </div>
              )}

              {post.isLocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white p-3 text-center">
                  <Lock className="w-6 h-6 text-[#00aff0] mb-1" />
                  <span className="text-xs font-bold">PPV Bloqueado</span>
                  <span className="text-[10px] text-neutral-300">${post.unlockPrice?.toFixed(2)}</span>
                </div>
              )}

              <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white backdrop-blur-xs">
                <Bookmark className="w-3.5 h-3.5 fill-[#00aff0] text-[#00aff0]" />
              </div>
            </div>

            {/* Meta */}
            <div className="p-3">
              <div
                className="flex items-center gap-2 mb-1.5 cursor-pointer"
                onClick={() => onViewCreator(post.creatorId)}
              >
                <img
                  src={post.creator.avatar}
                  alt={post.creator.name}
                  className="w-6 h-6 rounded-full object-cover border border-[#00aff0]"
                />
                <span className="text-xs font-bold truncate hover:text-[#00aff0]">{post.creator.name}</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                {post.content}
              </p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-400">
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> {post.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" /> {post.commentsCount}
                </span>
                <span>{post.createdAt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
