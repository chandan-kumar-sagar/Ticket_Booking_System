import { useEffect, useState } from 'react';
import API from '../api/api';
import { SkeletonTable } from '../components/Skeleton';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.get('/api/v1/Admin/data/bookings')
      .then(res => setBookings(Array.isArray(res.data) ? res.data : (res.data?.bookings ?? [])))
      .catch(err => {
        console.error(err);
        setBookings([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Global Booking Ledger</h1>
      <div className="bg-white rounded-3xl p-6 shadow-md shadow-gray-200/50 border border-gray-100">
        {loading ? (
          <SkeletonTable rows={8} cols={5} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase text-xs tracking-wider">
                  <th className="pb-4 px-4 font-bold">Booking ID</th>
                  <th className="pb-4 px-4 font-bold">User Hash</th>
                  <th className="pb-4 px-4 font-bold">Event Hash</th>
                  <th className="pb-4 px-4 font-bold">Total Val.</th>
                  <th className="pb-4 px-4 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map(b => (
                  <tr key={b._id} className="hover:bg-violet-50/50 transition">
                    <td className="py-4 px-4 text-xs font-mono text-gray-400 bg-gray-50/50">{b._id}</td>
                    <td className="py-4 px-4 text-xs font-mono text-gray-400">{b.userId}</td>
                    <td className="py-4 px-4 text-xs font-mono text-gray-400">{b.eventId || '-'}</td>
                    <td className="py-4 px-4 font-extrabold text-gray-800">₹{b.totalAmount}</td>
                    <td className="py-4 px-4 text-right">
                      <span className={`px-3 py-1.5 text-[10px] uppercase tracking-widest font-extrabold rounded-full ${b.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {bookings.length === 0 && (
               <div className="p-12 text-center text-gray-400 font-medium">No bookings have been made across the entire platform yet.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminBookings;
