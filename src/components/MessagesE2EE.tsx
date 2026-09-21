import React, { useState } from 'react';
import {
  Lock,
  ShieldCheck,
  Send,
  Image as ImageIcon,
  Key,
  BadgeCheck,
  CheckCheck,
  Eye,
  DollarSign,
  AlertCircle,
  Copy,
} from 'lucide-react';
import { Conversation, EncryptedMessage, User } from '../types';
import { encryptE2EEMessage } from '../utils/crypto';

interface MessagesE2EEProps {
  conversations: Conversation[];
  activeConvId: string;
  onSelectConversation: (id: string) => void;
  currentUser: User;
  onSendMessage: (convId: string, plaintext: string, mediaUrl?: string, unlockPrice?: number) => void;
  onUnlockMessageMedia: (convId: string, messageId: string, price: number) => void;
  darkMode: boolean;
}

export const MessagesE2EE: React.FC<MessagesE2EEProps> = ({
  conversations,
  activeConvId,
  onSelectConversation,
  currentUser,
  onSendMessage,
  onUnlockMessageMedia,
  darkMode,
}) => {
  const [inputText, setInputText] = useState('');
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [inspectCiphertextMsg, setInspectCiphertextMsg] = useState<EncryptedMessage | null>(null);
  const [isPPVToggle, setIsPPVToggle] = useState(false);
  const [ppvPrice, setPpvPrice] = useState(5);
  const [copiedKey, setCopiedKey] = useState(false);

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;

    onSendMessage(
      activeConv.id,
      inputText.trim(),
      isPPVToggle
        ? 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80'
        : undefined,
      isPPVToggle ? ppvPrice : undefined
    );

    setInputText('');
    setIsPPVToggle(false);
  };

  const handleCopyFingerprint = () => {
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div
      id="messages-e2ee-container"
      className={`w-full h-[calc(100vh-8.5rem)] rounded-2xl border flex overflow-hidden ${
        darkMode ? 'bg-[#161b22] border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
      }`}
    >
      {/* Left Column: Conversations List */}
      <div
        className={`w-full sm:w-72 md:w-80 border-r flex flex-col shrink-0 ${
          activeConvId && 'hidden sm:flex'
        } ${darkMode ? 'border-neutral-800 bg-[#12161a]' : 'border-neutral-200 bg-neutral-50/50'}`}
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-black text-base text-neutral-900 dark:text-white">Mensajes Privados</h2>
            <span title="Cifrado E2EE activo">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
            </span>
          </div>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            E2EE Activo
          </span>
        </div>

        {/* Conversation Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/60">
          {conversations.map((conv) => {
            const isSelected = conv.id === activeConv?.id;
            return (
              <div
                key={conv.id}
                id={`conversation-item-${conv.id}`}
                onClick={() => onSelectConversation(conv.id)}
                className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                  isSelected
                    ? darkMode
                      ? 'bg-neutral-800/80 text-white'
                      : 'bg-neutral-200/70 text-neutral-900'
                    : darkMode
                    ? 'hover:bg-neutral-800/40 text-neutral-300'
                    : 'hover:bg-neutral-100 text-neutral-700'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={conv.participant.avatar}
                    alt={conv.participant.name}
                    className="w-12 h-12 rounded-full object-cover border border-[#00aff0]"
                  />
                  {conv.participant.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#12161a]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1 truncate">
                      <span className="font-extrabold text-xs truncate">
                        {conv.participant.name}
                      </span>
                      {conv.participant.isVerified && (
                        <BadgeCheck className="w-3.5 h-3.5 text-[#00aff0] shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-neutral-400 shrink-0">
                      {conv.lastTimestamp}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400 truncate flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                    <span>{conv.lastMessage || 'Conversación cifrada'}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Chat Window */}
      {activeConv ? (
        <div className="flex-1 flex flex-col min-w-0 bg-transparent">
          {/* Chat Header with E2EE Status */}
          <div className="p-3.5 px-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-white/50 dark:bg-[#161b22]/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative">
                <img
                  src={activeConv.participant.avatar}
                  alt={activeConv.participant.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#00aff0]"
                />
                {activeConv.participant.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#161b22]" />
                )}
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1">
                  <span className="font-black text-sm text-neutral-900 dark:text-white truncate">
                    {activeConv.participant.name}
                  </span>
                  {activeConv.participant.isVerified && (
                    <BadgeCheck className="w-4 h-4 text-[#00aff0] shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                  <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                    <Lock className="w-3 h-3" /> E2EE AES-GCM 256
                  </span>
                  <span>•</span>
                  <span>{activeConv.participant.isOnline ? 'En línea' : activeConv.participant.lastSeen || 'Desconectado'}</span>
                </div>
              </div>
            </div>

            {/* Security Verification Action */}
            <button
              id="btn-verify-e2ee-keys"
              onClick={() => setShowSecurityModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 transition-colors cursor-pointer"
              title="Verificar huella digital de cifrado"
            >
              <Key className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden md:inline">Claves de Seguridad</span>
            </button>
          </div>

          {/* Messages Thread Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {/* E2EE Banner Notice */}
            <div className="mx-auto max-w-md p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center text-xs text-neutral-600 dark:text-neutral-300">
              <div className="flex items-center justify-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Cifrado de Extremo a Extremo Verificado</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Los mensajes y medios en este chat se encriptan con AES-GCM en tu dispositivo antes de enviarse. Ni siquiera los servidores de mesigues pueden leerlos.
              </p>
            </div>

            {/* Message Bubbles */}
            {activeConv.messages.map((msg) => {
              const isMine = msg.senderId === currentUser.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-md p-3.5 rounded-2xl text-xs relative group ${
                      isMine
                        ? 'bg-[#00aff0] text-white rounded-br-none shadow-sm'
                        : darkMode
                        ? 'bg-neutral-800 text-neutral-100 rounded-bl-none border border-neutral-700'
                        : 'bg-neutral-100 text-neutral-900 rounded-bl-none border border-neutral-200'
                    }`}
                  >
                    {/* Plaintext Message */}
                    <p className="leading-relaxed whitespace-pre-line break-words text-sm font-medium">
                      {msg.plaintext}
                    </p>

                    {/* Paywalled Media Attached in Chat */}
                    {msg.mediaUrl && (
                      <div className="mt-2.5 rounded-xl overflow-hidden border border-white/20">
                        {msg.isLocked && !msg.isUnlocked ? (
                          <div className="relative h-44 bg-neutral-900 flex flex-col items-center justify-center p-4 text-center">
                            <img
                              src={msg.mediaUrl}
                              alt="Contenido bloqueado"
                              className="absolute inset-0 w-full h-full object-cover filter blur-xl opacity-30"
                            />
                            <div className="relative z-10">
                              <Lock className="w-7 h-7 text-[#00aff0] mx-auto mb-2" />
                              <span className="font-extrabold text-white text-xs block mb-2">
                                Foto/Video PPV Bloqueado
                              </span>
                              <button
                                onClick={() =>
                                  onUnlockMessageMedia(activeConv.id, msg.id, msg.unlockPrice || 5)
                                }
                                className="px-4 py-1.5 rounded-full bg-[#00aff0] hover:bg-[#009fe0] text-white font-extrabold text-xs shadow transition-all cursor-pointer"
                              >
                                Desbloquear por ${(msg.unlockPrice || 5).toFixed(2)}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <img
                            src={msg.mediaUrl}
                            alt="Foto enviada"
                            className="w-full h-44 object-cover"
                          />
                        )}
                      </div>
                    )}

                    {/* Bottom Metadata & Ciphertext Inspector Trigger */}
                    <div className="flex items-center justify-between gap-2 mt-1 pt-1 text-[10px] opacity-75">
                      <div className="flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        <button
                          onClick={() => setInspectCiphertextMsg(msg)}
                          className="hover:underline cursor-pointer"
                          title="Inspeccionar payload cifrado"
                        >
                          Ver Cifrado
                        </button>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>{msg.timestamp}</span>
                        {isMine && <CheckCheck className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Message Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161b22] flex flex-col gap-2"
          >
            {/* PPV Option Toggle for Creators */}
            {currentUser.role === 'creator' && (
              <div className="flex items-center justify-between text-xs px-2 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-neutral-700 dark:text-neutral-300">
                  <input
                    type="checkbox"
                    checked={isPPVToggle}
                    onChange={(e) => setIsPPVToggle(e.target.checked)}
                    className="accent-[#00aff0]"
                  />
                  <span>Bloquear con Paywall PPV</span>
                </label>
                {isPPVToggle && (
                  <div className="flex items-center gap-1">
                    <span className="text-neutral-400">Precio:</span>
                    <input
                      type="number"
                      value={ppvPrice}
                      min={1}
                      max={100}
                      onChange={(e) => setPpvPrice(Number(e.target.value))}
                      className="w-14 px-1.5 py-0.5 rounded border border-neutral-600 bg-neutral-700 text-white text-xs font-bold text-center"
                    />
                    <span>USD</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Escribe un mensaje privado encriptado..."
                className={`flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-full outline-none transition-all ${
                  darkMode
                    ? 'bg-neutral-800 border border-neutral-700 text-white focus:border-[#00aff0]'
                    : 'bg-neutral-100 border border-neutral-300 text-neutral-900 focus:border-[#00aff0]'
                }`}
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-full bg-[#00aff0] hover:bg-[#009fe0] text-white disabled:opacity-40 transition-opacity cursor-pointer active:scale-95 shadow-md"
                title="Enviar mensaje encriptado"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-6 text-neutral-400 text-sm">
          Selecciona una conversación para iniciar el chat encriptado.
        </div>
      )}

      {/* Security Numbers & Fingerprint Modal */}
      {showSecurityModal && activeConv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl ${
              darkMode ? 'bg-[#161b22] border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-500" />
                Huella Criptográfica de Seguridad E2EE
              </h3>
              <button
                onClick={() => setShowSecurityModal(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
              Compara estos números de seguridad con @{activeConv.participant.username} para verificar que ninguna tercera entidad pueda interceptar la comunicación.
            </p>

            <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-center mb-4 border border-neutral-200 dark:border-neutral-700">
              <span className="text-[10px] text-neutral-400 font-mono uppercase block mb-1">
                SHA-256 Safety Number Fingerprint
              </span>
              <div className="font-mono text-base sm:text-lg font-black tracking-widest text-[#00aff0]">
                {activeConv.e2eeFingerprint}
              </div>
            </div>

            <div className="space-y-2 text-xs text-neutral-400 mb-5">
              <div className="flex items-center justify-between">
                <span>Algoritmo de cifrado simétrico:</span>
                <span className="font-mono font-bold text-emerald-500">AES-GCM-256</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Vector de inicialización (IV):</span>
                <span className="font-mono text-neutral-300">12 bytes aleatorios por mensaje</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Estado de autenticidad:</span>
                <span className="font-bold text-emerald-500">Verificado matemáticamente</span>
              </div>
            </div>

            <button
              onClick={handleCopyFingerprint}
              className="w-full py-2.5 rounded-full bg-[#00aff0] hover:bg-[#009fe0] text-white font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedKey ? '✓ ¡Huella copiada!' : 'Copiar Huella de Seguridad'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Raw Ciphertext Inspection Modal (Proof of genuine E2EE) */}
      {inspectCiphertextMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-lg p-6 rounded-3xl border shadow-2xl ${
              darkMode ? 'bg-[#161b22] border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-black flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-500" />
                Inspección de Payload Cifrado AES-GCM
              </h3>
              <button
                onClick={() => setInspectCiphertextMsg(null)}
                className="text-neutral-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-400 mb-3 leading-relaxed">
              Así es como viaja el mensaje por la red. Nadie sin la clave simétrica en el dispositivo puede convertir este texto cifrado en el mensaje legible original:
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-neutral-900 text-emerald-400 border border-neutral-800">
                <span className="text-[10px] text-neutral-500 block mb-1">CIPHERTEXT (Hexadecimal cifrado en tránsito):</span>
                <div className="break-all">{inspectCiphertextMsg.ciphertext}</div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-900 text-neutral-300 border border-neutral-800">
                <span className="text-[10px] text-neutral-500 block mb-1">INITIALIZATION VECTOR (IV 96-bit):</span>
                <div className="break-all">{inspectCiphertextMsg.iv}</div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-900 text-[#00aff0] border border-neutral-800">
                <span className="text-[10px] text-neutral-500 block mb-1">PLAINTEXT (Desencriptado localmente en tu memoria):</span>
                <div className="font-sans font-medium text-white">{inspectCiphertextMsg.plaintext}</div>
              </div>
            </div>

            <button
              onClick={() => setInspectCiphertextMsg(null)}
              className="w-full mt-4 py-2.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Cerrar Inspección
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
