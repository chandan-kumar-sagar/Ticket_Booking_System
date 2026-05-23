import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import API from '../api/api';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSubmitting(true);
      const url = isAdmin ? '/api/v1/Admin/login' : '/api/v1/user/login';
      const { data } = await API.post(url, { email, password });
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('role', data.role);
      sessionStorage.setItem('userId', data.userId);
      if (data.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
      window.location.reload();
    } catch (err) {
      const msg = err.response?.data?.msg;
      setError(msg || t('login.invalidCredentials'));
    } finally {
      setSubmitting(false);
    }
  };

  const existingToken = sessionStorage.getItem('token');
  const existingRole = sessionStorage.getItem('role');
  if (existingToken) {
    return <Navigate to={existingRole === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 sm:py-16 px-4">
      {/* Outer glow ring */}
      <div className="relative w-full max-w-md">
        {/* Animated glow behind card */}
        <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-violet-600/40 via-fuchsia-600/40 to-indigo-600/40 blur-xl animate-pulse-slow pointer-events-none" />

        {/* Dark glass card */}
        <div className="relative p-7 sm:p-10 bg-white/5 backdrop-blur-2xl border border-white/15 rounded-[2rem] shadow-[0_25px_60px_rgba(0,0,0,0.5)] overflow-hidden">

          {/* Inner decorative nebula orbs */}
          <div className="absolute -top-14 -right-14 w-44 h-44 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-14 -left-14 w-44 h-44 bg-fuchsia-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Icon badge */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-[0_8px_32px_rgba(139,92,246,0.5)] border border-white/20">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12Zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8Z" fill="white"/>
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-black text-center mb-2 tracking-tight leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300">
              {t('login.title')}
            </span>
          </h1>
          <p className="text-center text-sm text-white/40 font-semibold mb-8">
            Welcome back to TicketHub ✨
          </p>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 backdrop-blur px-4 py-3 text-sm font-bold text-red-300 flex gap-3 items-start">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0" aria-hidden="true">
                <path d="M12 9v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M10.3 4.3 2.6 18.2c-.6 1.1.2 2.5 1.5 2.5h15.8c1.3 0 2.1-1.4 1.5-2.5L13.7 4.3c-.6-1.1-2.2-1.1-2.8 0Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* Email */}
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-violet-400 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="m22 6-10 7L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <input
                className="w-full bg-white/8 border border-white/12 backdrop-blur text-white placeholder-white/30 font-semibold pl-11 pr-4 py-4 rounded-2xl outline-none focus:border-violet-400/60 focus:bg-white/12 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                type="email"
                placeholder={t('login.email')}
                value={email}
                onChange={e => { setEmail(e.target.value); if (error) setError(''); }}
                required
                disabled={submitting}
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-violet-400 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
              <input
                className="w-full bg-white/8 border border-white/12 backdrop-blur text-white placeholder-white/30 font-semibold pl-11 pr-12 py-4 rounded-2xl outline-none focus:border-violet-400/60 focus:bg-white/12 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                type={showPass ? 'text' : 'password'}
                placeholder={t('login.password')}
                value={password}
                onChange={e => { setPassword(e.target.value); if (error) setError(''); }}
                required
                disabled={submitting}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Role toggle */}
            <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 mt-1">
              <button
                type="button"
                id="login-user-tab"
                onClick={() => { setIsAdmin(false); setError(''); }}
                className={`flex-1 py-3 text-sm font-extrabold transition-all duration-200 rounded-xl ${
                  !isAdmin
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                👤 {t('login.userLogin')}
              </button>
              <button
                type="button"
                id="login-admin-tab"
                onClick={() => { setIsAdmin(true); setError(''); }}
                className={`flex-1 py-3 text-sm font-extrabold transition-all duration-200 rounded-xl ${
                  isAdmin
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                🛡️ {t('login.adminLogin')}
              </button>
            </div>

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={submitting}
              className="mt-2 w-full relative overflow-hidden font-extrabold py-4 rounded-2xl text-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed group"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7, #6366f1)' }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {submitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                      <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Signing in…
                  </>
                ) : (
                  <>{t('login.cta')} →</>
                )}
              </span>
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-200" />
            </button>
          </form>

          {/* Footer link */}
          <p className="mt-8 text-center text-sm text-white/40 font-semibold pt-6 border-t border-white/10">
            {t('login.firstTime')}{' '}
            <Link
              to="/signup"
              className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 font-black hover:opacity-80 transition-opacity ml-1"
            >
              {t('login.goRegister')} →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;
