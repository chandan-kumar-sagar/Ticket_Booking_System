import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const langLabels = {
  en: 'English',
  hi: 'हिन्दी',
  bn: 'বাংলা',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  mr: 'मराठी',
  gu: 'ગુજરાતી',
  kn: 'ಕನ್ನಡ',
  ml: 'മലയാളം',
  pa: 'ਪੰਜਾਬੀ'
};

export default function Footer() {
  const { i18n } = useTranslation();
  const year = new Date().getFullYear();

  const token = sessionStorage.getItem('token');
  const role = sessionStorage.getItem('role');
  const isAuthenticated = !!token;

  const lang = (i18n.resolvedLanguage || i18n.language || 'en').split('-')[0];

  const homePath =
    isAuthenticated && role === 'admin'
      ? '/admin'
      : isAuthenticated
        ? '/dashboard'
        : '/';

  return (
    <footer className="relative z-10 mt-auto border-t border-white/30 bg-white/60 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
          <div className="space-y-4">
            <Link to={homePath} className="inline-flex items-center gap-3">
              <img
                src="/brand-ticket.png"
                alt="TicketHub"
                className="h-10 w-16 rounded-2xl object-contain border border-white/70 bg-white/70 p-1.5 shadow-sm"
              />
              <span className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-violet-600">
                TicketHub
              </span>
            </Link>

            <p className="text-sm font-semibold text-gray-600">
              A modern ticket booking system with wallet, seat selection, admin event creation, monitoring, and refunds.
            </p>

            <p className="text-xs font-extrabold text-gray-500">
              © {year} TicketHub
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-black text-gray-900">Quick Links</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-2">
              <Link className="rounded-2xl px-4 py-3 sm:px-3 sm:py-2 text-sm font-extrabold text-gray-800 bg-white/70 border border-white/70 hover:bg-white transition text-center" to={homePath}>
                Home
              </Link>
              {isAuthenticated && role === 'user' && (
                <>
                  <Link className="rounded-2xl px-4 py-3 sm:px-3 sm:py-2 text-sm font-extrabold text-gray-800 bg-white/70 border border-white/70 hover:bg-white transition text-center" to="/wallet">
                    Wallet
                  </Link>
                  <Link className="rounded-2xl px-4 py-3 sm:px-3 sm:py-2 text-sm font-extrabold text-gray-800 bg-white/70 border border-white/70 hover:bg-white transition text-center" to="/history">
                    My Tickets
                  </Link>
                </>
              )}
              {isAuthenticated && role === 'admin' && (
                <>
                  <Link className="rounded-2xl px-4 py-3 sm:px-3 sm:py-2 text-sm font-extrabold text-gray-800 bg-white/70 border border-white/70 hover:bg-white transition text-center" to="/admin/transactions">
                    Transactions
                  </Link>
                  <Link className="rounded-2xl px-4 py-3 sm:px-3 sm:py-2 text-sm font-extrabold text-gray-800 bg-white/70 border border-white/70 hover:bg-white transition text-center" to="/admin/refunds">
                    Refunds
                  </Link>
                </>
              )}
              {!isAuthenticated && (
                <>
                  <Link className="rounded-2xl px-4 py-3 sm:px-3 sm:py-2 text-sm font-extrabold text-gray-800 bg-white/70 border border-white/70 hover:bg-white transition text-center" to="/signup">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-black text-gray-900">Session Info</p>
            <div className="rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-sm">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div className="text-gray-500 font-semibold">Status</div>
                <div className="text-gray-900 font-extrabold text-right">{isAuthenticated ? 'Logged in' : 'Guest'}</div>

                <div className="text-gray-500 font-semibold">Role</div>
                <div className="text-gray-900 font-extrabold text-right">{role || '-'}</div>

                <div className="text-gray-500 font-semibold">Language</div>
                <div className="text-gray-900 font-extrabold text-right">{langLabels[lang] || lang}</div>
              </div>

              <div className="mt-5 pt-5 border-t border-white/70">
                <p className="text-gray-500 text-sm font-semibold">Created by</p>
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <p className="text-gray-900 font-black">Chandan Kumar</p>
                  <p className="text-gray-700 font-extrabold text-sm">Mob: 7295805328</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

