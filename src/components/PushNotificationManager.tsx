import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  DollarSign,
  Heart,
  Lock,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Send,
  X,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { NotificationItem } from '../types';

interface PushNotificationManagerProps {
  notifications: NotificationItem[];
  activeToast: NotificationItem | null;
  onDismissToast: () => void;
  onMarkAllAsRead: () => void;
  onTriggerCustomPush: (title: string, message: string, type: NotificationItem['type']) => void;
  onCloseCenter?: () => void;
  darkMode: boolean;
}

export const PushNotificationManager: React.FC<PushNotificationManagerProps> = ({
  notifications,
  activeToast,
  onDismissToast,
  onMarkAllAsRead,
  onTriggerCustomPush,
  onCloseCenter,
  darkMode,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'tips' | 'subs' | 'messages' | 'moderation'>('all');
  const [customPushTitle, setCustomPushTitle] = useState('');
  const [customPushBody, setCustomPushBody] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'tips') return n.type === 'tip';
    if (activeFilter === 'subs') return n.type === 'subscription';
    if (activeFilter === 'messages') return n.type === 'message';
    if (activeFilter === 'moderation') return n.type === 'moderation';
    return true;
  });

  const handleSendCustomPush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPushTitle.trim() || !customPushBody.trim()) return;

    onTriggerCustomPush(customPushTitle.trim(), customPushBody.trim(), 'post');
    setCustomPushTitle('');
    setCustomPushBody('');
  };

  const getIconForType = (type: NotificationItem['type']) => {
    switch (type) {
      case 'tip':
        return <DollarSign className="w-4 h-4 text-emerald-500" />;
      case 'subscription':
        return <Sparkles className="w-4 h-4 text-[#00aff0]" />;
      case 'message':
        return <Lock className="w-4 h-4 text-purple-500" />;
      case 'moderation':
        return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
      default:
        return <Bell className="w-4 h-4 text-[#00aff0]" />;
    }
  };

  return (
    <>
      {/* Real-time Floating Web Push Toaster (Top Right) */}
      {activeToast && (
        <div
          id="web-push-floating-toast"
          className="fixed top-18 right-4 z-50 max-w-sm w-full animate-bounce-short cursor-pointer"
        >
          <div
            className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-md flex items-start gap-3 relative ${
              darkMode
                ? 'bg-[#161b22]/95 border-[#00aff0]/40 text-white'
                : 'bg-white/95 border-[#00aff0]/30 text-neutral-900 shadow-xl'
            }`}
          >
            {activeToast.avatar ? (
              <img
                src={activeToast.avatar}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover border-2 border-[#00aff0] shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#00aff0]/20 text-[#00aff0] flex items-center justify-center shrink-0">
                {getIconForType(activeToast.type)}
              </div>
            )}

            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-[#00aff0] text-white">
                  MESIGUES PUSH
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">Ahora</span>
              </div>
              <h4 className="font-extrabold text-xs text-neutral-900 dark:text-white truncate">
                {activeToast.title}
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-300 leading-snug">
                {activeToast.message}
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDismissToast();
              }}
              className="absolute top-2 right-2 text-neutral-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Full Notification Center View */}
      <div id="notification-center-view" className="w-full pb-20 animate-fade-in space-y-5">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <div>
            <h1 className="text-2xl font-black text-neutral-900 dark:text-white flex items-center gap-2">
              <Bell className="w-6 h-6 text-[#00aff0]" />
              Centro de Notificaciones Push
            </h1>
            <p className="text-xs text-neutral-500">
              Alertas en tiempo real de nuevo contenido, propinas recibidas y mensajes encriptados.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-full border text-xs font-bold transition-all ${
                soundEnabled ? 'border-emerald-500 text-emerald-500 bg-emerald-500/10' : 'border-neutral-700 text-neutral-400'
              }`}
              title={soundEnabled ? 'Sonido de push activado' : 'Sonido desactivado'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={onMarkAllAsRead}
              className="text-xs font-bold px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 transition-colors"
            >
              Marcar todas como leídas
            </button>
          </div>
        </div>

        {/* Creator Engagement Tool: Send Custom Push Notification */}
        <div
          id="custom-push-engagement-card"
          className={`p-4 sm:p-5 rounded-2xl border ${
            darkMode ? 'bg-[#161b22] border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-extrabold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Enviar Notificación Push a tus Fans (Engagement Booster)
            </h3>
            <span className="text-[11px] text-emerald-500 font-bold">1,482 dispositivos activos</span>
          </div>
          <p className="text-xs text-neutral-400 mb-3">
            Lanza una alerta instantánea en las pantallas de tus suscriptores para avisarles de un set exclusivo o llamada privada.
          </p>

          <form onSubmit={handleSendCustomPush} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <input
              type="text"
              value={customPushTitle}
              onChange={(e) => setCustomPushTitle(e.target.value)}
              placeholder="Título: ej: ¡En vivo en 5 minutos! 🔥"
              className="px-3.5 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-800 text-white outline-none focus:border-[#00aff0]"
            />
            <input
              type="text"
              value={customPushBody}
              onChange={(e) => setCustomPushBody(e.target.value)}
              placeholder="Mensaje: ej: No te pierdas el detrás de cámaras..."
              className="px-3.5 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-800 text-white outline-none focus:border-[#00aff0]"
            />
            <button
              type="submit"
              disabled={!customPushTitle.trim() || !customPushBody.trim()}
              className="py-2 px-4 rounded-xl bg-[#00aff0] hover:bg-[#009fe0] disabled:opacity-50 text-white font-extrabold text-xs shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>DISPARAR PUSH INMEDIATA</span>
            </button>
          </form>
        </div>

        {/* Filter Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'tips', label: 'Propinas Recibidas' },
            { id: 'subs', label: 'Suscripciones' },
            { id: 'messages', label: 'DMs Cifrados E2EE' },
            { id: 'moderation', label: 'Auditoría IA' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-full transition-all shrink-0 cursor-pointer ${
                activeFilter === f.id
                  ? 'bg-[#00aff0] text-white shadow-sm'
                  : darkMode
                  ? 'bg-neutral-800 text-neutral-400 hover:text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-2.5">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                !notif.isRead
                  ? darkMode
                    ? 'bg-[#182230] border-[#00aff0]/30'
                    : 'bg-blue-50/50 border-[#00aff0]/20'
                  : darkMode
                  ? 'bg-[#161b22] border-neutral-800'
                  : 'bg-white border-neutral-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {notif.avatar ? (
                  <img
                    src={notif.avatar}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full object-cover border border-[#00aff0] shrink-0 mt-0.5"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                    {getIconForType(notif.type)}
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-extrabold text-sm text-neutral-900 dark:text-white">
                      {notif.title}
                    </h4>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#00aff0]" />
                    )}
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-1">
                    {notif.message}
                  </p>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {notif.timestamp}
                  </span>
                </div>
              </div>

              <div className="shrink-0 pt-1">
                {getIconForType(notif.type)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
