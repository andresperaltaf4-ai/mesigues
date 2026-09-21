import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  Eye,
  Send,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Download,
  Filter,
  Sparkles,
  CreditCard,
} from 'lucide-react';
import { AnalyticsData, User } from '../types';

interface CreatorDashboardProps {
  analytics: AnalyticsData;
  currentUser: User;
  onSendMassPPV: (message: string, price: number) => void;
  onRequestPayout: (amount: number, method: 'BANK' | 'CRYPTO') => void;
  darkMode: boolean;
}

export const CreatorDashboard: React.FC<CreatorDashboardProps> = ({
  analytics,
  currentUser,
  onSendMassPPV,
  onRequestPayout,
  darkMode,
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');
  const [massMsgText, setMassMsgText] = useState('');
  const [massMsgPrice, setMassMsgPrice] = useState<number>(10);
  const [massMsgSent, setMassMsgSent] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState<'BANK' | 'CRYPTO'>('BANK');
  const [payoutAmount, setPayoutAmount] = useState<number>(analytics.netEarnings);
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  // Mock moderation audit logs for the creator
  const moderationLogs = [
    {
      id: 'mod_1',
      title: 'Sesión sauna Miami Beach (PPV)',
      timestamp: '20 Sep 17:15',
      risk: 'LOW',
      score: '99%',
      tag: 'VERIFIED_SAFE',
      type: 'Post Multimedia',
      status: 'Aprobado automáticamente',
    },
    {
      id: 'mod_2',
      title: 'Entreno Gym Lunes (Público)',
      timestamp: '20 Sep 18:30',
      risk: 'LOW',
      score: '98%',
      tag: 'VERIFIED_SAFE',
      type: 'Post Libre',
      status: 'Aprobado automáticamente',
    },
    {
      id: 'mod_3',
      title: 'Mensaje E2EE con archivo adjunto',
      timestamp: '19 Sep 22:10',
      risk: 'LOW',
      score: '97%',
      tag: 'VERIFIED_SAFE',
      type: 'DM Cifrado',
      status: 'Cifrado E2EE sin infracciones',
    },
  ];

  const handleMassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!massMsgText.trim()) return;
    onSendMassPPV(massMsgText, massMsgPrice);
    setMassMsgSent(true);
    setTimeout(() => {
      setMassMsgSent(false);
      setMassMsgText('');
    }, 3000);
  };

  const handleConfirmPayout = () => {
    onRequestPayout(payoutAmount, payoutMethod);
    setPayoutSuccess(true);
    setTimeout(() => {
      setPayoutSuccess(false);
      setShowPayoutModal(false);
    }, 2500);
  };

  // Find max value in chart for SVG scaling
  const maxEarnings = Math.max(...analytics.chartData.map((d) => d.earnings), 1200);

  return (
    <div id="creator-studio-dashboard" className="w-full pb-24 animate-fade-in space-y-6">
      {/* Title & Payout Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
              Panel de Creador & Analíticas
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#00aff0]/10 text-[#00aff0]">
              mesigues Studio Pro
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Gestión de ingresos, suscriptores, difusión masiva PPV y cumplimiento de políticas por IA.
          </p>
        </div>

        {/* Payout Trigger Button */}
        <button
          id="btn-request-payout"
          onClick={() => setShowPayoutModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
        >
          <CreditCard className="w-4 h-4" />
          <span>SOLICITAR RETIRO (${analytics.netEarnings.toLocaleString()})</span>
        </button>
      </div>

      {/* Main KPI Revenue Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Gross Revenue */}
        <div
          id="kpi-card-gross"
          className={`p-4 rounded-2xl border ${
            darkMode ? 'bg-[#161b22] border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>Ingresos Brutos</span>
            <DollarSign className="w-4 h-4 text-[#00aff0]" />
          </div>
          <div className="text-2xl font-black text-neutral-900 dark:text-white">
            ${analytics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1 text-emerald-500 text-xs mt-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+24.8% vs mes anterior</span>
          </div>
        </div>

        {/* Net Creator Earnings (80% Payout) */}
        <div
          id="kpi-card-net"
          className={`p-4 rounded-2xl border ${
            darkMode ? 'bg-[#161b22] border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>Ganancia Neta (80%)</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            ${analytics.netEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-neutral-400 mt-1">
            Fondos libres disponibles
          </div>
        </div>

        {/* Active Subscribers */}
        <div
          id="kpi-card-subs"
          className={`p-4 rounded-2xl border ${
            darkMode ? 'bg-[#161b22] border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>Fans Suscritos</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-neutral-900 dark:text-white">
            {analytics.activeSubscribers.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-emerald-500 text-xs mt-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+89 esta semana</span>
          </div>
        </div>

        {/* PPV & Tips breakdown */}
        <div
          id="kpi-card-ppv"
          className={`p-4 rounded-2xl border ${
            darkMode ? 'bg-[#161b22] border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>Ventas PPV & Propinas</span>
            <Lock className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-neutral-900 dark:text-white">
            ${(analytics.ppvSales + analytics.totalTips).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-neutral-400 mt-1">
            ${analytics.totalTips} propinas • ${analytics.ppvSales} desbloqueos
          </div>
        </div>
      </div>

      {/* Interactive Performance Graph (Pure Scalable SVG) */}
      <div
        id="creator-analytics-chart-card"
        className={`p-5 rounded-2xl border ${
          darkMode ? 'bg-[#161b22] border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-extrabold text-base text-neutral-900 dark:text-white">
              Rendimiento Diario de Ingresos y Nuevos Fans
            </h3>
            <p className="text-xs text-neutral-400">
              Datos auditados en tiempo real con liquidación garantizada
            </p>
          </div>
          <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                timeRange === '7d'
                  ? 'bg-white dark:bg-neutral-700 text-[#00aff0] shadow-sm'
                  : 'text-neutral-500'
              }`}
            >
              Últimos 7 Días
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                timeRange === '30d'
                  ? 'bg-white dark:bg-neutral-700 text-[#00aff0] shadow-sm'
                  : 'text-neutral-500'
              }`}
            >
              Mes Actual
            </button>
          </div>
        </div>

        {/* SVG Chart Graphic */}
        <div className="relative h-60 w-full pt-4">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
            {/* Horizontal Grid lines */}
            {[0, 50, 100, 150].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="700"
                y2={y}
                stroke={darkMode ? '#262f3d' : '#e5e7eb'}
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            ))}

            {/* Gradient Area under curve */}
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00aff0" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#00aff0" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Coordinates generator */}
            {(() => {
              const points = analytics.chartData.map((d, i) => {
                const x = (i / (analytics.chartData.length - 1)) * 680 + 10;
                const y = 180 - (d.earnings / maxEarnings) * 160;
                return { x, y, data: d };
              });

              const pathD = points.reduce((acc, curr, idx) => {
                return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
              }, '');

              const areaD = `${pathD} L ${points[points.length - 1].x} 190 L ${points[0].x} 190 Z`;

              return (
                <>
                  <path d={areaD} fill="url(#chartGradient)" />
                  <path d={pathD} fill="none" stroke="#00aff0" strokeWidth="3" strokeLinecap="round" />
                  {points.map((pt, idx) => (
                    <g key={idx} className="group">
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="5"
                        fill="#00aff0"
                        className="transition-transform group-hover:scale-150 cursor-pointer"
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                      <text
                        x={pt.x}
                        y={pt.y - 12}
                        textAnchor="middle"
                        fill={darkMode ? '#9ca3af' : '#4b5563'}
                        fontSize="11"
                        fontWeight="bold"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ${pt.data.earnings}
                      </text>
                    </g>
                  ))}
                </>
              );
            })()}
          </svg>

          {/* X-axis labels */}
          <div className="flex justify-between text-[11px] text-neutral-400 mt-2">
            {analytics.chartData.map((d, i) => (
              <span key={i} className="text-center">{d.date}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Mass PPV Message Tool & Top Fans Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Mass PPV Blast to all 1,482 Subscribers */}
        <div
          id="mass-ppv-card"
          className={`p-5 rounded-2xl border ${
            darkMode ? 'bg-[#161b22] border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-extrabold text-base text-neutral-900 dark:text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-[#00aff0]" />
              Mensaje Masivo PPV a Suscriptores
            </h3>
            <span className="text-xs text-neutral-500 font-semibold">
              1,482 destinatarios
            </span>
          </div>
          <p className="text-xs text-neutral-400 mb-4">
            Envía un mensaje privado encriptado E2EE simultáneo a todos tus fans con contenido de pago para desbloquear.
          </p>

          <form onSubmit={handleMassSubmit} className="space-y-3">
            <textarea
              rows={3}
              value={massMsgText}
              onChange={(e) => setMassMsgText(e.target.value)}
              placeholder="Escribe el mensaje exclusivo (ej: ¡Nuevo set sorpresa en el jacuzzi! Desbloquea para ver las 8 fotos completas...)"
              className={`w-full p-3 text-xs rounded-xl outline-none transition-all ${
                darkMode
                  ? 'bg-neutral-800 border border-neutral-700 text-white focus:border-[#00aff0]'
                  : 'bg-neutral-50 border border-neutral-300 text-neutral-900 focus:border-[#00aff0]'
              }`}
            />

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-500">Precio de desbloqueo:</span>
                <div className="flex items-center gap-1">
                  {[5, 10, 15, 25].map((price) => (
                    <button
                      key={price}
                      type="button"
                      onClick={() => setMassMsgPrice(price)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        massMsgPrice === price
                          ? 'bg-[#00aff0] text-white'
                          : darkMode
                          ? 'bg-neutral-800 text-neutral-400'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      ${price}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={!massMsgText.trim() || massMsgSent}
                className="px-4 py-2 rounded-full bg-[#00aff0] hover:bg-[#009fe0] disabled:opacity-50 text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                {massMsgSent ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>¡Enviado a 1,482 fans!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>ENVIAR MASIVO PPV</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Top Fans VIP Leaderboard */}
        <div
          id="top-fans-card"
          className={`p-5 rounded-2xl border ${
            darkMode ? 'bg-[#161b22] border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-extrabold text-base text-neutral-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Fans VIP Más Fieles
            </h3>
            <span className="text-xs text-neutral-500 font-bold">Top Tippers</span>
          </div>

          <div className="space-y-3">
            {analytics.topFans.map((fan, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-xl flex items-center justify-between border ${
                  darkMode ? 'bg-neutral-800/40 border-neutral-700/60' : 'bg-neutral-50 border-neutral-200/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={fan.avatar}
                      alt={fan.name}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center shadow">
                      {i + 1}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs">{fan.name}</h4>
                    <span className="text-[11px] text-[#00aff0] font-semibold">{fan.badge}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-emerald-500 block">
                    ${fan.spentTotal.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-neutral-400">Gasto acumulado</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Automated AI Moderation Audit Log */}
      <div
        id="moderation-audit-log-card"
        className={`p-5 rounded-2xl border ${
          darkMode ? 'bg-[#161b22] border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-extrabold text-base text-neutral-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Auditoría Automatizada de Cumplimiento (Gemini 3.8 Flash AI)
            </h3>
            <p className="text-xs text-neutral-400">
              Monitoreo continuo de contenidos para garantizar el 100% de cumplimiento de normas comunitarias.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Estado de cuenta: Excelente (0 infracciones)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400">
                <th className="pb-2 font-bold">Elemento Auditado</th>
                <th className="pb-2 font-bold">Tipo</th>
                <th className="pb-2 font-bold">Fecha</th>
                <th className="pb-2 font-bold">Riesgo IA</th>
                <th className="pb-2 font-bold">Confianza</th>
                <th className="pb-2 font-bold text-right">Certificado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {moderationLogs.map((log) => (
                <tr key={log.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-2.5 font-bold text-neutral-800 dark:text-neutral-200">{log.title}</td>
                  <td className="py-2.5 text-neutral-500">{log.type}</td>
                  <td className="py-2.5 text-neutral-400">{log.timestamp}</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                      {log.risk}
                    </span>
                  </td>
                  <td className="py-2.5 font-mono text-neutral-400">{log.score}</td>
                  <td className="py-2.5 text-right">
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-500">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{log.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Modal Dialog */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl ${
              darkMode ? 'bg-[#161b22] border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black">Solicitud de Retiro Seguro</h3>
              <button
                onClick={() => setShowPayoutModal(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {payoutSuccess ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-3 animate-bounce" />
                <h4 className="text-lg font-black text-emerald-500 mb-1">¡Retiro Procesado con Éxito!</h4>
                <p className="text-xs text-neutral-400">
                  Se ha transferido ${payoutAmount.toLocaleString()} a tu cuenta seleccionada ({payoutMethod}). Recibirás el comprobante en tu email.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-neutral-400 block mb-1">Monto a retirar</label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="number"
                      value={payoutAmount}
                      max={analytics.netEarnings}
                      onChange={(e) => setPayoutAmount(Number(e.target.value))}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 text-white font-bold outline-none"
                    />
                  </div>
                  <span className="text-[11px] text-neutral-400 mt-1 block">
                    Disponible: ${analytics.netEarnings.toLocaleString()}
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-400 block mb-1">Método de Transferencia</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPayoutMethod('BANK')}
                      className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                        payoutMethod === 'BANK'
                          ? 'border-[#00aff0] bg-[#00aff0]/10 text-[#00aff0]'
                          : 'border-neutral-700 bg-neutral-800/40 text-neutral-400'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 mb-1" />
                      <div>Transferencia Bancaria</div>
                      <div className="text-[10px] text-neutral-500">IBAN / SWIFT (24-48h)</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayoutMethod('CRYPTO')}
                      className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                        payoutMethod === 'CRYPTO'
                          ? 'border-[#00aff0] bg-[#00aff0]/10 text-[#00aff0]'
                          : 'border-neutral-700 bg-neutral-800/40 text-neutral-400'
                      }`}
                    >
                      <DollarSign className="w-4 h-4 mb-1" />
                      <div>Crypto USDT TRC20</div>
                      <div className="text-[10px] text-neutral-500">Instantáneo (0% fees)</div>
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleConfirmPayout}
                  className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer"
                >
                  CONFIRMAR RETIRO DE ${payoutAmount.toLocaleString()}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
