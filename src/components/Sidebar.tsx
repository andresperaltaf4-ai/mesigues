import React, { useState } from 'react';
import {
  Home,
  Bell,
  MessageSquare,
  Bookmark,
  Users,
  CreditCard,
  User as UserIcon,
  MoreHorizontal,
  PlusCircle,
  Archive,
  BarChart3,
  ShieldCheck,
  Moon,
  Sun,
  BadgeCheck,
  HelpCircle,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { User } from '../types';

export type ActiveTab =
  | 'feed'
  | 'notifications'
  | 'messages'
  | 'collections'
  | 'subscriptions'
  | 'cards'
  | 'my-profile'
  | 'explore'
  | 'wallet'
  | 'creator-studio'
  | 'vault'
  | 'privacy';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  currentUser: User;
  unreadNotifications: number;
  unreadMessages: number;
  onOpenNewPost: () => void;
  darkMode: boolean;
  onToggleDarkMode?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  unreadNotifications,
  unreadMessages,
  onOpenNewPost,
  darkMode,
  onToggleDarkMode,
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const mainNavItems = [
    { id: 'feed', label: 'Inicio', icon: Home },
    {
      id: 'notifications',
      label: 'Notificaciones',
      icon: Bell,
      badge: unreadNotifications > 0 ? unreadNotifications : undefined,
    },
    {
      id: 'messages',
      label: 'Mensajes',
      icon: MessageSquare,
      badge: unreadMessages > 0 ? unreadMessages : undefined,
    },
    { id: 'collections', label: 'Marcadores', icon: Bookmark },
    { id: 'subscriptions', label: 'Suscripciones', icon: Users },
    { id: 'cards', label: 'Añadir tarjeta', icon: CreditCard },
    { id: 'my-profile', label: 'Mi Perfil', icon: UserIcon },
  ];

  return (
    <aside
      id="main-desktop-sidebar"
      className={`hidden md:flex flex-col w-64 lg:w-72 shrink-0 sticky top-[76px] sm:top-[82px] h-[calc(100vh-5.25rem)] border-r px-3 py-4 select-none ${
        darkMode ? 'border-[#283240] bg-[#12171e]' : 'border-neutral-200 bg-white'
      }`}
    >
      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              id={`sidebar-link-${item.id}`}
              onClick={() => {
                setShowMoreMenu(false);
                onSelectTab(item.id as ActiveTab);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-full text-sm font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#00aff0] text-white shadow-sm'
                  : darkMode
                  ? 'text-neutral-300 hover:bg-[#1c222b] hover:text-white'
                  : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                    isActive ? 'bg-white text-[#00aff0]' : 'bg-[#00aff0] text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* More (Más) Trigger with Dropdown */}
        <div className="relative">
          <button
            id="sidebar-link-more"
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-full text-sm font-bold transition-all cursor-pointer ${
              showMoreMenu || ['vault', 'creator-studio', 'privacy'].includes(activeTab)
                ? 'bg-neutral-200 dark:bg-neutral-800 text-[#00aff0]'
                : darkMode
                ? 'text-neutral-300 hover:bg-[#1c222b] hover:text-white'
                : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <MoreHorizontal className="w-5 h-5" />
              <span>Más</span>
            </div>
          </button>

          {/* More Dropdown Menu */}
          {showMoreMenu && (
            <div
              className={`absolute bottom-full left-0 mb-2 w-64 rounded-2xl border shadow-xl p-2 z-50 animate-fade-in ${
                darkMode ? 'bg-[#1c222b] border-[#283240] text-neutral-200' : 'bg-white border-neutral-200 text-neutral-800'
              }`}
            >
              <button
                onClick={() => {
                  onSelectTab('vault');
                  setShowMoreMenu(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold hover:bg-[#00aff0]/10 hover:text-[#00aff0] transition-colors cursor-pointer"
              >
                <Archive className="w-4 h-4" />
                <span>Bóveda (Vault)</span>
              </button>

              <button
                onClick={() => {
                  onSelectTab('creator-studio');
                  setShowMoreMenu(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold hover:bg-[#00aff0]/10 hover:text-[#00aff0] transition-colors cursor-pointer"
              >
                <BarChart3 className="w-4 h-4 text-[#00aff0]" />
                <span>Panel de Creador & Ganancias</span>
              </button>

              <button
                onClick={() => {
                  onSelectTab('privacy');
                  setShowMoreMenu(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold hover:bg-[#00aff0]/10 hover:text-[#00aff0] transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Ajustes & Privacidad E2EE</span>
              </button>

              {onToggleDarkMode && (
                <button
                  onClick={() => {
                    onToggleDarkMode();
                    setShowMoreMenu(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold hover:bg-[#00aff0]/10 hover:text-[#00aff0] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                    <span>{darkMode ? 'Modo Claro' : 'Modo Oscuro'}</span>
                  </div>
                </button>
              )}

              <div className="my-1 border-t border-neutral-200 dark:border-neutral-800" />

              <a
                href="#help"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Soporte técnico y centro de ayuda oficial OnlyFans disponible 24/7.');
                  setShowMoreMenu(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-neutral-400" />
                <span>Ayuda & Soporte</span>
              </a>
            </div>
          )}
        </div>

        {/* Big OnlyFans "NUEVA PUBLICACIÓN" Button */}
        <div className="pt-4">
          <button
            id="btn-sidebar-create-post"
            onClick={onOpenNewPost}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-full bg-[#00aff0] hover:bg-[#009fe0] active:scale-[0.98] text-white font-black text-sm tracking-wide shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <PlusCircle className="w-5 h-5" />
            <span>NUEVA PUBLICACIÓN</span>
          </button>
        </div>
      </nav>

      {/* User Footer Profile Pill */}
      <div
        className={`mt-auto pt-3 border-t ${
          darkMode ? 'border-[#283240]' : 'border-neutral-200'
        }`}
      >
        <div
          id="user-profile-badge-card"
          onClick={() => onSelectTab('my-profile')}
          className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-colors ${
            darkMode ? 'hover:bg-[#1c222b]' : 'hover:bg-neutral-100'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-[#00aff0]"
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
          <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 font-bold shrink-0">
            ${currentUser.walletBalance.toFixed(2)}
          </span>
        </div>
      </div>
    </aside>
  );
};
