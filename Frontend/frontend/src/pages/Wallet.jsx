import { useState, useEffect } from 'react';
import API from '../api/api';
import { Skeleton, SkeletonTable } from '../components/Skeleton';

const Wallet = () => {
  const [history, setHistory] = useState([]);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await API.get('/api/v1/user/data/wallet/history');
      const transactions = Array.isArray(res.data) ? res.data : [];
      setHistory(transactions);
      
      if (transactions.length > 0) {
        setBalance(transactions[0].balanceAfter);
      } else {
        setBalance(0);
      }
    } catch (err) {
      console.error(err);
      setHistory([]);
      setBalance(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleAddMoney = async (e) => {
    e.preventDefault();
    if (Number(amount) <= 0) return;
    
    try {
      const res = await API.post('/api/v1/user/data/wallet/add', { amount: Number(amount) });
      if (typeof res.data?.balance === 'number') setBalance(res.data.balance);
      setAmount('');
      fetchHistory(); 
    } catch (err) {
      alert("Failed to add money. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8">
      
      <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-8 mb-10 text-white shadow-xl shadow-violet-500/20 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <p className="text-violet-200 font-medium mb-1">Current Balance</p>
          {loading ? (
            <div className="mt-2">
              <Skeleton className="h-12 w-44 rounded-2xl bg-white/20" />
            </div>
          ) : (
            <h1 className="text-5xl font-extrabold tracking-tight">₹{balance}</h1>
          )}
        </div>
        
        <form onSubmit={handleAddMoney} className="flex flex-col sm:flex-row bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 w-full md:w-auto gap-2">
          <input 
            type="number" 
            value={amount} 
            onChange={e => setAmount(e.target.value)} 
            placeholder="Amount to add" 
            className="bg-transparent text-white placeholder-white/60 outline-none p-3 w-full sm:w-40 font-medium" 
            required 
            min="1"
          />
          <button type="submit" className="bg-white text-violet-700 font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
            Top Up
          </button>
        </form>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6 px-2">Transaction History</h2>
      <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6">
            <SkeletonTable rows={6} cols={4} />
          </div>
        ) : history.length === 0 ? (
          <div className="p-12 text-center text-gray-500 font-medium">
            You don't have any wallet transactions yet.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {history.map(tx => (
              <li key={tx._id} className="p-6 flex justify-between items-center hover:bg-gray-50/50 transition">
                <div className="flex items-center gap-5">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-2xl ${tx.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                    {tx.type === 'credit' ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" opacity="0.3"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path></svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path></svg>
                    )}
                  </div>
                  <div>
                    <span className="block font-bold text-gray-800 capitalize tracking-wide">{tx.type}</span>
                    <span className="text-gray-400 text-sm font-medium">{new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
                <div className="text-right flex flex-col justify-center">
                  <p className={`font-extrabold text-xl ${tx.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                    {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount}
                  </p>
                  <p className="text-xs font-bold text-gray-400 bg-gray-100 uppercase tracking-widest inline-block px-2 py-0.5 rounded-md mt-1 self-end">
                    Bal: ₹{tx.balanceAfter}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
export default Wallet;
