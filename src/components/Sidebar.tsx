import React from 'react';
import {
  Home,
  Bell,
  MessageSquare,
  Users,
  Compass,
  Wallet,
  BarChart3,
  ShieldCheck,
  PlusCircle,
  Lock,
  BadgeCheck,
} from 'lucide-react';
import { User } from '../types';

export type ActiveTab =
  | 'feed'
  | 'notifications'
  | 'messages'
  | 'subscriptions'
  | 'explore'
  | 'wallet'
  | 'creator-studio'
  | 'privacy';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  currentUser: User;
  unreadNotifications: number;
  unreadMessages: number;
  onOpenNewPost: () => void;
  darkMode: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  unreadNotifications,
  unreadMessages,
  onOpenNewPost,
  darkMode,
}) => {
  const navItems = [
    { id: 'feed', label: 'Inicio', icon: Home },
    {
      id: 'notifications',
      label: 'Notificaciones',
      icon: Bell,
      badge: unreadNotifications > 0 ? unreadNotifications : undefined,
    },
    {
      id: 'messages',
      label: 'Mensajes E2EE',
      icon: MessageSquare,
      badge: unreadMessages > 0 ? unreadMessages : undefined,
      e2ee: true,
    },
    { id: 'subscriptions', label: 'Suscripciones', icon: Users },
    { id: 'explore', label: 'Explorar Creadores', icon: Compass },
    { id: 'wallet', label: 'Billetera & Pagos', icon: Wallet },
    {
      id: 'creator-studio',
      label: 'Panel de Creador',
      icon: BarChart3,
      highlight: true,
    },
    {
      id: 'privacy',
      label: 'Privacidad & Cifrado',
      icon: ShieldCheck,
    },
  ];

  return (
    <aside
      id="main-desktop-sidebar"
      className={`hidden md:flex flex-col w-64 lg:w-72 shrink-0 sticky top-[76px] sm:top-[82px] h-[calc(100vh-5.25rem)] border-r px-3 py-4 select-none ${
        darkMode ? 'border-neutral-800 bg-[#12161a]' : 'border-neutral-200 bg-white'
      }`}
    >
      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              id={`sidebar-link-${item.id}`}
              onClick={() => onSelectTab(item.id as ActiveTab)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#00aff0] text-white shadow-sm'
                  : darkMode
                  ? 'text-neutral-300 hover:bg-neutral-800/70 hover:text-white'
                  : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : item.highlight ? 'text-[#00aff0]' : ''}`} />
                <span>{item.label}</span>
                {item.e2ee && !isActive && (
                  <span title="Cifrado de extremo a extremo">
                    <Lock className="w-3 h-3 text-emerald-500" />
                  </span>
                )}
              </div>

              {item.badge && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                    isActive
                      ? 'bg-white text-[#00aff0]'
                      : 'bg-[#00aff0] text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Big Create Post Button */}
        <div className="pt-3">
          <button
            id="btn-sidebar-create-post"
            onClick={onOpenNewPost}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#00aff0] hover:bg-[#009fe0] active:scale-[0.98] text-white font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <PlusCircle className="w-5 h-5" />
            <span>NUEVA PUBLICACIÓN</span>
          </button>
        </div>
      </nav>

      {/* Security & User Footer */}
      <div
        className={`mt-auto pt-3 border-t ${
          darkMode ? 'border-neutral-800' : 'border-neutral-200'
        }`}
      >
        <div
          id="user-profile-badge-card"
          onClick={() => onSelectTab('creator-studio')}
          className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-colors ${
            darkMode ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover border border-[#00aff0]"
            />
            <div className="truncate">
              <div className="flex items-center gap-1">
                <span className="font-bold text-sm truncate">{currentUser.name}</span>
                {currentUser.isVerified && <BadgeCheck className="w-4 h-4 text-[#00aff0] shrink-0" />}
              </div>
              <span className="text-xs text-neutral-400 block truncate">
                @{currentUser.username}
              </span>
            </div>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 font-bold">
            ${currentUser.walletBalance.toFixed(2)}
          </span>
        </div>
      </div>
    </aside>
  );
};
