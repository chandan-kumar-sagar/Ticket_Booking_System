import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const token = sessionStorage.getItem('token');
  const role = sessionStorage.getItem('role');
  const isAuthenticated = !!token;
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
    window.location.reload(); 
  };

  const brandTo = useMemo(
    () => (isAuthenticated && role === 'admin' ? '/admin' : isAuthenticated ? '/dashboard' : '/'),
    [isAuthenticated, role]
  );

  const closeMobile = () => setMobileOpen(false);
  const setLang = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
  };
  const currentLang = (i18n.resolvedLanguage || i18n.language || 'en').split('-')[0];

  const langOptions = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'bn', label: 'বাংলা' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'mr', label: 'मराठी' },
    { code: 'gu', label: 'ગુજરાતી' },
    { code: 'kn', label: 'ಕನ್ನಡ' },
    { code: 'ml', label: 'മലയാളം' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Desktop / laptop */}
        <div className="hidden lg:flex items-center justify-between py-3">
          {/* Brand */}
          <Link to={brandTo} className="inline-flex items-center gap-3 text-2xl font-black tracking-tight">
            <span className="inline-flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur border border-white/70 shadow-sm p-1.5">
              <img
                src="/brand-ticket.png"
                alt="TicketHub"
                className="h-9 w-14 rounded-xl object-contain"
                style={{ imageRendering: 'auto' }}
              />
            </span>
            <span className="leading-none text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-violet-600 drop-shadow-sm">
              TicketHub
            </span>
          </Link>

          {/* Center nav with equal spacing */}
          <nav className="flex-1 flex justify-center">
            <div className="flex items-center gap-10 text-base">
              {isAuthenticated && role === 'admin' && (
                <>
                  <Link className="font-extrabold text-gray-700 hover:text-gray-900" to="/admin">{t('nav.adminPanel')}</Link>
                  <Link className="font-extrabold text-gray-700 hover:text-gray-900" to="/admin/bookings">{t('nav.globalBookings')}</Link>
                  <Link className="font-extrabold text-gray-700 hover:text-gray-900" to="/admin/transactions">{t('nav.transactions')}</Link>
                  <Link className="font-extrabold text-gray-700 hover:text-gray-900" to="/admin/refunds">{t('nav.refundRequests')}</Link>
                </>
              )}

              {isAuthenticated && role === 'user' && (
                <>
                  <Link className="font-extrabold text-gray-700 hover:text-gray-900" to="/dashboard">{t('nav.userDashboard')}</Link>
                  <Link className="font-extrabold text-gray-700 hover:text-gray-900" to="/history">{t('nav.myBookedTickets')}</Link>
                  <Link className="font-extrabold text-gray-700 hover:text-gray-900" to="/wallet">{t('nav.myWallet')}</Link>
                </>
              )}
            </div>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={currentLang}
                onChange={(e) => setLang(e.target.value)}
                className="rounded-xl border border-white/60 bg-white/60 px-3 py-2 text-sm font-extrabold text-gray-800 shadow-sm"
                aria-label={t('nav.language')}
              >
                {langOptions.map((o) => (
                  <option key={o.code} value={o.code}>{o.label}</option>
                ))}
              </select>
            </div>

            {!isAuthenticated && (
              <>
                <Link to="/" className="rounded-xl px-4 py-2 font-semibold text-gray-800 hover:bg-white/60 transition">
                  {t('nav.login')}
                </Link>
                <Link to="/signup" className="rounded-xl px-4 py-2 font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm">
                  {t('nav.register')}
                </Link>
              </>
            )}

            {isAuthenticated && (
              <button onClick={handleLogout} className="rounded-xl px-4 py-2 font-extrabold text-white bg-red-600 hover:bg-red-700 transition shadow-sm">
                {t('nav.logout')}
              </button>
            )}
          </div>
        </div>

        {/* Mobile / small screens */}
        <div className="lg:hidden py-3">
          <div className="flex items-center justify-between gap-3">
            <Link onClick={closeMobile} to={brandTo} className="inline-flex items-center gap-2 text-xl font-black tracking-tight">
              <span className="inline-flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur border border-white/70 shadow-sm p-1.5">
                <img
                  src="/brand-ticket.png"
                  alt="TicketHub"
                  className="h-8 w-12 rounded-xl object-contain"
                  style={{ imageRendering: 'auto' }}
                />
              </span>
              <span className="leading-none text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-violet-600 drop-shadow-sm">
                TicketHub
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(v => !v)}
              className="rounded-2xl border border-white/60 bg-white/60 px-3 py-2 font-extrabold text-gray-800 shadow-sm"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {mobileOpen && (
            <div className="mt-3 rounded-3xl border border-white/60 bg-white/70 backdrop-blur p-3 shadow-sm">
              <nav className="flex flex-col gap-1 text-sm">
                {isAuthenticated && role === 'admin' && (
                  <>
                    <Link onClick={closeMobile} className="rounded-2xl px-4 py-3 font-extrabold text-gray-800 hover:bg-white/70 transition" to="/admin">{t('nav.adminPanel')}</Link>
                    <Link onClick={closeMobile} className="rounded-2xl px-4 py-3 font-extrabold text-gray-800 hover:bg-white/70 transition" to="/admin/bookings">{t('nav.globalBookings')}</Link>
                    <Link onClick={closeMobile} className="rounded-2xl px-4 py-3 font-extrabold text-gray-800 hover:bg-white/70 transition" to="/admin/transactions">{t('nav.transactions')}</Link>
                    <Link onClick={closeMobile} className="rounded-2xl px-4 py-3 font-extrabold text-gray-800 hover:bg-white/70 transition" to="/admin/refunds">{t('nav.refundRequests')}</Link>
                  </>
                )}

                {isAuthenticated && role === 'user' && (
                  <>
                    <Link onClick={closeMobile} className="rounded-2xl px-4 py-3 font-extrabold text-gray-800 hover:bg-white/70 transition" to="/dashboard">{t('nav.userDashboard')}</Link>
                    <Link onClick={closeMobile} className="rounded-2xl px-4 py-3 font-extrabold text-gray-800 hover:bg-white/70 transition" to="/history">{t('nav.myBookedTickets')}</Link>
                    <Link onClick={closeMobile} className="rounded-2xl px-4 py-3 font-extrabold text-gray-800 hover:bg-white/70 transition" to="/wallet">{t('nav.myWallet')}</Link>
                  </>
                )}
              </nav>

              <div className="mt-2 border-t border-white/60 pt-2 flex flex-col gap-2">
                <div className="px-1">
                  <label className="block text-xs font-extrabold text-gray-500 px-3 pb-2">
                    {t('nav.language')}
                  </label>
                  <select
                    value={currentLang}
                    onChange={(e) => setLang(e.target.value)}
                    className="w-full rounded-2xl border border-white/60 bg-white/60 px-4 py-3 font-extrabold text-gray-800 shadow-sm"
                  >
                    {langOptions.map((o) => (
                      <option key={o.code} value={o.code}>{o.label}</option>
                    ))}
                  </select>
                </div>

                {!isAuthenticated && (
                  <>
                    <Link onClick={closeMobile} to="/" className="rounded-2xl px-4 py-3 font-extrabold text-gray-800 hover:bg-white/70 transition">
                      {t('nav.login')}
                    </Link>
                    <Link onClick={closeMobile} to="/signup" className="rounded-2xl px-4 py-3 font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm">
                      {t('nav.register')}
                    </Link>
                  </>
                )}

                {isAuthenticated && (
                  <button onClick={handleLogout} className="rounded-2xl px-4 py-3 font-extrabold text-white bg-red-600 hover:bg-red-700 transition shadow-sm text-left">
                    {t('nav.logout')}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
