import React, { useState } from 'react';
import { Archive, Image as ImageIcon, Film, Mic, Lock, Download, Check, Sparkles, Filter } from 'lucide-react';
import { Post, User } from '../types';

interface VaultViewProps {
  posts: Post[];
  currentUser: User;
  darkMode: boolean;
}

export const VaultView: React.FC<VaultViewProps> = ({ posts, currentUser, darkMode }) => {
  const [mediaType, setMediaType] = useState<'all' | 'photos' | 'videos' | 'purchased'>('all');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const mediaPosts = posts.filter((p) => {
    if (mediaType === 'photos') return p.mediaType === 'image';
    if (mediaType === 'videos') return p.mediaType === 'video';
    if (mediaType === 'purchased') return p.isUnlockedByMe;
    return !!p.mediaUrl;
  });

  return (
    <div id="of-vault-view" className="max-w-4xl mx-auto pb-20 animate-fade-in space-y-4">
      {/* Header */}
      <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-[#161b22] border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#00aff0]/15 flex items-center justify-center text-[#00aff0]">
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black">Bóveda de Medios (Vault)</h1>
              <p className="text-xs text-neutral-400">Tu biblioteca multimedia de fotos, videos y contenido adquirido</p>
            </div>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-[#00aff0]/10 text-[#00aff0] font-bold">
            {mediaPosts.length} Archivos
          </span>
        </div>

        {/* Media filter tabs */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800">
          {[
            { id: 'all', label: 'Todo el contenido', icon: Archive },
            { id: 'photos', label: 'Fotos', icon: ImageIcon },
            { id: 'videos', label: 'Videos', icon: Film },
            { id: 'purchased', label: 'PPV Desbloqueados', icon: Lock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = mediaType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setMediaType(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
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
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {mediaPosts.map((post) => (
          <div
            key={post.id}
            onClick={() => setSelectedItem(post)}
            className={`group relative aspect-square rounded-2xl overflow-hidden border cursor-pointer transition-all hover:scale-[1.02] shadow-xs ${
              darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-100 border-neutral-200'
            }`}
          >
            {post.mediaUrl ? (
              <img
                src={post.mediaUrl}
                alt={post.content}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : null}

            {/* Overlay badge */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-between">
              <span className="text-[10px] text-white bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-xs self-start">
                @{post.creator.username}
              </span>
              <div className="flex items-center justify-between text-white text-xs">
                <span className="font-semibold text-[11px] truncate">{post.createdAt}</span>
                {post.mediaType === 'video' ? <Film className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="max-w-3xl max-h-[90vh] rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedItem.mediaUrl}
              alt="Preview"
              className="max-h-[75vh] w-auto mx-auto object-contain"
            />
            <div className="p-4 bg-neutral-950 flex items-center justify-between text-white border-t border-neutral-800">
              <div className="flex items-center gap-2">
                <img
                  src={selectedItem.creator.avatar}
                  alt={selectedItem.creator.name}
                  className="w-8 h-8 rounded-full object-cover border border-[#00aff0]"
                />
                <div>
                  <span className="font-bold text-xs block">{selectedItem.creator.name}</span>
                  <span className="text-[10px] text-neutral-400">@{selectedItem.creator.username} • {selectedItem.createdAt}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
