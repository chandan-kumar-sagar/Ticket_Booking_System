import { useState, useEffect } from 'react';
import API from '../api/api';
import { SkeletonTicketList } from '../components/Skeleton';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = () => {
    setLoading(true);
    API.get('/api/v1/user/data/bookings')
      .then(res => setBookings(Array.isArray(res.data) ? res.data : (res.data?.bookings ?? [])))
      .catch(err => {
        console.error(err);
        setBookings([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10 tracking-tight">My Tickets</h1>

      <div className="flex flex-col gap-6">
        {loading ? (
          <SkeletonTicketList items={3} />
        ) : bookings.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 shadow-sm text-gray-500 font-medium">
            You haven't booked any tickets yet.
          </div>
        ) : bookings.map(b => (
          <div key={b._id} className="relative overflow-hidden bg-white p-7 rounded-3xl shadow-md shadow-gray-200/50 border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-lg transition">
            
            {/* Decorative Ticket Stripe */}
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-violet-500 to-indigo-500"></div>

            {/* LEFT SIDE */}
            <div className="pl-4">
              <p className="text-xs font-mono text-gray-400 mb-2 uppercase tracking-widest leading-none">
                Booking ID: {b._id}
              </p>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Event:{" "}
                <span className="font-medium text-violet-600">
                  {b?.event?.name || b.eventId || "General Admission"}
                </span>
              </h3>

              <p className="font-medium text-gray-500 bg-gray-50 inline-block px-3 py-1 rounded-lg border border-gray-100">
                Seats:{" "}
                <span className="text-gray-900 font-bold ml-1">
                  {(b.seatNumbers && b.seatNumbers.length > 0
                    ? b.seatNumbers
                    : b.seats
                  )?.join(", ") || "General"}
                </span>
              </p>
            </div>

            {/* RIGHT SIDE */}
            <div className="text-right flex flex-col justify-between items-end h-full min-w-[140px] gap-2">

              {/* STATUS */}
              <span className={`inline-block px-4 py-1.5 text-xs font-extrabold tracking-wide uppercase rounded-full ${
                b.status === 'CONFIRMED'
                  ? 'bg-green-100 text-green-700'
                  : b.status === 'REFUND_REQUESTED'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {b.status}
              </span>

              {/* AMOUNT */}
              <p className="text-3xl font-extrabold text-gray-900 mt-2">
                ₹{b.totalAmount}
              </p>

              {/* ✅ REFUND BUTTON */}
              {b.status === "CONFIRMED" && (
                <button
                  onClick={async () => {
                    try {
                      await API.post('/api/v1/user/data/refund/request', {
                        bookingId: b._id
                      });

                      alert("Refund request sent");
                      fetchBookings(); // refresh UI
                    } catch (err) {
                      alert(err.response?.data?.msg || "Error requesting refund");
                    }
                  }}
                  className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition"
                >
                  Request Refund
                </button>
              )}

              {/* ⏳ Pending */}
              {b.status === "REFUND_REQUESTED" && (
                <span className="text-yellow-600 text-sm font-bold mt-2">
                  Refund Pending ⏳
                </span>
              )}

              {/* ✅ Refunded */}
              {b.status === "REFUNDED" && (
                <span className="text-green-600 text-sm font-bold mt-2">
                  Refunded ✅
                </span>
              )}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingHistory;
