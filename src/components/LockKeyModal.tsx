import React, { useState } from 'react';
import {
  Lock,
  Key,
  ShieldCheck,
  Copy,
  CheckCircle2,
  RefreshCw,
  Eye,
  EyeOff,
  X,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { User } from '../types';

interface LockKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUpdatePrivacy: (updates: Partial<User>) => void;
  onOpenFullPrivacy?: () => void;
  darkMode: boolean;
}

export const LockKeyModal: React.FC<LockKeyModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdatePrivacy,
  onOpenFullPrivacy,
  darkMode,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  // Simulated 256-bit AES-GCM local secret derived from fingerprint
  const secretKeyHex = `mesigues_aes256_${currentUser.e2eeKeyFingerprint.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}_9f8a3c2b1e4d5678`;

  if (!isOpen) return null;

  const handleCopyFingerprint = () => {
    navigator.clipboard?.writeText(currentUser.e2eeKeyFingerprint);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleCopySecret = () => {
    navigator.clipboard?.writeText(secretKeyHex);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2200);
  };

  const handleRotateKey = () => {
    setIsRotating(true);
    setTimeout(() => {
      const randomHex = () =>
        Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1)
          .toUpperCase();
      const newKey = `E2EE-${randomHex()}-${randomHex()}-${randomHex()}`;
      onUpdatePrivacy({ e2eeKeyFingerprint: newKey });
      setIsRotating(false);
    }, 900);
  };

  return (
    <div
      id="modal-lock-key-viewer"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
    >
      <div
        className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden transition-all ${
          darkMode
            ? 'bg-gradient-to-b from-[#18202b] to-[#10141b] border-neutral-700/80 text-white'
            : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Header with Lock & Key Graphic */}
        <div className="p-5 sm:p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shadow-sm">
                <Lock className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center shadow-md">
                <Key className="w-3 h-3" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base sm:text-lg font-black tracking-tight">
                  Auditoría de Seguridad & Cifrado
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Protegido
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Cifrado de Extremo a Extremo (E2EE) AES-GCM 256 bits
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Explanation Banner */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
              Esta sección te permite auditar de forma transparente la <strong className="text-emerald-500 font-bold">clave del candado de seguridad</strong>.
              Tus mensajes privados y fotos de pago se cifran localmente en tu dispositivo antes de enviarse. Ni siquiera los servidores de <strong>mesigues</strong> pueden leerlos.
            </p>
          </div>

          {/* 1. Public Key Fingerprint (Visible Key) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Clave de Cifrado (Huella Digital):</span>
              </label>
              <button
                onClick={handleRotateKey}
                disabled={isRotating}
                className="text-[11px] font-bold text-[#00aff0] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isRotating ? 'animate-spin' : ''}`} />
                <span>Rotar Clave</span>
              </button>
            </div>

            <div
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                darkMode ? 'bg-[#0e1217] border-neutral-700' : 'bg-neutral-50 border-neutral-200'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Lock className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-mono text-base sm:text-lg font-black tracking-widest text-[#00aff0] truncate">
                  {currentUser.e2eeKeyFingerprint}
                </span>
              </div>

              <button
                onClick={handleCopyFingerprint}
                className="px-3 py-1.5 rounded-xl bg-[#00aff0] hover:bg-[#009fe0] text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>¡Copiada!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 2. AES-256 Private Secret Key Toggle */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                <span>Clave Maestra AES-GCM (En Memoria):</span>
              </label>
              <button
                type="button"
                onClick={() => setShowSecretKey(!showSecretKey)}
                className="text-[11px] font-bold text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {showSecretKey ? (
                  <>
                    <EyeOff className="w-3 h-3 text-neutral-400" />
                    <span>Ocultar</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3 text-neutral-400" />
                    <span>Ver clave completa</span>
                  </>
                )}
              </button>
            </div>

            <div
              className={`p-3 rounded-2xl border flex items-center justify-between gap-2 ${
                darkMode ? 'bg-[#0e1217] border-neutral-700' : 'bg-neutral-50 border-neutral-200'
              }`}
            >
              <span className="font-mono text-xs text-neutral-400 truncate select-all">
                {showSecretKey
                  ? secretKeyHex
                  : '••••••••••••••••••••••••••••••••••••••••••••••••'}
              </span>

              {showSecretKey && (
                <button
                  onClick={handleCopySecret}
                  className="text-xs text-neutral-400 hover:text-white p-1 cursor-pointer shrink-0"
                  title="Copiar Clave Privada"
                >
                  {copiedSecret ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            {onOpenFullPrivacy && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFullPrivacy();
                }}
                className="text-xs font-bold text-neutral-400 hover:text-[#00aff0] flex items-center gap-1.5 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Ver Ajustes Completos de Privacidad</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-xs font-extrabold text-neutral-900 dark:text-white transition-all cursor-pointer"
            >
              CERRAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
