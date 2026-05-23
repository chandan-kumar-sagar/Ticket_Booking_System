import { useState, useEffect } from 'react';
import API from '../api/api';
import { Skeleton, SkeletonTable } from '../components/Skeleton';

const Wallet = () => {
  const [history, setHistory] = useState([]);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await API.get('/api/v1/user/data/wallet/history');
      const transactions = Array.isArray(res.data) ? res.data : [];
      setHistory(transactions);
      if (transactions.length > 0) setBalance(transactions[0].balanceAfter);
      else setBalance(0);
    } catch (err) {
      console.error(err);
      setHistory([]);
      setBalance(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleAddMoney = async (e) => {
    e.preventDefault();
    if (Number(amount) <= 0) return;
    try {
      setAdding(true);
      const res = await API.post('/api/v1/user/data/wallet/add', { amount: Number(amount) });
      if (typeof res.data?.balance === 'number') setBalance(res.data.balance);
      setAmount('');
      fetchHistory();
    } catch {
      alert('Failed to add money. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10">

      {/* Header label */}
      <p className="text-xs font-extrabold tracking-widest text-violet-400 uppercase mb-2">✦ My Wallet</p>

      {/* Balance hero card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl shadow-2xl mb-8">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/60 via-fuchsia-900/40 to-indigo-900/60 pointer-events-none" />
        <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full bg-fuchsia-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 p-8">
          <div>
            <p className="text-violet-300 font-semibold text-sm mb-2">💳 Current Balance</p>
            {loading ? (
              <Skeleton className="h-14 w-44 rounded-2xl bg-white/10" />
            ) : (
              <div className="flex items-end gap-2">
                <span className="text-5xl sm:text-6xl font-black text-white tracking-tight">₹{balance}</span>
                <span className="text-violet-300 font-semibold mb-1">INR</span>
              </div>
            )}
          </div>

          {/* Top up form */}
          <form
            id="wallet-topup-form"
            onSubmit={handleAddMoney}
            className="flex flex-col sm:flex-row gap-3 bg-white/10 backdrop-blur p-3 rounded-2xl border border-white/20 w-full md:w-auto"
          >
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 font-bold text-sm">₹</span>
              <input
                id="wallet-amount-input"
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="bg-white/10 text-white placeholder-white/40 outline-none pl-7 pr-4 py-3 rounded-xl font-semibold w-full sm:w-36 border border-white/10 focus:border-violet-400/50 focus:bg-white/15 transition-all"
                required
                min="1"
              />
            </div>
            <button
              id="wallet-topup-btn"
              type="submit"
              disabled={adding}
              className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-extrabold px-6 py-3 rounded-xl hover:from-violet-600 hover:to-fuchsia-600 hover:shadow-lg hover:shadow-violet-500/30 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {adding ? '…' : '⚡ Top Up'}
            </button>
          </form>
        </div>
      </div>

      {/* Transaction History */}
      <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
        📋 Transaction History
      </h2>

      <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-6"><SkeletonTable rows={6} cols={4} /></div>
        ) : history.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-4xl mb-3">💸</div>
            <p className="text-white/30 font-semibold">No wallet transactions yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-white/8">
            {history.map((tx, i) => (
              <li
                key={tx._id || i}
                className="p-5 flex justify-between items-center hover:bg-white/5 transition-colors duration-150"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-2xl border text-lg ${
                    tx.type === 'credit'
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                      : 'bg-red-500/15 border-red-500/30 text-red-400'
                  }`}>
                    {tx.type === 'credit' ? '↑' : '↓'}
                  </div>
                  <div>
                    <span className="block font-extrabold text-white capitalize">
                      {tx.type === 'credit' ? 'Money Added' : 'Payment Deducted'}
                    </span>
                    <span className="text-white/40 text-sm font-medium">
                      {new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-black text-xl ${tx.type === 'credit' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                  </p>
                  <p className="text-xs font-bold text-white/30 bg-white/5 border border-white/10 uppercase tracking-widest px-2 py-0.5 rounded-lg mt-1 inline-block">
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
