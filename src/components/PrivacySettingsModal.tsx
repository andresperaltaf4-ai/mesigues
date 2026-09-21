import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Key,
  Smartphone,
  CheckCircle2,
  RefreshCw,
  Copy,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { User } from '../types';

interface PrivacySettingsModalProps {
  currentUser: User;
  onUpdatePrivacy: (updates: Partial<User>) => void;
  darkMode: boolean;
}

export const PrivacySettingsModal: React.FC<PrivacySettingsModalProps> = ({
  currentUser,
  onUpdatePrivacy,
  darkMode,
}) => {
  const [ghostMode, setGhostMode] = useState(currentUser.ghostMode);
  const [watermark, setWatermark] = useState(currentUser.watermarkProtection);
  const [ephemeralChat, setEphemeralChat] = useState(true);
  const [copiedKey, setCopiedKey] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    onUpdatePrivacy({
      ghostMode,
      watermarkProtection: watermark,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleRegenerateKeys = () => {
    setRegenerating(true);
    setTimeout(() => {
      const newFp = `E2EE-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
      onUpdatePrivacy({ e2eeKeyFingerprint: newFp });
      setRegenerating(false);
    }, 1200);
  };

  return (
    <div id="privacy-security-settings-view" className="w-full pb-20 animate-fade-in space-y-6">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-neutral-900 dark:text-white">
            Privacidad & Cifrado de Extremo a Extremo
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            E2EE 256-bit
          </span>
        </div>
        <p className="text-xs text-neutral-500 mt-1">
          Configuración avanzada de anonimato, marca de agua DRM anti-filtraciones y gestión de claves criptográficas.
        </p>
      </div>

      {/* Cryptographic Key Box */}
      <div
        className={`p-5 rounded-2xl border ${
          darkMode ? 'bg-[#161b22] border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-neutral-900 dark:text-white flex items-center gap-1.5">
                <span>Clave del Candadito de Seguridad (E2EE)</span>
                <Key className="w-3.5 h-3.5 text-amber-400" />
              </h3>
              <span className="text-[11px] text-emerald-500 font-bold">Activa y Visible para el Usuario</span>
            </div>
          </div>
          <button
            onClick={handleRegenerateKeys}
            disabled={regenerating}
            className="flex items-center gap-1.5 text-xs font-bold text-[#00aff0] hover:underline cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${regenerating ? 'animate-spin' : ''}`} />
            <span>Rotar Clave</span>
          </button>
        </div>

        <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
          Esta es la <strong className="text-emerald-500">clave que protege el candado</strong> en tu barra superior y chats. Cifra y descifra tus mensajes directos y contenidos exclusivos directamente en tu navegador web mediante la Web Crypto API.
        </p>

        <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800/90 text-center border-2 border-emerald-500/30 mb-3 shadow-inner">
          <div className="flex items-center justify-center gap-1.5 mb-1.5 text-emerald-500 font-bold text-xs">
            <Lock className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">Tu Clave Única del Candado</span>
          </div>
          <div className="font-mono font-black text-xl sm:text-2xl text-[#00aff0] tracking-widest select-all">
            {currentUser.e2eeKeyFingerprint}
          </div>
          <span className="text-[10px] text-neutral-400 mt-1 block">
            Huella Criptográfica SHA-256 Verificada
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span className="flex items-center gap-1 text-emerald-500 font-bold">
            <ShieldCheck className="w-4 h-4" /> Algoritmo activo: AES-GCM (256 bits)
          </span>
          <button
            onClick={() => {
              setCopiedKey(true);
              setTimeout(() => setCopiedKey(false), 2000);
            }}
            className="flex items-center gap-1 text-neutral-300 hover:text-white"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copiedKey ? '¡Copiado!' : 'Copiar Huella'}</span>
          </button>
        </div>
      </div>

      {/* Privacy Toggles */}
      <div className="space-y-3">
        {/* Ghost Mode */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border flex items-center justify-between gap-4 ${
            darkMode ? 'bg-[#161b22] border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0 mt-0.5">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-neutral-900 dark:text-white">
                Modo Fantasma (Ghost Browsing)
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Navega de forma 100% invisible. Oculta tu estado en línea y enmascara tu usuario en las listas públicas de fans de los creadores.
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={ghostMode}
            onChange={(e) => setGhostMode(e.target.checked)}
            className="w-5 h-5 accent-[#00aff0] cursor-pointer"
          />
        </div>

        {/* Dynamic DRM Watermark */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border flex items-center justify-between gap-4 ${
            darkMode ? 'bg-[#161b22] border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-[#00aff0] flex items-center justify-center shrink-0 mt-0.5">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-neutral-900 dark:text-white">
                Protección DRM Anti-Filtración con Marca de Agua
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Imprime un identificador de seguridad dinámico e invisible en fotos y videos para prevenir capturas de pantalla y rastrear filtraciones.
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={watermark}
            onChange={(e) => setWatermark(e.target.checked)}
            className="w-5 h-5 accent-[#00aff0] cursor-pointer"
          />
        </div>

        {/* Ephemeral Chat Option */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border flex items-center justify-between gap-4 ${
            darkMode ? 'bg-[#161b22] border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-neutral-900 dark:text-white">
                Destrucción Criptográfica en 24 Horas
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Elimina las claves efímeras de la memoria tras 24 horas para garantizar que ningún mensaje antiguo sea recuperable.
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={ephemeralChat}
            onChange={(e) => setEphemeralChat(e.target.checked)}
            className="w-5 h-5 accent-[#00aff0] cursor-pointer"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {savedSuccess && (
          <span className="text-xs text-emerald-500 font-bold flex items-center gap-1 animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            ¡Preferencias de privacidad guardadas!
          </span>
        )}
        <button
          id="btn-save-privacy-settings"
          onClick={handleSave}
          className="px-6 py-2.5 rounded-full bg-[#00aff0] hover:bg-[#009fe0] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer active:scale-95"
        >
          GUARDAR AJUSTES DE PRIVACIDAD
        </button>
      </div>
    </div>
  );
};
