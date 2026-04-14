import { useEffect, useState } from 'react';
import API from '../api/api';

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Requires '/api/v1/Admin/data/transactions' standard logic output in Backend
    API.get('/api/v1/Admin/data/transactions')
      .then(res => {
        const next = Array.isArray(res.data) ? res.data : res.data?.transactions;
        setTransactions(Array.isArray(next) ? next : []);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Platform Transactions</h1>
      <div className="bg-white rounded-3xl p-6 shadow-md shadow-gray-200/50 border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase text-xs tracking-wider">
                <th className="pb-4 px-4 font-bold">Transaction ID</th>
                <th className="pb-4 px-4 font-bold">User Hash</th>
                <th className="pb-4 px-4 font-bold">Vector</th>
                <th className="pb-4 px-4 font-bold">Valuation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.map(t => (
                <tr key={t._id} className="hover:bg-violet-50/50 transition">
                  <td className="py-4 px-4 text-xs font-mono text-gray-400 bg-gray-50/50">{t._id || 'SYS-ALLOC'}</td>
                  <td className="py-4 px-4 text-xs font-mono text-gray-400">
                    {typeof t.userId === 'object' && t.userId
                      ? `${t.userId.name} (${t.userId.email})`
                      : t.userId}
                  </td>
                  <td className="py-4 px-4 font-bold capitalize">
                     <span className={t.type === 'credit' ? 'text-green-600 bg-green-50 px-2 py-1 rounded-md' : 'text-red-500 bg-red-50 px-2 py-1 rounded-md'}>{t.type}</span>
                  </td>
                  <td className="py-4 px-4 font-extrabold text-gray-800">₹{t.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!transactions || transactions.length === 0) && (
            <div className="p-12 text-center text-gray-400 font-medium">No financial transactions have occurred across the entire platform yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AdminTransactions;
