import { useEffect, useState } from 'react';
import API from '../api/api';
import { SkeletonTicketList } from '../components/Skeleton';

const AdminRefundRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get('/api/v1/Admin/data/refund/requests');
      console.log("refund/requests response:", res.data);
      const next = Array.isArray(res.data) ? res.data : (res.data?.requests ?? res.data?.refundRequests);
      setRequests(Array.isArray(next) ? next : []);
    } catch (err) {
      console.error(err);
      setRequests([]);
      setError(err?.response?.data?.msg || err?.message || 'Failed to load refund requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      setLoading(true);
      setError('');
      await API.post('/api/v1/Admin/data/refund', { bookingId: id });
      alert("Refund completed");
      await fetchRequests();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.msg || err?.message || 'Refund failed');
      alert(err?.response?.data?.msg || "Refund failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Refund Requests</h1>

      {error && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="mb-4">
          <SkeletonTicketList items={2} />
        </div>
      )}

      {!loading && (!requests || requests.length === 0) && (
        <div className="p-6 text-gray-500 bg-white rounded-3xl border border-gray-100 shadow-sm">
          No refund requests found.
        </div>
      )}

      {requests.map(r => (
        <div key={r._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-6 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-mono text-gray-400 break-all">Booking: {r._id}</p>
            <p className="mt-2 font-semibold text-gray-800">
              User:{' '}
              <span className="font-normal text-gray-600">
                {typeof r.userId === 'object' && r.userId
                  ? `${r.userId.name} (${r.userId.email})`
                  : r.userId}
              </span>
            </p>
            <p className="mt-1 font-extrabold text-gray-900">₹{r.totalAmount}</p>
          </div>

          <button
            onClick={() => handleApprove(r._id)}
            disabled={loading}
            className="sm:self-start bg-gradient-to-r from-emerald-600 to-green-600 text-white px-5 py-3 rounded-xl font-extrabold hover:shadow-lg hover:shadow-emerald-500/20 transition"
          >
            Approve Refund
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminRefundRequests;
