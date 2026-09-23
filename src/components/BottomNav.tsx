import React from 'react';
import { Home, Bell, PlusCircle, MessageSquare, User } from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  unreadNotifications: number;
  unreadMessages: number;
  onOpenNewPost: () => void;
  darkMode: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  unreadNotifications,
  unreadMessages,
  onOpenNewPost,
  darkMode,
}) => {
  return (
    <nav
      id="mobile-bottom-navigation"
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-lg px-2 py-1.5 flex items-center justify-around transition-colors safe-area-pb ${
        darkMode ? 'bg-[#12161a]/95 border-neutral-800 text-neutral-400' : 'bg-white/95 border-neutral-200 text-neutral-600'
      }`}
    >
      {/* Home / Feed */}
      <button
        id="btn-mobile-nav-feed"
        onClick={() => onSelectTab('feed')}
        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer ${
          activeTab === 'feed' ? 'text-[#00aff0] font-bold' : ''
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Inicio</span>
      </button>

      {/* Notifications */}
      <button
        id="btn-mobile-nav-notifications"
        onClick={() => onSelectTab('notifications')}
        className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer ${
          activeTab === 'notifications' ? 'text-[#00aff0] font-bold' : ''
        }`}
      >
        <Bell className="w-5 h-5" />
        {unreadNotifications > 0 && (
          <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-[#00aff0] text-white text-[9px] font-extrabold flex items-center justify-center">
            {unreadNotifications}
          </span>
        )}
        <span className="text-[10px] mt-0.5">Alertas</span>
      </button>

      {/* Floating Center Create Button */}
      <button
        id="btn-mobile-nav-create"
        onClick={onOpenNewPost}
        className="flex items-center justify-center w-11 h-11 rounded-full bg-[#00aff0] text-white shadow-md active:scale-95 transition-transform cursor-pointer -mt-4 border-2 border-white dark:border-[#12161a]"
        title="Crear Publicación"
      >
        <PlusCircle className="w-6 h-6" />
      </button>

      {/* Messages with unread badge */}
      <button
        id="btn-mobile-nav-messages"
        onClick={() => onSelectTab('messages')}
        className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer ${
          activeTab === 'messages' ? 'text-[#00aff0] font-bold' : ''
        }`}
      >
        <MessageSquare className="w-5 h-5" />
        {unreadMessages > 0 && (
          <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-[#00aff0] text-white text-[9px] font-extrabold flex items-center justify-center">
            {unreadMessages}
          </span>
        )}
        <span className="text-[10px] mt-0.5">Chats</span>
      </button>

      {/* Profile */}
      <button
        id="btn-mobile-nav-profile"
        onClick={() => onSelectTab('my-profile')}
        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer ${
          activeTab === 'my-profile' ? 'text-[#00aff0] font-bold' : ''
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Perfil</span>
      </button>
    </nav>
  );
};
