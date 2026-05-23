import { useState, useEffect } from 'react';
import API from '../api/api';
import { MiniBarChart, Sparkline } from '../components/Charts';
import { SkeletonCardGrid, SkeletonStatsGrid, SkeletonText } from '../components/Skeleton';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [eventUsers, setEventUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openEventId, setOpenEventId] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [totalSeats, setTotalSeats] = useState('');
  const [deletingEventId, setDeletingEventId] = useState(null);
  const [creating, setCreating] = useState(false);

  const fetchEvents = async () => {
    const res = await API.get('/api/v1/Admin/data/event');
    const next = Array.isArray(res.data) ? res.data : res.data?.events;
    setEvents(Array.isArray(next) ? next : []);
  };
  const fetchTransactions = async () => {
    const res = await API.get('/api/v1/Admin/data/transactions');
    const next = Array.isArray(res.data) ? res.data : res.data?.transactions;
    setTransactions(Array.isArray(next) ? next : []);
  };
  const fetchEventUsers = async () => {
    const res = await API.get('/api/v1/Admin/data/event/users');
    const next = Array.isArray(res.data) ? res.data : res.data?.events;
    setEventUsers(Array.isArray(next) ? next : []);
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchEvents(), fetchTransactions(), fetchEventUsers()])
      .catch(err => { console.error(err); setEvents([]); setTransactions([]); setEventUsers([]); })
      .finally(() => setLoading(false));
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      const res = await API.post('/api/v1/Admin/data/event', { name, price: Number(price), totalSeats: Number(totalSeats) });
      const newEventId = res.data?.event?._id;
      if (!newEventId) throw new Error('Event id missing');
      const seatsData = Array.from({ length: Number(totalSeats) }, (_, i) => ({
        eventId: newEventId, seatNumber: `S${i + 1}`, status: 'AVAILABLE', price: Number(price)
      }));
      await API.post('/api/v1/Admin/data/seats/bulk', { seats: seatsData });
      setName(''); setPrice(''); setTotalSeats('');
      alert('Event Broadcasted & Seats Auto-Generated Successfully! 🎉');
      await Promise.all([fetchEvents(), fetchTransactions(), fetchEventUsers()]);
    } catch (err) {
      console.error(err);
      alert('Failed to create event. Ensure you are logged in as Admin.');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteEvent = async (eventId, eventName) => {
    if (!window.confirm(`Delete event "${eventName || 'Event'}"?\n\nThis cannot be undone.`)) return;
    try {
      setDeletingEventId(eventId);
      try { await API.delete(`/api/v1/Admin/data/event/${eventId}`); }
      catch { await API.delete('/api/v1/Admin/data/event', { data: { eventId } }); }
      if (openEventId === eventId) setOpenEventId(null);
      await Promise.all([fetchEvents(), fetchTransactions(), fetchEventUsers()]);
      alert('Event deleted successfully.');
    } catch (err) {
      console.error(err);
      alert('Failed to delete event.');
    } finally {
      setDeletingEventId(null);
    }
  };

  const totalEventsCount = events.length;
  const totalSeatsCount = events.reduce((sum, e) => sum + (Number(e.totalSeats) || 0), 0);
  const potentialRevenue = events.reduce((sum, e) => sum + (Number(e.totalSeats) || 0) * (Number(e.price) || 0), 0);
  const totalTx = transactions.length;

  const eventPriceSeries = [...events].sort((a, b) => (Number(a.price)||0)-(Number(b.price)||0)).slice(0,12).map(e => Number(e.price)||0);
  const topEvents = [...events].sort((a,b)=>(Number(b.totalSeats)||0)-(Number(a.totalSeats)||0)).slice(0,7);
  const capValues = topEvents.map(e => Number(e.totalSeats)||0);
  const capLabels = topEvents.map(e => String(e.name||'Event').slice(0,10));
  const txAmounts = [...transactions].slice(0,12).reverse().map(t => Number(t.amount)||0);

  const statCards = [
    { label: 'Your Events', value: totalEventsCount, icon: '🎪', color: 'from-violet-500 to-fuchsia-500' },
    { label: 'Total Seats', value: totalSeatsCount.toLocaleString(), icon: '🪑', color: 'from-cyan-500 to-blue-500' },
    { label: 'Potential Revenue', value: `₹${potentialRevenue.toLocaleString()}`, icon: '💰', color: 'from-emerald-500 to-teal-500' },
    { label: 'Tx Volume', value: totalTx, icon: '📊', color: 'from-amber-500 to-orange-500', chart: txAmounts },
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-10">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-extrabold tracking-widest text-indigo-400 uppercase mb-2">✦ Admin Dashboard</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Event{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400">
              Control Panel
            </span>
          </h1>
          <p className="mt-2 text-white/40 font-semibold text-sm">Broadcast events, monitor transactions, and manage refunds.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href="/admin/transactions" className="rounded-2xl px-5 py-2.5 font-extrabold text-white/80 bg-white/8 border border-white/12 hover:bg-white/15 hover:text-white backdrop-blur transition-all duration-200">
            📋 Transactions
          </a>
          <a href="/admin/refunds" className="rounded-2xl px-5 py-2.5 font-extrabold text-white bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-200">
            ↩️ Refund Requests
          </a>
        </div>
      </div>

      {/* Stats */}
      {loading ? <SkeletonStatsGrid items={4} /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((card, i) => (
            <div key={i} className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-lg group hover:border-white/20 transition-all duration-300">
              <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-br ${card.color} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity`} />
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-extrabold tracking-widest text-white/40 uppercase">{card.label}</p>
                <span className="text-xl">{card.icon}</span>
              </div>
              {card.chart ? (
                <div className="flex items-center gap-3">
                  <p className="text-3xl font-black text-white">{card.value}</p>
                  <div className="flex-1"><Sparkline values={card.chart} stroke="#22c55e" fill="rgba(34,197,94,0.15)" /></div>
                </div>
              ) : (
                <p className="text-3xl font-black text-white">{card.value}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <p className="text-sm font-black text-white mb-1">Top Events by Capacity</p>
          <p className="text-xs text-white/40 font-semibold mb-4">Seats available per event</p>
          <MiniBarChart values={capValues} labels={capLabels} />
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <p className="text-sm font-black text-white mb-1">Price Distribution</p>
          <p className="text-xs text-white/40 font-semibold mb-4">Across your events</p>
          <Sparkline values={eventPriceSeries} />
        </div>
      </div>

      {/* Create Event */}
      <div className="relative overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-tr from-indigo-900/60 to-violet-900/60 backdrop-blur-xl p-7 sm:p-8 shadow-2xl shadow-indigo-900/30 mb-10">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="mb-6 relative z-10">
          <h2 className="text-2xl font-black text-white mb-2">🚀 Create New Event</h2>
          <p className="text-indigo-300 text-sm font-semibold">Deploy a new event and allocate seats automatically.</p>
        </div>
        <form id="create-event-form" onSubmit={handleCreateEvent} className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            id="event-name-input"
            className="w-full bg-white/10 border border-white/20 backdrop-blur p-4 rounded-2xl outline-none placeholder-white/40 text-white font-semibold focus:border-violet-400/60 focus:bg-white/15 focus:ring-2 focus:ring-violet-500/20 transition-all"
            type="text" placeholder="Event Name" value={name} onChange={e => setName(e.target.value)} required
          />
          <input
            id="event-price-input"
            className="w-full bg-white/10 border border-white/20 backdrop-blur p-4 rounded-2xl outline-none placeholder-white/40 text-white font-semibold focus:border-violet-400/60 focus:bg-white/15 focus:ring-2 focus:ring-violet-500/20 transition-all"
            type="number" placeholder="Ticket Price (₹)" value={price} onChange={e => setPrice(e.target.value)} required min="1"
          />
          <input
            id="event-seats-input"
            className="w-full bg-white/10 border border-white/20 backdrop-blur p-4 rounded-2xl outline-none placeholder-white/40 text-white font-semibold focus:border-violet-400/60 focus:bg-white/15 focus:ring-2 focus:ring-violet-500/20 transition-all"
            type="number" placeholder="Total Capacity" value={totalSeats} onChange={e => setTotalSeats(e.target.value)} required min="1" max="1000"
          />
          <button
            id="deploy-event-btn"
            type="submit"
            disabled={creating}
            className="w-full py-4 bg-white text-indigo-900 font-extrabold rounded-2xl hover:bg-gray-100 transition-colors shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {creating ? '⏳ Deploying…' : '⚡ Deploy Event'}
          </button>
        </form>
      </div>

      {/* Event Audience */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 mb-10 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">👥 Event Audience</h2>
            <p className="mt-1 text-white/40 font-semibold text-sm">Users with confirmed bookings per event.</p>
          </div>
          <span className="text-sm font-extrabold text-white/40">Events: {eventUsers.length}</span>
        </div>

        {loading ? <SkeletonText lines={4} /> : eventUsers.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/40 font-semibold">
            No confirmed bookings yet for your events.
          </div>
        ) : (
          <div className="space-y-3">
            {eventUsers.map(({ event, users, bookingsCount, seatsBooked, revenue }) => {
              const id = event?._id;
              const isOpen = openEventId === id;
              return (
                <div key={id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:border-white/15 transition-all">
                  <button
                    type="button"
                    onClick={() => setOpenEventId(isOpen ? null : id)}
                    className="w-full text-left px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-white/5 transition"
                  >
                    <div className="min-w-0">
                      <p className="text-base font-black text-white truncate">{event?.name}</p>
                      <p className="text-xs font-mono text-white/25 break-all mt-0.5">{id}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-xs font-extrabold">
                        {bookingsCount} Bookings
                      </span>
                      <span className="px-3 py-1.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30 text-xs font-extrabold">
                        {seatsBooked} Seats
                      </span>
                      <span className="px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-extrabold">
                        ₹{revenue}
                      </span>
                      <span className="px-3 py-1.5 rounded-full bg-white/10 text-white/60 border border-white/15 text-xs font-extrabold">
                        {users?.length || 0} Users
                      </span>
                      <span className="text-white/30 text-xs font-extrabold self-center">{isOpen ? '▲' : '▼'}</span>
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-white/8 pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {(users || []).map(u => (
                          <div key={u._id} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                            <p className="font-extrabold text-white truncate">{u.name || 'User'}</p>
                            <p className="text-sm text-white/50 truncate">{u.email}</p>
                            <p className="text-xs font-mono text-white/25 mt-1 break-all">{u._id}</p>
                          </div>
                        ))}
                        {(users || []).length === 0 && (
                          <p className="text-white/30 font-semibold text-sm">No users found yet.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Live Events Grid */}
      <div className="flex items-center justify-center gap-4 mb-10">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight whitespace-nowrap">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400">
            Live Showcases
          </span>
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
      </div>

      {loading ? <SkeletonCardGrid items={6} /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map(evt => (
            <div
              key={evt._id}
              id={`admin-event-${evt._id}`}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 flex flex-col justify-between hover:border-indigo-400/40 hover:bg-white/8 transition-all duration-300"
            >
              <div className="absolute -right-8 -top-8 w-28 h-28 bg-gradient-to-br from-indigo-500/15 to-violet-500/15 rounded-full blur-2xl group-hover:opacity-150 transition-all pointer-events-none" />
              <img src="/brand-ticket.png" alt="" aria-hidden="true" className="pointer-events-none absolute -right-6 -bottom-8 w-48 opacity-[0.04] rotate-[-10deg] select-none" />

              <div className="relative z-10">
                <h3 className="text-lg font-black text-white mb-1 truncate">{evt.name}</h3>
                <p className="font-mono text-xs text-white/20 break-all bg-white/5 border border-white/8 p-2 rounded-xl mb-4">{evt._id}</p>
                <div className="flex justify-between items-center border-t border-white/8 pt-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/30">Capacity</span>
                    <p className="text-white font-extrabold">{evt.totalSeats} Seats</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/30">Price</span>
                    <p className="text-violet-300 font-extrabold text-xl">₹{evt.price}</p>
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-5">
                <button
                  id={`delete-event-${evt._id}`}
                  type="button"
                  onClick={() => handleDeleteEvent(evt._id, evt.name)}
                  disabled={deletingEventId === evt._id}
                  className="w-full rounded-2xl px-4 py-2.5 font-extrabold text-red-300 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 hover:border-red-400/50 hover:text-red-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingEventId === evt._id ? '⏳ Deleting…' : '🗑️ Delete Event'}
                </button>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <div className="text-5xl mb-4">🎭</div>
              <p className="text-white/30 font-semibold">No events created yet. Deploy your first event above!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default AdminDashboard;
