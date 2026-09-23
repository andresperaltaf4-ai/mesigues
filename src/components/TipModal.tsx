import React, { useState } from 'react';
import { X, DollarSign, Heart, Sparkles, ShieldCheck, Check } from 'lucide-react';
import { User } from '../types';

interface TipModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorName: string;
  creatorUsername: string;
  creatorAvatar: string;
  currentUser: User;
  onConfirmTip: (amount: number, message: string, method: 'WALLET' | 'CARD') => void;
  darkMode: boolean;
}

export const TipModal: React.FC<TipModalProps> = ({
  isOpen,
  onClose,
  creatorName,
  creatorUsername,
  creatorAvatar,
  currentUser,
  onConfirmTip,
  darkMode,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [tipMessage, setTipMessage] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'WALLET' | 'CARD'>('WALLET');

  if (!isOpen) return null;

  const presetAmounts = [5, 10, 20, 50, 100];
  const finalAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (finalAmount <= 0) return;
    onConfirmTip(finalAmount, tipMessage, paymentMethod);
    onClose();
  };

  return (
    <div
      id="of-tip-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in"
    >
      <div
        id="of-tip-modal-container"
        className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden transition-all ${
          darkMode ? 'bg-[#1c222b] border-[#283240] text-white' : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#00aff0]/15 flex items-center justify-center text-[#00aff0]">
              <DollarSign className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-sm sm:text-base">ENVIAR PROPINA</h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              darkMode ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-100 text-neutral-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Creator Info */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#00aff0]/5 border border-[#00aff0]/20">
            <img
              src={creatorAvatar}
              alt={creatorName}
              className="w-12 h-12 rounded-full object-cover border border-[#00aff0]"
            />
            <div className="truncate">
              <span className="font-bold text-sm block truncate">{creatorName}</span>
              <span className="text-xs text-neutral-400 block truncate">@{creatorUsername}</span>
            </div>
          </div>

          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Seleccionar monto (USD)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {presetAmounts.map((amt) => {
                const isSelected = !customAmount && selectedAmount === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#00aff0] text-white shadow-md scale-105'
                        : darkMode
                        ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    ${amt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">$</span>
              <input
                type="number"
                min="1"
                step="1"
                placeholder="Otro monto personalizado..."
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className={`w-full pl-8 pr-4 py-2.5 rounded-xl text-sm font-bold outline-none border transition-all ${
                  customAmount ? 'border-[#00aff0]' : darkMode ? 'border-neutral-700 bg-neutral-800/80 text-white' : 'border-neutral-300 bg-neutral-50 text-neutral-900'
                }`}
              />
            </div>
          </div>

          {/* Tip Message */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
              Mensaje personalizado (opcional)
            </label>
            <textarea
              rows={2}
              value={tipMessage}
              onChange={(e) => setTipMessage(e.target.value)}
              placeholder="Escribe un mensaje de apoyo para el creador..."
              className={`w-full p-3 rounded-xl text-xs outline-none border resize-none transition-all ${
                darkMode ? 'border-neutral-700 bg-neutral-800/80 text-white focus:border-[#00aff0]' : 'border-neutral-300 bg-neutral-50 text-neutral-900 focus:border-[#00aff0]'
              }`}
            />
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">
              Método de pago
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('WALLET')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  paymentMethod === 'WALLET'
                    ? 'border-[#00aff0] bg-[#00aff0]/10 text-[#00aff0] font-bold'
                    : darkMode
                    ? 'border-neutral-700 text-neutral-400'
                    : 'border-neutral-200 text-neutral-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Billetera</span>
                  {paymentMethod === 'WALLET' && <Check className="w-3.5 h-3.5" />}
                </div>
                <div className="text-[11px] text-emerald-500 mt-1 font-bold">
                  ${currentUser.walletBalance.toFixed(2)} disp.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  paymentMethod === 'CARD'
                    ? 'border-[#00aff0] bg-[#00aff0]/10 text-[#00aff0] font-bold'
                    : darkMode
                    ? 'border-neutral-700 text-neutral-400'
                    : 'border-neutral-200 text-neutral-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Tarjeta Guardada</span>
                  {paymentMethod === 'CARD' && <Check className="w-3.5 h-3.5" />}
                </div>
                <div className="text-[11px] text-neutral-400 mt-1">Visa •••• 4242</div>
              </button>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            type="submit"
            disabled={finalAmount <= 0}
            className="w-full py-3 px-4 rounded-full bg-[#00aff0] hover:bg-[#009fe0] text-white text-sm font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>ENVIAR PROPINA DE ${finalAmount.toFixed(2)} USD</span>
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-400 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Transacción 100% cifrada y procesada por ME SIGUES Payments</span>
          </div>
        </form>
      </div>
    </div>
  );
};
