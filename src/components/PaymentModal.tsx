import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Lock,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  Copy,
  Wallet,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { User } from '../types';
import { BrandLogo } from './BrandLogo';

export type PaymentPurpose =
  | { type: 'subscription'; creatorName: string; creatorUsername: string; tierName: string; price: number }
  | { type: 'ppv_unlock'; postId: string; title: string; price: number; creatorUsername: string }
  | { type: 'tip'; creatorName: string; creatorUsername: string; price: number }
  | { type: 'wallet_topup'; price: number };

interface PaymentModalProps {
  purpose: PaymentPurpose;
  currentUser: User;
  onClose: () => void;
  onPaymentSuccess: (amount: number, method: string, purpose: PaymentPurpose) => void;
  darkMode: boolean;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  purpose,
  currentUser,
  onClose,
  onPaymentSuccess,
  darkMode,
}) => {
  const [method, setMethod] = useState<'CARD' | 'CRYPTO' | 'WALLET'>(
    currentUser.walletBalance >= purpose.price ? 'WALLET' : 'CARD'
  );

  // Card Form State
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8921');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvc, setCardCvc] = useState('•••');
  const [cardName, setCardName] = useState(currentUser.name);

  // Crypto State
  const [cryptoToken, setCryptoToken] = useState<'USDT' | 'BTC' | 'ETH'>('USDT');
  const [cryptoTimeLeft, setCryptoTimeLeft] = useState(899); // 15 mins
  const [copiedAddr, setCopiedAddr] = useState(false);

  // Processing & 3D Secure State
  const [isProcessing, setIsProcessing] = useState(false);
  const [is3DSecureStep, setIs3DSecureStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [paymentDone, setPaymentDone] = useState(false);
  const [txnReceiptId, setTxnReceiptId] = useState('');

  // Countdown timer for crypto
  useEffect(() => {
    if (method !== 'CRYPTO') return;
    const interval = setInterval(() => {
      setCryptoTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [method]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartPayment = () => {
    setIsProcessing(true);

    if (method === 'CARD') {
      // Trigger 3D Secure verification step simulation
      setTimeout(() => {
        setIsProcessing(false);
        setIs3DSecureStep(true);
      }, 900);
    } else {
      // Wallet or Crypto direct confirmation
      setTimeout(() => {
        completePayment(method);
      }, 1200);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      completePayment('CARD_3DS');
    }, 1000);
  };

  const completePayment = (finalMethod: string) => {
    const receipt = 'TXN_' + Math.random().toString(36).substring(2, 10).toUpperCase();
    setTxnReceiptId(receipt);
    setIsProcessing(false);
    setIs3DSecureStep(false);
    setPaymentDone(true);

    setTimeout(() => {
      onPaymentSuccess(purpose.price, finalMethod, purpose);
    }, 1800);
  };

  const cryptoAddress =
    cryptoToken === 'USDT'
      ? 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
      : cryptoToken === 'BTC'
      ? 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
      : '0x71C...3E9942a';

  return (
    <div
      id="payment-gateway-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
    >
      <div
        className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden ${
          darkMode ? 'bg-[#161b22] border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrandLogo size="sm" showText={false} />
            <span className="font-extrabold text-sm sm:text-base">Pasarela de Pago Segura mesigues</span>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-neutral-400 hover:text-white p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Success Receipt View */}
          {paymentDone ? (
            <div className="text-center py-6 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-500 mx-auto mb-3 animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-black text-emerald-500 mb-1">
                ¡Transacción Completada con Éxito!
              </h3>
              <p className="text-xs text-neutral-400 mb-4">
                El pago ha sido procesado de forma segura bajo el protocolo cifrado PCI-DSS.
              </p>

              <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-xs text-left space-y-2 border border-neutral-200 dark:border-neutral-700">
                <div className="flex justify-between">
                  <span className="text-neutral-400">ID de Comprobante:</span>
                  <span className="font-mono font-bold text-[#00aff0]">{txnReceiptId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Monto Total:</span>
                  <span className="font-bold">${purpose.price.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Concepto:</span>
                  <span className="font-semibold truncate max-w-[200px]">
                    {purpose.type === 'subscription' && `Suscripción a @${purpose.creatorUsername}`}
                    {purpose.type === 'ppv_unlock' && `Desbloqueo PPV (${purpose.title})`}
                    {purpose.type === 'tip' && `Propina para @${purpose.creatorUsername}`}
                    {purpose.type === 'wallet_topup' && 'Recarga de Saldo Billetera'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Seguridad:</span>
                  <span className="text-emerald-500 font-bold">Cifrado E2EE • Tokenizado</span>
                </div>
              </div>

              <div className="mt-4 text-[11px] text-neutral-400">
                Desbloqueando acceso al contenido en tiempo real...
              </div>
            </div>
          ) : is3DSecureStep ? (
            /* 3D Secure / OTP Verification Step Simulation */
            <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center">
                <ShieldCheck className="w-8 h-8 text-[#00aff0] mx-auto mb-2" />
                <h4 className="text-sm font-black text-neutral-900 dark:text-white mb-1">
                  Verificación 3D Secure / Verified by Visa
                </h4>
                <p className="text-xs text-neutral-400">
                  Hemos enviado un código SMS de autenticación de 6 dígitos a tu teléfono asociado terminado en **42.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-400 block mb-1">
                  Introduce el Código de Seguridad:
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Ej: 789123"
                  className="w-full text-center tracking-widest text-lg font-mono font-black py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 text-white outline-none focus:border-[#00aff0]"
                  autoFocus
                />
                <span className="text-[10px] text-neutral-500 block text-center mt-1">
                  (Para pruebas: puedes ingresar cualquier código o pulsar confirmar)
                </span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 rounded-full bg-[#00aff0] hover:bg-[#009fe0] text-white font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isProcessing ? 'Verificando con tu banco...' : 'CONFIRMAR Y AUTORIZAR PAGO'}
              </button>
            </form>
          ) : (
            /* Standard Checkout View */
            <>
              {/* Purpose & Price Banner */}
              <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 flex items-center justify-between border border-neutral-200 dark:border-neutral-700">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#00aff0]">
                    Total a Pagar
                  </span>
                  <h4 className="text-sm font-bold truncate max-w-[240px]">
                    {purpose.type === 'subscription' && `Suscripción • @${purpose.creatorUsername}`}
                    {purpose.type === 'ppv_unlock' && `Desbloqueo PPV • @${purpose.creatorUsername}`}
                    {purpose.type === 'tip' && `Propina Directa • @${purpose.creatorUsername}`}
                    {purpose.type === 'wallet_topup' && 'Recarga de Saldo'}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-neutral-900 dark:text-white">
                    ${purpose.price.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-neutral-400 block">USD</span>
                </div>
              </div>

              {/* Payment Method Selector Tabs */}
              <div>
                <label className="text-xs font-bold text-neutral-400 block mb-2">
                  Selecciona la Pasarela de Pago:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {/* Option 1: MeSigues Wallet */}
                  <button
                    type="button"
                    onClick={() => setMethod('WALLET')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      method === 'WALLET'
                        ? 'border-[#00aff0] bg-[#00aff0]/10 text-[#00aff0]'
                        : 'border-neutral-300 dark:border-neutral-700 text-neutral-400'
                    }`}
                  >
                    <Wallet className="w-4 h-4 mb-1" />
                    <div className="text-xs font-black text-neutral-900 dark:text-white">Billetera</div>
                    <div className="text-[10px] text-emerald-500 font-bold">
                      ${currentUser.walletBalance.toFixed(2)} disp.
                    </div>
                  </button>

                  {/* Option 2: Credit Card */}
                  <button
                    type="button"
                    onClick={() => setMethod('CARD')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      method === 'CARD'
                        ? 'border-[#00aff0] bg-[#00aff0]/10 text-[#00aff0]'
                        : 'border-neutral-300 dark:border-neutral-700 text-neutral-400'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mb-1" />
                    <div className="text-xs font-black text-neutral-900 dark:text-white">Tarjeta</div>
                    <div className="text-[10px] text-neutral-400">Visa / MC / Amex</div>
                  </button>

                  {/* Option 3: Crypto Web3 Pay */}
                  <button
                    type="button"
                    onClick={() => setMethod('CRYPTO')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      method === 'CRYPTO'
                        ? 'border-[#00aff0] bg-[#00aff0]/10 text-[#00aff0]'
                        : 'border-neutral-300 dark:border-neutral-700 text-neutral-400'
                    }`}
                  >
                    <QrCode className="w-4 h-4 mb-1" />
                    <div className="text-xs font-black text-neutral-900 dark:text-white">Crypto Pay</div>
                    <div className="text-[10px] text-neutral-400">USDT / BTC / ETH</div>
                  </button>
                </div>
              </div>

              {/* Method Specific Form */}
              {method === 'WALLET' && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold text-neutral-900 dark:text-white">
                    <span>Saldo disponible:</span>
                    <span className="text-emerald-500 font-black">${currentUser.walletBalance.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between font-bold text-neutral-900 dark:text-white">
                    <span>Saldo restante tras pago:</span>
                    <span>${Math.max(0, currentUser.walletBalance - purpose.price).toFixed(2)}</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 pt-1 border-t border-emerald-500/20">
                    Pago instantáneo con 1 solo clic debitado directamente de tu balance en mesigues.
                  </p>
                </div>
              )}

              {method === 'CARD' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                      Número de Tarjeta
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono outline-none focus:border-[#00aff0]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                        Caducidad (MM/AA)
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono outline-none text-center focus:border-[#00aff0]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                        Código CVV / CVC
                      </label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                          type="password"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono outline-none text-center focus:border-[#00aff0]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {method === 'CRYPTO' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {(['USDT', 'BTC', 'ETH'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setCryptoToken(t)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            cryptoToken === t
                              ? 'bg-[#00aff0] text-white'
                              : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-mono font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatTimer(cryptoTimeLeft)}</span>
                    </div>
                  </div>

                  {/* QR Simulator Box */}
                  <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-center border border-neutral-200 dark:border-neutral-700">
                    <div className="w-28 h-28 mx-auto bg-white p-2 rounded-xl shadow-inner flex items-center justify-center mb-2">
                      <QrCode className="w-full h-full text-neutral-900" />
                    </div>
                    <span className="text-[10px] text-neutral-400 block mb-1">
                      Envía exactamente ${purpose.price.toFixed(2)} {cryptoToken} (Red TRC20 / ERC20)
                    </span>
                    <div className="flex items-center justify-center gap-1 font-mono text-[11px] text-[#00aff0] bg-white dark:bg-neutral-900 py-1.5 px-3 rounded-lg border border-neutral-300 dark:border-neutral-700">
                      <span className="truncate max-w-[200px]">{cryptoAddress}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setCopiedAddr(true);
                          setTimeout(() => setCopiedAddr(false), 2000);
                        }}
                        className="text-neutral-400 hover:text-white p-0.5"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    {copiedAddr && (
                      <span className="text-[10px] text-emerald-500 font-bold block mt-1">
                        ✓ Dirección copiada al portapapeles
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Security Badges */}
              <div className="flex items-center justify-center gap-4 text-[10px] text-neutral-400 pt-1">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-500" /> Cifrado TLS 1.3 / E2EE
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#00aff0]" /> Certificado PCI-DSS Nivel 1
                </span>
              </div>

              {/* Pay Button */}
              <button
                id="btn-confirm-gateway-payment"
                onClick={handleStartPayment}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-full bg-[#00aff0] hover:bg-[#009fe0] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              >
                {isProcessing ? (
                  <span>Procesando pago de forma segura...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>PAGAR ${purpose.price.toFixed(2)} USD DE FORMA SEGURA</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
