import { useState, useEffect } from 'react';
import API from '../api/api';
import { SkeletonTicketList } from '../components/Skeleton';

const statusConfig = {
  CONFIRMED: { label: 'Confirmed', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', dot: 'bg-emerald-400' },
  REFUND_REQUESTED: { label: 'Refund Pending', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30', dot: 'bg-amber-400' },
  REFUNDED: { label: 'Refunded', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30', dot: 'bg-blue-400' },
};

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = () => {
    setLoading(true);
    API.get('/api/v1/user/data/bookings')
      .then(res => setBookings(Array.isArray(res.data) ? res.data : (res.data?.bookings ?? [])))
      .catch(err => { console.error(err); setBookings([]); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-10">

      {/* Header */}
      <p className="text-xs font-extrabold tracking-widest text-violet-400 uppercase mb-2">✦ My Bookings</p>
      <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-8">
        My{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">
          Tickets
        </span>
      </h1>

      <div className="flex flex-col gap-5">
        {loading ? (
          <SkeletonTicketList items={3} />
        ) : bookings.length === 0 ? (
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl py-20 text-center shadow-lg">
            <div className="text-5xl mb-4">🎟️</div>
            <p className="text-white/40 font-semibold text-lg">You haven't booked any tickets yet.</p>
            <p className="text-white/20 font-medium text-sm mt-2">Head to the Dashboard to explore events!</p>
          </div>
        ) : bookings.map((b, i) => {
          const status = statusConfig[b.status] || { label: b.status, color: 'bg-white/10 text-white/60 border-white/15', dot: 'bg-white/40' };
          const seats = (b.seatNumbers?.length > 0 ? b.seatNumbers : b.seats)?.join(', ') || 'General';

          return (
            <div
              key={b._id || i}
              id={`booking-${b._id}`}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-7 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-violet-400/30 hover:bg-white/8 transition-all duration-300 shadow-lg"
            >
              {/* Left accent stripe */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-500 via-fuchsia-500 to-indigo-500 rounded-l-3xl" />

              {/* Decorative glow */}
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-full blur-2xl group-hover:from-violet-500/20 group-hover:to-fuchsia-500/20 transition-all pointer-events-none" />

              {/* Left: Ticket info */}
              <div className="pl-4 min-w-0 flex-1 relative z-10">
                <p className="text-[10px] font-mono text-white/25 mb-2 uppercase tracking-widest truncate">
                  #{b._id}
                </p>
                <h3 className="text-lg sm:text-xl font-black text-white mb-3 leading-snug">
                  {b?.event?.name || b.eventId || 'General Admission'}
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-white/8 border border-white/12 text-white/60 font-semibold text-xs px-3 py-1.5 rounded-xl">
                    🪑 Seats: <span className="text-white/90 font-bold">{seats}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 border text-xs font-extrabold px-3 py-1.5 rounded-xl uppercase tracking-wide backdrop-blur-sm ${status.color}">
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                    {status.label}
                  </span>
                </div>
              </div>

              {/* Right: Amount + actions */}
              <div className="relative z-10 flex flex-col items-end gap-3 shrink-0 md:text-right">
                <p className="text-3xl font-black text-white">
                  ₹{b.totalAmount}
                </p>

                {b.status === 'CONFIRMED' && (
                  <button
                    id={`refund-btn-${b._id}`}
                    onClick={async () => {
                      try {
                        await API.post('/api/v1/user/data/refund/request', { bookingId: b._id });
                        alert('Refund request sent successfully!');
                        fetchBookings();
                      } catch (err) {
                        alert(err.response?.data?.msg || 'Error requesting refund');
                      }
                    }}
                    className="px-5 py-2.5 rounded-2xl text-sm font-extrabold text-red-300 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 hover:border-red-400/50 hover:text-red-200 transition-all duration-200"
                  >
                    ↩️ Request Refund
                  </button>
                )}

                {b.status === 'REFUND_REQUESTED' && (
                  <span className="text-amber-400 text-sm font-extrabold flex items-center gap-1">
                    ⏳ Refund Pending
                  </span>
                )}

                {b.status === 'REFUNDED' && (
                  <span className="text-emerald-400 text-sm font-extrabold flex items-center gap-1">
                    ✅ Refunded
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingHistory;
