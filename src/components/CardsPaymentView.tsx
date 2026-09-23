import React, { useState } from 'react';
import { CreditCard, Plus, ShieldCheck, Check, Trash2, DollarSign, Wallet, History, ArrowUpRight, Lock } from 'lucide-react';
import { User } from '../types';

interface CardsPaymentViewProps {
  currentUser: User;
  onTopUpWallet: (amount: number) => void;
  darkMode: boolean;
}

export const CardsPaymentView: React.FC<CardsPaymentViewProps> = ({
  currentUser,
  onTopUpWallet,
  darkMode,
}) => {
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardAddedSuccess, setCardAddedSuccess] = useState(false);

  const [savedCards, setSavedCards] = useState([
    { id: 'card_1', brand: 'Visa', last4: '4242', exp: '12/28', isDefault: true },
    { id: 'card_2', brand: 'MasterCard', last4: '8819', exp: '09/27', isDefault: false },
  ]);

  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !expiry || !cvv) return;

    const newCard = {
      id: 'card_' + Date.now(),
      brand: cardNumber.startsWith('5') ? 'MasterCard' : 'Visa',
      last4: cardNumber.slice(-4) || '1234',
      exp: expiry,
      isDefault: savedCards.length === 0,
    };

    setSavedCards((prev) => [...prev, newCard]);
    setCardAddedSuccess(true);
    setTimeout(() => {
      setCardAddedSuccess(false);
      setShowAddCard(false);
      setCardNumber('');
      setCardHolder('');
      setExpiry('');
      setCvv('');
    }, 1500);
  };

  const setDefaultCard = (id: string) => {
    setSavedCards((prev) =>
      prev.map((c) => ({ ...c, isDefault: c.id === id }))
    );
  };

  const deleteCard = (id: string) => {
    setSavedCards((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div id="of-cards-payment-view" className="max-w-4xl mx-auto pb-20 animate-fade-in space-y-5">
      {/* Wallet Balance Header */}
      <div
        className={`p-6 rounded-3xl border ${
          darkMode ? 'bg-[#161b22] border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-neutral-400 block mb-1">
              Saldo Disponible de Billetera
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-black text-[#00aff0]">
                ${currentUser.walletBalance.toFixed(2)}
              </span>
              <span className="text-xs text-neutral-400 font-bold">USD</span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Usa tu saldo para suscripciones mensuales automáticas, desbloqueo de posts PPV y propinas.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {[10, 25, 50, 100].map((amt) => (
              <button
                key={amt}
                onClick={() => onTopUpWallet(amt)}
                className="px-3.5 py-2 rounded-xl border border-[#00aff0]/30 hover:border-[#00aff0] bg-[#00aff0]/10 hover:bg-[#00aff0] text-[#00aff0] hover:text-white font-extrabold text-xs transition-all cursor-pointer active:scale-95 shadow-xs"
              >
                +${amt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Cards Section */}
      <div
        className={`p-6 rounded-3xl border space-y-4 ${
          darkMode ? 'bg-[#161b22] border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#00aff0]/15 flex items-center justify-center text-[#00aff0]">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black">Tus Tarjetas de Pago</h2>
              <p className="text-xs text-neutral-400">Tarjetas de crédito o débito vinculadas para compras seguras</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddCard(!showAddCard)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#00aff0] hover:bg-[#009fe0] text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Tarjeta</span>
          </button>
        </div>

        {/* Add Card Form Modal / Expandable */}
        {showAddCard && (
          <form
            onSubmit={handleAddCardSubmit}
            className={`p-4 rounded-2xl border space-y-3 ${
              darkMode ? 'bg-neutral-900 border-neutral-700' : 'bg-neutral-50 border-neutral-200'
            }`}
          >
            <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-400">
              Datos de la Nueva Tarjeta
            </h3>

            <div>
              <label className="text-xs font-bold text-neutral-500 mb-1 block">Número de Tarjeta</label>
              <input
                type="text"
                placeholder="4000 1234 5678 9010"
                maxLength={19}
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-xs outline-none border transition-all ${
                  darkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-900'
                }`}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-neutral-500 mb-1 block">Vencimiento (MM/AA)</label>
                <input
                  type="text"
                  placeholder="12/28"
                  maxLength={5}
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs outline-none border transition-all ${
                    darkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-900'
                  }`}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-500 mb-1 block">CVV</label>
                <input
                  type="password"
                  placeholder="•••"
                  maxLength={4}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs outline-none border transition-all ${
                    darkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-900'
                  }`}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-500 mb-1 block">Nombre en la Tarjeta</label>
              <input
                type="text"
                placeholder="Como aparece en la tarjeta"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-xs outline-none border transition-all ${
                  darkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-900'
                }`}
              />
            </div>

            {cardAddedSuccess ? (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 text-xs font-bold flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4" /> Tarjeta guardada exitosamente
              </div>
            ) : (
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#00aff0] hover:bg-[#009fe0] text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer"
                >
                  Guardar Tarjeta
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCard(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            )}
          </form>
        )}

        {/* Saved Cards List */}
        <div className="space-y-2.5">
          {savedCards.map((card) => (
            <div
              key={card.id}
              className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                card.isDefault
                  ? 'border-[#00aff0] bg-[#00aff0]/5'
                  : darkMode
                  ? 'border-neutral-800 bg-neutral-900/50'
                  : 'border-neutral-200 bg-neutral-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-neutral-800 to-neutral-700 text-white flex items-center justify-center font-black text-xs shadow-xs">
                  {card.brand === 'Visa' ? 'VISA' : 'MC'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs sm:text-sm">
                      {card.brand} terminada en •••• {card.last4}
                    </span>
                    {card.isDefault && (
                      <span className="px-2 py-0.5 rounded-full bg-[#00aff0] text-white text-[10px] font-black">
                        Predeterminada
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-neutral-400">Vence: {card.exp}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!card.isDefault && (
                  <button
                    onClick={() => setDefaultCard(card.id)}
                    className="text-xs font-bold text-[#00aff0] hover:underline cursor-pointer"
                  >
                    Hacer predeterminada
                  </button>
                )}
                {savedCards.length > 1 && (
                  <button
                    onClick={() => deleteCard(card.id)}
                    className="p-1.5 rounded-full text-neutral-400 hover:text-rose-500 transition-colors cursor-pointer"
                    title="Eliminar tarjeta"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Security badge */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 text-emerald-500 text-xs">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Tus datos están protegidos bajo certificación PCI-DSS Nivel 1 y cifrado bancario 256-bit.</span>
        </div>
      </div>

      {/* Transaction History / Statements */}
      <div
        className={`p-6 rounded-3xl border space-y-4 ${
          darkMode ? 'bg-[#161b22] border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#00aff0]/15 flex items-center justify-center text-[#00aff0]">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black">Extractos y Movimientos</h2>
              <p className="text-xs text-neutral-400">Historial reciente de recargas, suscripciones y propinas</p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-neutral-200 dark:divide-neutral-800 text-xs">
          {[
            { id: 'tx_1', desc: 'Suscripción mensual a @elena_fit', date: 'Hoy, 14:30', amount: -12.99, status: 'COMPLETADO' },
            { id: 'tx_2', desc: 'Recarga de Billetera vía Tarjeta Visa', date: 'Ayer, 18:20', amount: +50.00, status: 'COMPLETADO' },
            { id: 'tx_3', desc: 'Propina a @valentina_glam en DM', date: '19 Sep 2026', amount: -10.00, status: 'COMPLETADO' },
            { id: 'tx_4', desc: 'Desbloqueo de Set Exclusivo PPV', date: '18 Sep 2026', amount: -15.00, status: 'COMPLETADO' },
          ].map((tx) => (
            <div key={tx.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-neutral-900 dark:text-white">{tx.desc}</div>
                <div className="text-[10px] text-neutral-400">{tx.date}</div>
              </div>
              <div className="text-right">
                <span
                  className={`font-black text-xs ${
                    tx.amount > 0 ? 'text-emerald-500' : 'text-neutral-900 dark:text-white'
                  }`}
                >
                  {tx.amount > 0 ? `+${tx.amount.toFixed(2)}` : `${tx.amount.toFixed(2)}`} USD
                </span>
                <span className="block text-[10px] text-emerald-500 font-bold">{tx.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
