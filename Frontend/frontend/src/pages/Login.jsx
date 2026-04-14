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
    <div className="flex flex-col items-center justify-center py-10 sm:py-14">
      <div className="p-6 sm:p-8 md:p-10 bg-white/80 backdrop-blur-2xl shadow-2xl shadow-indigo-500/10 border border-white/70 rounded-3xl w-full max-w-md relative overflow-hidden">
        
        <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-indigo-400 rounded-full mix-blend-multiply filter blur-[50px] opacity-40 pointer-events-none"></div>
        <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 bg-fuchsia-400 rounded-full mix-blend-multiply filter blur-[50px] opacity-40 pointer-events-none"></div>

        <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-700 via-fuchsia-700 to-indigo-700 mb-7 sm:mb-8 text-center relative z-10 tracking-tight drop-shadow-[0_2px_12px_rgba(109,40,217,0.18)]">
          {t('login.title')}
        </h2>
        
        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-extrabold text-red-700 relative z-10 flex gap-3 items-start">
            <span className="mt-0.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 9v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M10.3 4.3 2.6 18.2c-.6 1.1.2 2.5 1.5 2.5h15.8c1.3 0 2.1-1.4 1.5-2.5L13.7 4.3c-.6-1.1-2.2-1.1-2.8 0Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            </span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5 relative z-10">
          <input
            className="bg-white border border-gray-200 shadow-sm outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-violet-300 p-4 rounded-2xl transition font-semibold text-gray-900 placeholder-gray-500"
            type="email"
            placeholder={t('login.email')}
            value={email}
            onChange={e => { setEmail(e.target.value); if (error) setError(''); }}
            required
            disabled={submitting}
          />
          <input
            className="bg-white border border-gray-200 shadow-sm outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-violet-300 p-4 rounded-2xl transition font-semibold text-gray-900 placeholder-gray-500"
            type="password"
            placeholder={t('login.password')}
            value={password}
            onChange={e => { setPassword(e.target.value); if (error) setError(''); }}
            required
            disabled={submitting}
          />
          
          <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-200 mb-1 shadow-inner">
            <button 
              type="button"
              onClick={() => { setIsAdmin(false); setError(''); }}
              className={`flex-1 py-3 text-sm font-extrabold transition-all rounded-xl ${
                !isAdmin
                  ? 'bg-white shadow-sm ring-1 ring-gray-200 text-violet-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('login.userLogin')}
            </button>
            <button 
              type="button"
              onClick={() => { setIsAdmin(true); setError(''); }}
              className={`flex-1 py-3 text-sm font-extrabold transition-all rounded-xl ${
                isAdmin
                  ? 'bg-white shadow-sm ring-1 ring-gray-200 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('login.adminLogin')}
            </button>
          </div>
          
          <button type="submit" className="mt-3 w-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 text-white font-extrabold py-4 rounded-2xl shadow-[0_10px_20px_rgba(109,40,217,0.25)] hover:shadow-[0_15px_25px_rgba(109,40,217,0.35)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300">
            {submitting ? 'Loading…' : t('login.cta')}
          </button>
        </form>
        
        <p className="mt-7 sm:mt-8 text-center font-semibold text-gray-600 relative z-10 w-full pt-6 border-t border-gray-200/70">
          {t('login.firstTime')}
          <br />
          <Link to="/signup" className="text-transparent bg-clip-text bg-gradient-to-r from-violet-700 via-fuchsia-700 to-indigo-700 font-black hover:underline transition-colors mt-2 inline-block">
            {t('login.goRegister')}
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Login;
