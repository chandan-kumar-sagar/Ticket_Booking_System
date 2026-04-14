import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import API from '../api/api';
import { useTranslation } from 'react-i18next';

const Signup = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const endpoint = isAdmin ? '/api/v1/Admin/admin/signup' : '/api/v1/user/user/signup';
      const { data } = await API.post(endpoint, { name, email, password });
      
      alert(data.message || 'Successfully created your profile!');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.msg || 'Signup failed');
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
          {t('signup.title')}
        </h2>
        
        <form onSubmit={handleSignup} className="flex flex-col gap-5 relative z-10">
          <input
            className="bg-white border border-gray-200 shadow-sm outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-violet-300 p-4 rounded-2xl transition font-semibold text-gray-900 placeholder-gray-500"
            type="text"
            placeholder={t('signup.fullName')}
            value={name}
            onChange={e => setName(e.target.value)}
            required
            disabled={submitting}
          />
          <input
            className="bg-white border border-gray-200 shadow-sm outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-violet-300 p-4 rounded-2xl transition font-semibold text-gray-900 placeholder-gray-500"
            type="email"
            placeholder={t('signup.email')}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={submitting}
          />
          <input
            className="bg-white border border-gray-200 shadow-sm outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-violet-300 p-4 rounded-2xl transition font-semibold text-gray-900 placeholder-gray-500"
            type="password"
            placeholder={t('signup.password')}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={submitting}
          />
          
          <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-200 mb-1 shadow-inner">
            <button 
              type="button"
              onClick={() => setIsAdmin(false)}
              className={`flex-1 py-3 text-sm font-extrabold transition-all rounded-xl ${
                !isAdmin
                  ? 'bg-white shadow-sm ring-1 ring-gray-200 text-violet-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('signup.userRegister')}
            </button>
            <button 
              type="button"
              onClick={() => setIsAdmin(true)}
              className={`flex-1 py-3 text-sm font-extrabold transition-all rounded-xl ${
                isAdmin
                  ? 'bg-white shadow-sm ring-1 ring-gray-200 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('signup.adminRegister')}
            </button>
          </div>
          
          <button type="submit" className="mt-3 w-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 text-white font-extrabold py-4 rounded-2xl shadow-[0_10px_20px_rgba(109,40,217,0.25)] hover:shadow-[0_15px_25px_rgba(109,40,217,0.35)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300">
            {submitting ? 'Loading…' : t('signup.cta')}
          </button>
        </form>
        
        <p className="mt-7 sm:mt-8 text-center font-semibold text-gray-600 relative z-10 w-full pt-6 border-t border-gray-200/70">
          {t('signup.already')}
          <br />
          <Link to="/" className="text-transparent bg-clip-text bg-gradient-to-r from-violet-700 via-fuchsia-700 to-indigo-700 font-black hover:underline transition-colors mt-2 inline-block">
            {t('signup.goLogin')}
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Signup;
