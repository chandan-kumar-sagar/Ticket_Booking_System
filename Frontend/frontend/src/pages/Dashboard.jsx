import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import { MiniBarChart, Sparkline } from '../components/Charts';
import { useTranslation } from 'react-i18next';
import { SkeletonCardGrid, SkeletonStatsGrid } from '../components/Skeleton';

const Dashboard = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    API.get('/api/v1/user/data/events')
      .then((res) => {
        const next = Array.isArray(res.data) ? res.data : res.data?.events;
        setEvents(Array.isArray(next) ? next : []);
      })
      .catch((err) => { console.error(err); setEvents([]); })
      .finally(() => setLoading(false));
  }, []);

  const totalEvents = events.length;
  const avgPrice = totalEvents > 0
    ? Math.round(events.reduce((sum, e) => sum + (Number(e.price) || 0), 0) / totalEvents)
    : 0;
  const totalCapacity = events.reduce((sum, e) => sum + (Number(e.totalSeats) || 0), 0);

  const topEvents = [...events]
    .sort((a, b) => (Number(b.totalSeats) || 0) - (Number(a.totalSeats) || 0))
    .slice(0, 7);
  const capValues = topEvents.map(e => Number(e.totalSeats) || 0);
  const capLabels = topEvents.map(e => String(e.name || 'Event').slice(0, 10));
  const priceSeries = [...events]
    .sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0))
    .slice(0, 12)
    .map(e => Number(e.price) || 0);

  const statCards = [
    { label: 'Events Live', value: totalEvents, icon: '🎪', color: 'from-violet-500 to-fuchsia-500' },
    { label: 'Avg Ticket Price', value: `₹${avgPrice}`, icon: '💳', color: 'from-cyan-500 to-blue-500' },
    { label: 'Total Capacity', value: totalCapacity.toLocaleString(), icon: '🪑', color: 'from-amber-500 to-orange-500' },
    { label: 'Price Spread', value: null, icon: '📈', color: 'from-emerald-500 to-teal-500', chart: true },
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-10">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-extrabold tracking-widest text-violet-400 uppercase mb-2">
            ✦ User Dashboard
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Browse{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">
              Events
            </span>
          </h1>
          <p className="mt-2 text-white/40 font-semibold text-sm">
            Reserve seats, manage your bookings, and top-up your wallet.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            id="dash-wallet-btn"
            onClick={() => navigate('/wallet')}
            className="rounded-2xl px-5 py-2.5 font-extrabold text-white/80 bg-white/8 border border-white/12 hover:bg-white/15 hover:text-white backdrop-blur transition-all duration-200"
          >
            💰 Wallet
          </button>
          <button
            id="dash-tickets-btn"
            onClick={() => navigate('/history')}
            className="rounded-2xl px-5 py-2.5 font-extrabold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5 transition-all duration-200"
          >
            🎟️ My Tickets
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <SkeletonStatsGrid items={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((card, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-lg group hover:border-white/20 transition-all duration-300"
            >
              <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-br ${card.color} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity`} />
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-extrabold tracking-widest text-white/40 uppercase">{card.label}</p>
                <span className="text-xl">{card.icon}</span>
              </div>
              {card.chart ? (
                <div className="mt-1"><Sparkline values={priceSeries} /></div>
              ) : (
                <p className="text-3xl font-black text-white">{card.value}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-lg">
          <p className="text-sm font-black text-white mb-1">Top Events by Capacity</p>
          <p className="text-xs text-white/40 font-semibold mb-4">Most seats available right now</p>
          <MiniBarChart values={capValues} labels={capLabels} />
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-900/60 to-indigo-900/60 backdrop-blur-xl p-6 shadow-xl">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
          <p className="text-sm font-black text-white mb-3">✨ Quick Tips</p>
          <ul className="space-y-3 text-indigo-200 text-sm font-semibold">
            <li className="flex gap-2"><span>⏰</span> Seats can expire if not booked in time.</li>
            <li className="flex gap-2"><span>💳</span> Keep your wallet topped up for instant checkout.</li>
            <li className="flex gap-2"><span>↩️</span> Refund requests are available from My Tickets.</li>
          </ul>
        </div>
      </div>

      {/* Events Section Title */}
      <div className="flex items-center justify-center gap-4 mb-10">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
        <h2 className="text-2xl sm:text-3xl font-black text-center tracking-tight whitespace-nowrap">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">
            {t('dashboard.discover')}
          </span>
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      </div>

      {/* Event Cards */}
      {loading ? (
        <SkeletonCardGrid items={6} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <div
              key={evt._id}
              id={`event-card-${evt._id}`}
              onClick={() => navigate(`/seats/${evt._id}`)}
              className="group relative flex flex-col justify-between p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl hover:border-violet-400/40 hover:bg-white/10 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(139,92,246,0.2)] transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Decorative gradient */}
              <div className="absolute -right-10 -top-10 w-36 h-36 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-full blur-2xl group-hover:from-violet-500/30 group-hover:to-fuchsia-500/30 transition-all duration-300 pointer-events-none" />
              
              {/* Watermark ticket icon */}
              <img
                src="/brand-ticket.png"
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute -right-4 -bottom-6 w-48 opacity-[0.04] rotate-[-12deg] select-none group-hover:opacity-[0.07] transition-opacity"
              />

              <div className="relative z-10">
                {/* Event name */}
                <h3 className="text-xl font-black text-white mb-5 tracking-tight leading-snug group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-300 group-hover:to-fuchsia-300 transition-all duration-300">
                  {evt.name}
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/40">Entry Price</p>
                    <p className="mt-1 text-lg font-black text-violet-300">₹{evt.price}</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/40">Capacity</p>
                    <p className="mt-1 text-lg font-black text-white">{evt.totalSeats} <span className="text-white/40 font-bold text-sm">seats</span></p>
                  </div>
                </div>
              </div>

              <button className="relative z-10 mt-6 w-full py-3.5 rounded-xl font-extrabold text-sm text-violet-300 border border-violet-500/30 bg-violet-500/10 group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-fuchsia-600 group-hover:text-white group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-violet-500/30 transition-all duration-300">
                Select Seats →
              </button>
            </div>
          ))}

          {events.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <div className="text-5xl mb-4">🎭</div>
              <p className="text-xl text-white/30 font-semibold">No events available right now.</p>
              <p className="text-sm text-white/20 font-medium mt-2">Check back soon for upcoming events!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default Dashboard;
