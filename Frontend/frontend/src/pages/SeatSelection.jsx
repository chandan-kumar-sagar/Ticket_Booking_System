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

  useEffect(() => {
    fetchEventAndSeats();
  }, [eventId]);

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
      const safeSeats = Array.isArray(nextSeats) ? nextSeats : [];
      setSeats(safeSeats);
    } catch (err) {
      console.error(err);
      setSeats([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSeat = async (seatId) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    );
  };

  const handleBook = async () => {
    if (selectedSeats.length === 0) return;
    try {
      setBookingError('');
      await API.post('/api/v1/user/data/book', { eventId, seats: selectedSeats });
      alert("Booking confirmed successfully! Your tickets are secured.");
      navigate('/history');
    } catch (err) {
      setBookingError(err.response?.data?.msg || 'Booking failed. Verify your wallet balance.');
    }
  };

  const totalAmount = selectedSeats.length * (Number.isFinite(Number(basePrice)) ? Number(basePrice) : 0);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8 flex flex-col lg:flex-row gap-10 items-start">
      <div className="flex-1 w-full">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Select Your Seats</h1>
        <p className="text-gray-500 font-medium mb-8">
          {loading ? (
            <span className="inline-block align-middle">
              <Skeleton className="h-5 w-48 rounded-lg" />
            </span>
          ) : (
            eventName ? <span className="font-extrabold text-gray-800">{eventName}</span> : null
          )}
          {eventName ? ' — ' : null}
          Click on seats to add/remove them from your selection.
        </p>
        <SeatGrid loading={loading} seats={seats} selectedSeats={selectedSeats} onSelectSeat={handleSelectSeat} />
      </div>
      
      <div className="w-full lg:w-96 bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-xl shadow-violet-500/5 border border-white lg:sticky lg:top-24 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Booking Summary</h3>
        
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col gap-3 mb-6">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-gray-500">Seats Chosen</span>
            <span className="text-violet-700 bg-violet-100 px-3 py-1 rounded-full">{selectedSeats.length}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-gray-500">Price per ticket</span>
            {loading ? <Skeleton className="h-4 w-16 rounded-md" /> : <span className="text-gray-800">₹{basePrice}</span>}
          </div>
        </div>

        <div className="border-t border-dashed border-gray-300 my-4"></div>
        
        <div className="flex justify-between items-end mb-8">
          <span className="text-gray-600 font-bold">Total</span>
          {loading ? (
            <Skeleton className="h-10 w-28 rounded-xl" />
          ) : (
            <span className="text-4xl font-extrabold text-gray-900">₹{totalAmount}</span>
          )}
        </div>

        {bookingError && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {bookingError}
          </div>
        )}
        
        <button 
          type="button"
          onClick={handleBook}
          disabled={loading || selectedSeats.length === 0}
          className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-4 rounded-xl disabled:opacity-50 hover:shadow-lg hover:shadow-violet-500/30 hover:scale-[1.02] transition-all"
        >
          Confirm & Pay
        </button>
      </div>
    </div>
  );
};
export default SeatSelection;
