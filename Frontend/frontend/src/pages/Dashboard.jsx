import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import { MiniBarChart, Sparkline } from '../components/Charts';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/api/v1/user/data/events')
      .then((res) => {
        const next = Array.isArray(res.data) ? res.data : res.data?.events;
        setEvents(Array.isArray(next) ? next : []);
      })
      .catch((err) => console.error(err));
  }, []);

  const totalEvents = events.length;
  const avgPrice =
    totalEvents > 0
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

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8">
      <div className="flex flex-col gap-6 sm:gap-8 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              User Dashboard
            </h1>
            <p className="mt-2 text-gray-500 font-semibold">
              Browse events, reserve seats, and manage your bookings.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate('/wallet')}
              className="rounded-xl px-4 py-2 font-extrabold bg-white/70 hover:bg-white border border-white/60 text-gray-900 shadow-sm transition"
            >
              Wallet
            </button>
            <button
              onClick={() => navigate('/history')}
              className="rounded-xl px-4 py-2 font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
            >
              My Tickets
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 p-5 shadow-sm">
            <p className="text-xs font-extrabold tracking-widest text-gray-400 uppercase">Events live</p>
            <p className="mt-2 text-3xl font-black text-gray-900">{totalEvents}</p>
          </div>
          <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 p-5 shadow-sm">
            <p className="text-xs font-extrabold tracking-widest text-gray-400 uppercase">Avg ticket price</p>
            <p className="mt-2 text-3xl font-black text-gray-900">₹{avgPrice}</p>
          </div>
          <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 p-5 shadow-sm">
            <p className="text-xs font-extrabold tracking-widest text-gray-400 uppercase">Total capacity</p>
            <p className="mt-2 text-3xl font-black text-gray-900">{totalCapacity}</p>
          </div>
          <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 p-5 shadow-sm">
            <p className="text-xs font-extrabold tracking-widest text-gray-400 uppercase">Price spread</p>
            <div className="mt-2">
              <Sparkline values={priceSeries} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white/70 backdrop-blur rounded-3xl border border-white/60 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-gray-900">Top events by capacity</p>
                <p className="text-xs text-gray-500 font-semibold">Most seats available right now</p>
              </div>
              <div className="text-xs font-bold text-gray-500 whitespace-nowrap">Seats</div>
            </div>
            <div className="mt-4">
              <MiniBarChart values={capValues} labels={capLabels} />
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-indigo-900 rounded-3xl p-6 shadow-2xl shadow-indigo-900/20 text-white border border-white/10">
            <p className="text-sm font-extrabold">Quick tips</p>
            <ul className="mt-3 space-y-2 text-indigo-100 text-sm font-semibold">
              <li>- Seats can expire if not booked in time.</li>
              <li>- Keep your wallet topped up for instant checkout.</li>
              <li>- Refund requests are available from My Tickets.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-14 mb-12 flex items-center justify-center gap-4">
        <div className="hidden sm:block h-px w-20 bg-gradient-to-r from-transparent via-violet-400 to-transparent" />
        <h2 className="text-3xl sm:text-4xl font-black text-center tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 drop-shadow-sm">
            {t('dashboard.discover')}
          </span>
        </h2>
        <div className="hidden sm:block h-px w-20 bg-gradient-to-r from-transparent via-indigo-400 to-transparent" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((evt) => (
          <div 
            key={evt._id} 
            onClick={() => navigate(`/seats/${evt._id}`)}
            className="group flex flex-col justify-between p-7 bg-white rounded-3xl shadow-md shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:shadow-violet-500/10 transition-all cursor-pointer hover:-translate-y-1 relative overflow-hidden"
          >
            {/* Decorative background */}
            <div className="absolute -right-12 -top-12 w-32 h-32 bg-violet-100 rounded-full blur-2xl opacity-60 group-hover:bg-violet-200 transition-colors pointer-events-none"></div>
            <img
              src="/brand-ticket.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -right-6 -bottom-8 w-56 opacity-[0.08] rotate-[-12deg] select-none"
            />
            
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight leading-snug">
                {evt.name}
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-gray-50/80 border border-gray-100 px-4 py-3">
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400">Entry price</p>
                  <p className="mt-1 text-lg font-black text-violet-700">₹{evt.price}</p>
                </div>
                <div className="rounded-2xl bg-gray-50/80 border border-gray-100 px-4 py-3">
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400">Capacity</p>
                  <p className="mt-1 text-lg font-black text-gray-900">{evt.totalSeats} <span className="text-gray-500 font-bold text-sm">seats</span></p>
                </div>
              </div>
            </div>
            
            <button className="relative z-10 mt-8 w-full bg-violet-50 text-violet-700 font-bold py-3.5 rounded-xl group-hover:bg-violet-600 group-hover:text-white transition-colors duration-300">
              Select Seats
            </button>
          </div>
        ))}
        {events.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <p className="text-xl text-gray-400 font-medium">No extraordinary events currently available.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Dashboard;
