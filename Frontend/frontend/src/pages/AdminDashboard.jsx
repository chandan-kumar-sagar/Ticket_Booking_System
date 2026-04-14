import { useState, useEffect } from 'react';
import API from '../api/api';
import { MiniBarChart, Sparkline } from '../components/Charts';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [eventUsers, setEventUsers] = useState([]);
  const [openEventId, setOpenEventId] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [totalSeats, setTotalSeats] = useState('');
  const [deletingEventId, setDeletingEventId] = useState(null);

  const fetchEvents = async () => {
    const res = await API.get('/api/v1/Admin/data/event');
    const nextEvents = Array.isArray(res.data) ? res.data : res.data?.events;
    setEvents(Array.isArray(nextEvents) ? nextEvents : []);
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
    Promise.all([
      fetchEvents(),
      fetchTransactions(),
      fetchEventUsers()
    ]).catch(err => console.error(err));
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const createdEventRes = await API.post('/api/v1/Admin/data/event', { name, price: Number(price), totalSeats: Number(totalSeats) });
      const newEventId = createdEventRes.data?.event?._id;
      if (!newEventId) throw new Error("Event id missing from response");
      
      const seatsData = [];
      for (let i = 1; i <= Number(totalSeats); i++) {
        seatsData.push({
          eventId: newEventId,
          seatNumber: `S${i}`,
          status: "AVAILABLE",
          price: Number(price)
        });
      }
      
      await API.post('/api/v1/Admin/data/seats/bulk', { seats: seatsData });

      setName(''); setPrice(''); setTotalSeats('');
      alert("Event Broadcasted & Seats Auto-Generated Successfully!");

      await fetchEvents();
      await fetchTransactions();
      await fetchEventUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to create event. Ensure you are logged in as Admin.");
    }
  };

  const handleDeleteEvent = async (eventId, eventName) => {
    const ok = window.confirm(`Delete event "${eventName || 'Event'}"?\n\nThis cannot be undone.`);
    if (!ok) return;

    try {
      setDeletingEventId(eventId);

      // Prefer REST-style delete with id in path.
      try {
        await API.delete(`/api/v1/Admin/data/event/${eventId}`);
      } catch (err) {
        // Fallback for backends that accept id in request body.
        await API.delete('/api/v1/Admin/data/event', { data: { eventId } });
      }

      if (openEventId === eventId) setOpenEventId(null);

      await fetchEvents();
      await fetchTransactions();
      await fetchEventUsers();
      alert('Event deleted successfully.');
    } catch (err) {
      console.error(err);
      alert('Failed to delete event. It may have active bookings, or the backend delete route is different.');
    } finally {
      setDeletingEventId(null);
    }
  };

  const totalEvents = events.length;
  const totalSeatsCount = events.reduce((sum, e) => sum + (Number(e.totalSeats) || 0), 0);
  const potentialRevenue = events.reduce((sum, e) => sum + (Number(e.totalSeats) || 0) * (Number(e.price) || 0), 0);

  const eventPriceSeries = [...events]
    .sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0))
    .slice(0, 12)
    .map(e => Number(e.price) || 0);

  const topEvents = [...events]
    .sort((a, b) => (Number(b.totalSeats) || 0) - (Number(a.totalSeats) || 0))
    .slice(0, 7);
  const capValues = topEvents.map(e => Number(e.totalSeats) || 0);
  const capLabels = topEvents.map(e => String(e.name || 'Event').slice(0, 10));

  const txAmounts = [...transactions]
    .slice(0, 12)
    .reverse()
    .map(t => Number(t.amount) || 0);
  const totalTx = transactions.length;

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8">
      <div className="flex flex-col gap-6 sm:gap-8 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-500 font-semibold">
              Broadcast events, monitor transactions, and manage refunds.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href="/admin/transactions"
              className="rounded-xl px-4 py-2 font-extrabold bg-white/70 hover:bg-white border border-white/60 text-gray-900 shadow-sm transition"
            >
              Transactions
            </a>
            <a
              href="/admin/refunds"
              className="rounded-xl px-4 py-2 font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
            >
              Refund Requests
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 p-5 shadow-sm">
            <p className="text-xs font-extrabold tracking-widest text-gray-400 uppercase">Your events</p>
            <p className="mt-2 text-3xl font-black text-gray-900">{totalEvents}</p>
          </div>
          <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 p-5 shadow-sm">
            <p className="text-xs font-extrabold tracking-widest text-gray-400 uppercase">Total seats</p>
            <p className="mt-2 text-3xl font-black text-gray-900">{totalSeatsCount}</p>
          </div>
          <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 p-5 shadow-sm">
            <p className="text-xs font-extrabold tracking-widest text-gray-400 uppercase">Potential revenue</p>
            <p className="mt-2 text-3xl font-black text-gray-900">₹{potentialRevenue}</p>
          </div>
          <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 p-5 shadow-sm">
            <p className="text-xs font-extrabold tracking-widest text-gray-400 uppercase">Tx volume</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-3xl font-black text-gray-900">{totalTx}</p>
              <div className="flex-1">
                <Sparkline values={txAmounts} stroke="#16a34a" fill="rgba(22,163,74,0.12)" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white/70 backdrop-blur rounded-3xl border border-white/60 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-gray-900">Top events by capacity</p>
                <p className="text-xs text-gray-500 font-semibold">Seats available per event</p>
              </div>
              <div className="text-xs font-bold text-gray-500 whitespace-nowrap">Seats</div>
            </div>
            <div className="mt-4">
              <MiniBarChart values={capValues} labels={capLabels} />
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 p-5 shadow-sm">
            <p className="text-sm font-extrabold text-gray-900">Price distribution</p>
            <p className="text-xs text-gray-500 font-semibold">Across your events</p>
            <div className="mt-4">
              <Sparkline values={eventPriceSeries} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-tr from-gray-900 to-indigo-900 p-6 sm:p-8 rounded-[2rem] shadow-2xl shadow-indigo-900/20 text-white mb-10">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl font-bold mb-2">Create New Event</h2>
          <p className="text-indigo-200">Deploy a new event and allocate seats automatically.</p>
        </div>
        <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
          <input className="w-full bg-white/10 border border-white/20 p-4 rounded-xl outline-none placeholder-white/50 text-white font-medium focus:ring-2 focus:ring-white/30" type="text" placeholder="Event Showcase Name" value={name} onChange={e => setName(e.target.value)} required />
          <input className="w-full bg-white/10 border border-white/20 p-4 rounded-xl outline-none placeholder-white/50 text-white font-medium focus:ring-2 focus:ring-white/30" type="number" placeholder="Ticket Price (₹)" value={price} onChange={e => setPrice(e.target.value)} required min="1" />
          <input className="w-full bg-white/10 border border-white/20 p-4 rounded-xl outline-none placeholder-white/50 text-white font-medium focus:ring-2 focus:ring-white/30" type="number" placeholder="Total Capacity" value={totalSeats} onChange={e => setTotalSeats(e.target.value)} required min="1" max="1000" />
          <button type="submit" className="w-full py-4 bg-white text-indigo-900 font-extrabold rounded-xl hover:bg-gray-100 transition-colors shadow-lg">
            Deploy Event
          </button>
        </form>
      </div>

      {/* Users for admin events */}
      <div className="bg-white/70 backdrop-blur rounded-[2rem] border border-white/60 shadow-sm p-6 sm:p-8 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div className="min-w-0">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Event Audience
            </h2>
            <p className="mt-1 text-gray-500 font-semibold">
              Users who booked tickets for your events (confirmed bookings).
            </p>
          </div>
          <div className="text-sm font-extrabold text-gray-600">
            Events: {eventUsers.length}
          </div>
        </div>

        {eventUsers.length === 0 ? (
          <div className="rounded-3xl border border-gray-100 bg-white p-6 text-gray-500 font-semibold">
            No confirmed bookings yet for your events.
          </div>
        ) : (
          <div className="space-y-4">
            {eventUsers.map(({ event, users, bookingsCount, seatsBooked, revenue }) => {
              const id = event?._id;
              const isOpen = openEventId === id;
              return (
                <div key={id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenEventId(isOpen ? null : id)}
                    className="w-full text-left px-5 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-gray-50/60 transition"
                  >
                    <div className="min-w-0">
                      <p className="text-lg font-black text-gray-900 truncate">{event?.name}</p>
                      <p className="text-xs font-mono text-gray-400 break-all">{id}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-extrabold">
                        Bookings: {bookingsCount}
                      </span>
                      <span className="px-3 py-1.5 rounded-full bg-violet-50 text-violet-700 text-xs font-extrabold">
                        Seats: {seatsBooked}
                      </span>
                      <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold">
                        ₹{revenue}
                      </span>
                      <span className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-extrabold">
                        Users: {users?.length || 0}
                      </span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6">
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {(users || []).map(u => (
                          <div key={u._id} className="rounded-2xl border border-gray-100 bg-gray-50/60 px-4 py-3">
                            <p className="font-extrabold text-gray-900 truncate">{u.name || 'User'}</p>
                            <p className="text-sm text-gray-600 truncate">{u.email}</p>
                            <p className="text-xs font-mono text-gray-400 mt-1 break-all">{u._id}</p>
                          </div>
                        ))}
                        {(users || []).length === 0 && (
                          <div className="rounded-2xl border border-gray-100 bg-gray-50/60 px-4 py-3 text-gray-500 font-semibold">
                            No users found for this event yet.
                          </div>
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

      <div className="mt-14 mb-10 flex items-center justify-center gap-4">
        <div className="hidden sm:block h-px w-20 bg-gradient-to-r from-transparent via-violet-400 to-transparent" />
        <h2 className="text-3xl sm:text-4xl font-black text-center tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 drop-shadow-sm">
            Live Showcases
          </span>
        </h2>
        <div className="hidden sm:block h-px w-20 bg-gradient-to-r from-transparent via-indigo-400 to-transparent" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(evt => (
          <div key={evt._id} className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-xl transition-shadow relative overflow-hidden">
            {/* Subtle card watermark */}
            <img
              src="/brand-ticket.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -bottom-12 w-72 opacity-[0.07] rotate-[-10deg] select-none"
            />
            <div>
              <h3 className="text-xl font-bold text-indigo-600 mb-2">{evt.name}</h3>
              <p className="font-mono text-xs text-gray-400 break-all bg-gray-50 p-2 rounded-lg border border-gray-100">{evt._id}</p>
            </div>
            <div className="mt-6 flex justify-between items-end border-t border-gray-100 pt-5">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Capacity</span>
                <span className="text-gray-800 font-extrabold">{evt.totalSeats} Seats</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Price</span>
                <span className="text-indigo-600 font-extrabold text-xl">₹{evt.price}</span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => handleDeleteEvent(evt._id, evt.name)}
                disabled={deletingEventId === evt._id}
                className="rounded-xl px-4 py-2 font-extrabold text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-sm"
              >
                {deletingEventId === evt._id ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminDashboard;
