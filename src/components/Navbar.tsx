import React, { useState } from 'react';
import {
  Search,
  Shield,
  Wallet,
  Bell,
  Moon,
  Sun,
  PlusCircle,
  Lock,
  EyeOff,
  Sparkles,
  Key,
} from 'lucide-react';
import { User } from '../types';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  currentUser: User;
  onOpenNewPost: () => void;
  onOpenWallet: () => void;
  onOpenPrivacy: () => void;
  onOpenNotifications: () => void;
  unreadNotifications: number;
  onSearch: (query: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onSwitchRole: () => void;
  onOpenKeyModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenNewPost,
  onOpenWallet,
  onOpenPrivacy,
  onOpenNotifications,
  unreadNotifications,
  onSearch,
  darkMode,
  onToggleDarkMode,
  onSwitchRole,
  onOpenKeyModal,
}) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <header
      id="main-navbar"
      className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors ${
        darkMode
          ? 'bg-[#12161a]/95 border-neutral-800 text-neutral-100'
          : 'bg-white/95 border-neutral-200 text-neutral-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 min-h-[76px] sm:min-h-[82px] flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo - mesigues Alta Gama */}
        <div className="flex items-center gap-3">
          <div id="nav-brand-logo">
            <BrandLogo size="md" />
          </div>

          {/* Privacy & E2EE Status Pill - Indicador Discreto */}
          <button
            id="btn-navbar-e2ee-status"
            onClick={onOpenKeyModal || onOpenPrivacy}
            title="Conexión Cifrada (E2EE) • Clic para auditar la seguridad"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 transition-all cursor-pointer shadow-xs group"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-500 group-hover:scale-110 transition-transform" />
            <span className="font-bold tracking-tight">Conexión Cifrada</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />

            {currentUser.ghostMode && (
              <span className="hidden lg:flex items-center gap-1 pl-1.5 border-l border-emerald-500/30 text-indigo-500">
                <EyeOff className="w-3 h-3" /> Ghost
              </span>
            )}
          </button>
        </div>

        {/* Live Search Bar */}
        <div className="flex-1 max-w-md mx-2 sm:mx-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              id="input-navbar-search"
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Buscar creadores (@elena_fit, fitness, cosplay...)"
              className={`w-full pl-10 pr-4 py-1.5 text-sm rounded-full transition-all outline-none ${
                darkMode
                  ? 'bg-neutral-800/80 border border-neutral-700 text-white placeholder-neutral-400 focus:border-[#00aff0] focus:ring-1 focus:ring-[#00aff0]'
                  : 'bg-neutral-100 border border-transparent text-neutral-900 placeholder-neutral-500 focus:bg-white focus:border-[#00aff0] focus:ring-1 focus:ring-[#00aff0]'
              }`}
            />
          </div>
        </div>

        {/* Action Controls & Wallet */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Creator New Post Quick Button */}
          <button
            id="btn-navbar-new-post"
            onClick={onOpenNewPost}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00aff0] hover:bg-[#009fe0] text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow transition-all cursor-pointer active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publicar</span>
          </button>

          {/* Secure Wallet Balance Pill */}
          <button
            id="btn-navbar-wallet"
            onClick={onOpenWallet}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
              darkMode
                ? 'bg-neutral-800 border-neutral-700 hover:border-[#00aff0] text-neutral-200'
                : 'bg-neutral-100 border-neutral-200 hover:border-[#00aff0] text-neutral-800'
            }`}
            title="Billetera Segura y Pasarela de Pago"
          >
            <Wallet className="w-3.5 h-3.5 text-[#00aff0]" />
            <span>${currentUser.walletBalance.toFixed(2)}</span>
          </button>

          {/* Notifications Trigger */}
          <button
            id="btn-navbar-notifications"
            onClick={onOpenNotifications}
            className={`relative p-2 rounded-full transition-colors cursor-pointer ${
              darkMode ? 'hover:bg-neutral-800 text-neutral-300' : 'hover:bg-neutral-100 text-neutral-700'
            }`}
            title="Notificaciones"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#00aff0] text-white text-[10px] font-extrabold flex items-center justify-center animate-pulse">
                {unreadNotifications}
              </span>
            )}
          </button>

          {/* Role Switcher (Fan vs Creator Mode) */}
          <button
            id="btn-navbar-role-switch"
            onClick={onSwitchRole}
            className={`hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
              currentUser.role === 'creator'
                ? 'bg-purple-500/10 text-purple-600 border-purple-500/30'
                : 'bg-blue-500/10 text-blue-600 border-blue-500/30'
            }`}
            title="Cambiar vista: Fan o Creador"
          >
            <Sparkles className="w-3 h-3" />
            <span>{currentUser.role === 'creator' ? 'Modo Creador' : 'Modo Fan'}</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            id="btn-navbar-theme-toggle"
            onClick={onToggleDarkMode}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              darkMode ? 'hover:bg-neutral-800 text-amber-400' : 'hover:bg-neutral-100 text-neutral-600'
            }`}
            title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
