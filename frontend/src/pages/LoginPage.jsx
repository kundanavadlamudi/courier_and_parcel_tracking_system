import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiPackage, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email.endsWith("@gmail.com")) return toast.error('Please use a valid Gmail address');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email: form.email, password: form.password });
      console.log('LOGIN RESPONSE:', data);
      login(data, data.token);
      toast.success(`Welcome back, ${data.name}!`);
      window.location.href = data.role === 'admin' ? '/admin' : '/dashboard';
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto grid min-h-screen max-w-full lg:grid-cols-[3fr_1.2fr]">
        <div className="relative hidden overflow-hidden lg:block">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(/login-bg.jpg)` }} />
          <div className="absolute inset-0 bg-slate-950/25" />
          <div className="relative z-10 flex h-full flex-col justify-between p-16 text-white">
            <div className="max-w-xl">
              <p className="text-sm uppercase tracking-[0.3em] text-orange-300/90 mb-4">Courier tracking</p>
              <h1 className="text-5xl font-display font-bold leading-tight mb-6">Track parcels with clarity and speed.</h1>
              <p className="text-slate-200 max-w-lg leading-relaxed">
                Login to your dashboard for real-time delivery updates, shipment insights, and easy package management.
              </p>
            </div>
            <div className="space-y-3 text-slate-300 text-sm">
              <p className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-orange-400" />Realtime status</p>
              <p className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-orange-400" />Fast secure access</p>
              <p className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-orange-400" />One place to manage parcels</p>
            </div>
          </div>
        </div>

        <div className="flex items-stretch justify-start">
          <div className="w-full h-full rounded-[36px] border border-white/10 bg-white/10 p-10 backdrop-blur-3xl shadow-2xl shadow-slate-950/20">
            <div className="mb-8 text-center">
              <h2 className="text-4xl font-display font-bold text-white mb-2">Login</h2>
              <p className="text-slate-300">Access your account and manage your shipments.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    className="w-full rounded-2xl bg-white/10 border border-white/10 py-3 pl-12 pr-4 text-white placeholder-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 outline-none transition"
                    placeholder="you@gmail.com"
                    pattern=".+@gmail\.com$"
                    title="Please use a valid Gmail address"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    className="w-full rounded-2xl bg-white/10 border border-white/10 py-3 pl-12 pr-12 text-white placeholder-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 outline-none transition"
                    placeholder="Password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPwd ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-sm">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded accent-orange-500 bg-slate-800 border border-white/10"
                    checked={form.remember}
                    onChange={e => setForm({ ...form, remember: e.target.checked })}
                  />
                  Remember me
                </label>
                <button type="button" className="text-orange-300 text-sm hover:text-orange-200 transition-colors">Forgot password?</button>
              </div>

              <button type="submit" disabled={loading} className="btn-orange w-full flex items-center justify-center gap-2 rounded-2xl py-3 text-base">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Login <FiArrowRight /></>
                )}
              </button>
            </form>


            <p className="text-center text-slate-400 mt-6 text-sm">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="text-orange-300 hover:text-orange-200 font-medium transition-colors">Create account</Link>
            </p>
            <p className="text-center text-slate-400 mt-3 text-sm">
              Just tracking a parcel?{' '}
              <Link to="/track-parcel" className="text-orange-300 hover:text-orange-200 font-medium transition-colors">Track without login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

