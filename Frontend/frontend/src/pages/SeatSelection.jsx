import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import SeatGrid from "../components/SeatGrid";
import { Skeleton } from "../components/Skeleton";

const SeatSelection = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [basePrice, setBasePrice] = useState(150);
  const [eventName, setEventName] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchEventAndSeats(); }, [eventId]);

  const fetchEventAndSeats = async () => {
    try {
      setLoading(true);
      const [eventRes, seatsRes] = await Promise.all([
        API.get(`/api/v1/user/data/event/${eventId}`),
        API.get(`/api/v1/user/data/seats/${eventId}`)
      ]);
      const evt = eventRes.data?.event;
      if (evt?.name) setEventName(evt.name);
      const eventPrice = Number(evt?.price);
      if (Number.isFinite(eventPrice) && eventPrice > 0) setBasePrice(eventPrice);
      const nextSeats = Array.isArray(seatsRes.data) ? seatsRes.data : seatsRes.data?.seats;
      setSeats(Array.isArray(nextSeats) ? nextSeats : []);
    } catch (err) {
      console.error(err);
      setSeats([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSeat = (seatId) => {
    setSelectedSeats(prev =>
      prev.includes(seatId) ? prev.filter(id => id !== seatId) : [...prev, seatId]
    );
  };

  const handleBook = async () => {
    if (selectedSeats.length === 0) return;
    try {
      setBookingError('');
      await API.post('/api/v1/user/data/book', { eventId, seats: selectedSeats });
      alert("Booking confirmed! Your tickets are secured 🎉");
      navigate('/history');
    } catch (err) {
      setBookingError(err.response?.data?.msg || 'Booking failed. Verify your wallet balance.');
    }
  };

  const totalAmount = selectedSeats.length * (Number.isFinite(Number(basePrice)) ? Number(basePrice) : 0);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-10 flex flex-col lg:flex-row gap-8 items-start">

      {/* Left: Seat Grid */}
      <div className="flex-1 w-full">
        <p className="text-xs font-extrabold tracking-widest text-violet-400 uppercase mb-2">✦ Seat Selection</p>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
          Pick Your{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Seats</span>
        </h1>
        <p className="text-white/40 font-semibold text-sm mb-6">
          {loading ? (
            <span className="inline-block align-middle"><Skeleton className="h-4 w-48 rounded-lg bg-white/10" /></span>
          ) : (
            eventName ? <><span className="text-violet-300 font-extrabold">{eventName}</span> — </> : null
          )}
          Click seats to toggle your selection.
        </p>

        <SeatGrid loading={loading} seats={seats} selectedSeats={selectedSeats} onSelectSeat={handleSelectSeat} />
      </div>

      {/* Right: Booking Summary */}
      <div className="w-full lg:w-96 lg:sticky lg:top-24">
        {/* Glow behind card */}
        <div className="relative">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-b from-violet-600/30 to-fuchsia-600/30 blur-xl pointer-events-none" />
          <div className="relative p-6 sm:p-8 rounded-3xl border border-white/15 bg-white/5 backdrop-blur-2xl shadow-2xl overflow-hidden flex flex-col">

            {/* Decorative orb */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-violet-500/20 rounded-full blur-2xl pointer-events-none" />

            <h3 className="text-lg font-black text-white mb-5 relative z-10">🎟️ Booking Summary</h3>

            {/* Detail rows */}
            <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3 mb-5">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-white/50">Seats Selected</span>
                <span className="text-violet-300 bg-violet-500/15 border border-violet-500/30 px-3 py-1 rounded-full font-extrabold text-xs">
                  {selectedSeats.length}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-white/50">Price per Seat</span>
                {loading
                  ? <Skeleton className="h-4 w-16 rounded-md bg-white/10" />
                  : <span className="text-white font-extrabold">₹{basePrice}</span>
                }
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-dashed border-white/15 my-2 relative z-10" />

            {/* Total */}
            <div className="flex justify-between items-end mt-4 mb-6 relative z-10">
              <span className="text-white/60 font-bold">Total Amount</span>
              {loading
                ? <Skeleton className="h-10 w-28 rounded-xl bg-white/10" />
                : <span className="text-4xl font-black text-white">₹{totalAmount}</span>
              }
            </div>

            {/* Error */}
            {bookingError && (
              <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 relative z-10">
                ⚠️ {bookingError}
              </div>
            )}

            {/* CTA */}
            <button
              id="confirm-booking-btn"
              type="button"
              onClick={handleBook}
              disabled={loading || selectedSeats.length === 0}
              className="relative z-10 w-full font-extrabold py-4 rounded-2xl text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed group overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7, #6366f1)' }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                ✅ Confirm & Pay
              </span>
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-200" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SeatSelection;
