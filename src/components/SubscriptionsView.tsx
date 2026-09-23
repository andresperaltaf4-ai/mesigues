import React, { useState } from 'react';
import { Users, BadgeCheck, MessageSquare, DollarSign, Calendar, AlertCircle, ArrowRight, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { Creator, User } from '../types';

interface SubscriptionsViewProps {
  creators: Creator[];
  subscribedCreatorIds: string[];
  currentUser: User;
  onViewCreator: (creatorId: string) => void;
  onOpenDirectChat: (creator: Creator) => void;
  onSubscribe: (creator: Creator) => void;
  onCancelSub: (creatorId: string) => void;
  darkMode: boolean;
}

export const SubscriptionsView: React.FC<SubscriptionsViewProps> = ({
  creators,
  subscribedCreatorIds,
  currentUser,
  onViewCreator,
  onOpenDirectChat,
  onSubscribe,
  onCancelSub,
  darkMode,
}) => {
  const [subTab, setSubTab] = useState<'active' | 'expired' | 'all'>('active');

  const activeCreators = creators.filter((c) => subscribedCreatorIds.includes(c.id));
  const expiredCreators = creators.filter((c) => !subscribedCreatorIds.includes(c.id));

  const displayedList =
    subTab === 'active'
      ? activeCreators
      : subTab === 'expired'
      ? expiredCreators
      : creators;

  return (
    <div id="of-subscriptions-view" className="max-w-4xl mx-auto pb-20 animate-fade-in space-y-4">
      {/* Header Banner */}
      <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-[#161b22] border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#00aff0]/15 flex items-center justify-center text-[#00aff0]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black">Suscripciones</h1>
              <p className="text-xs text-neutral-400">Administra tus suscripciones a creadores exclusivos</p>
            </div>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20">
            {activeCreators.length} Activas
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800">
          {[
            { id: 'active', label: `Activas (${activeCreators.length})` },
            { id: 'expired', label: `Vencidas / Sugeridas (${expiredCreators.length})` },
            { id: 'all', label: `Todos los Creadores (${creators.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
                subTab === tab.id
                  ? 'bg-[#00aff0] text-white shadow-sm'
                  : darkMode
                  ? 'text-neutral-400 hover:bg-neutral-800'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subscriptions List */}
      <div className="space-y-3">
        {displayedList.map((creator) => {
          const isSubscribed = subscribedCreatorIds.includes(creator.id);
          return (
            <div
              key={creator.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                darkMode ? 'bg-[#161b22] border-neutral-800 hover:border-neutral-700' : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-sm'
              }`}
            >
              {/* Creator details */}
              <div
                className="flex items-center gap-3.5 cursor-pointer group flex-1 min-w-0"
                onClick={() => onViewCreator(creator.id)}
              >
                <div className="relative">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#00aff0] shrink-0"
                  />
                  {isSubscribed && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-[#161b22]">
                      ✓
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm sm:text-base group-hover:text-[#00aff0] transition-colors truncate">
                      {creator.name}
                    </span>
                    {creator.isVerified && <BadgeCheck className="w-4 h-4 text-[#00aff0] shrink-0" />}
                  </div>
                  <span className="text-xs text-neutral-400 block truncate">@{creator.username} • {creator.category}</span>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-500">
                    <span>{creator.postsCount} posts</span>
                    <span>•</span>
                    <span className="font-bold text-neutral-700 dark:text-neutral-300">${creator.subscriptionPrice.toFixed(2)}/mes</span>
                    {isSubscribed && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-500 font-bold">Renovación automática activa</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => onOpenDirectChat(creator)}
                  className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                    darkMode ? 'border-neutral-700 hover:bg-neutral-800 text-neutral-300' : 'border-neutral-200 hover:bg-neutral-100 text-neutral-700'
                  }`}
                  title="Mensaje directo"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>

                {isSubscribed ? (
                  <button
                    onClick={() => onCancelSub(creator.id)}
                    className="px-4 py-2 rounded-full border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancelar renovación
                  </button>
                ) : (
                  <button
                    onClick={() => onSubscribe(creator)}
                    className="px-5 py-2 rounded-full bg-[#00aff0] hover:bg-[#009fe0] text-white text-xs font-black shadow-sm transition-all cursor-pointer active:scale-95"
                  >
                    Suscribirse por ${creator.subscriptionPrice.toFixed(2)}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
