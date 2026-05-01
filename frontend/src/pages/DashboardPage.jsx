import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiCheckCircle, FiClock, FiXCircle, FiPlusCircle, FiSearch, FiArrowRight, FiTruck } from 'react-icons/fi';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import { format } from 'date-fns';

const StatCard = ({ icon: Icon, label, value, color, gradient }) => (
  <div className={`card-glass relative overflow-hidden group hover:-translate-y-1 transition-all duration-300`}>
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${gradient}`} />
    <div className="relative flex items-start justify-between">
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{label}</p>
        <p className="text-4xl font-display font-bold text-white">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="text-xl text-white" />
      </div>
    </div>
  </div>
);

const QuickAction = ({ to, icon: Icon, label, desc, color }) => (
  <Link to={to} className="card-glass group hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 cursor-pointer">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} flex-shrink-0`}>
      <Icon className="text-xl text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-white font-semibold group-hover:text-orange-300 transition-colors">{label}</div>
      <div className="text-slate-400 text-sm">{desc}</div>
    </div>
    <FiArrowRight className="text-slate-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
  </Link>
);

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, delivered: 0, pending: 0, cancelled: 0, recent: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/parcels/dashboard').then(r => { setStats(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const statCards = [
    { icon: FiPackage, label: 'Total Parcels', value: stats.total, color: 'bg-gradient-to-br from-orange-500 to-amber-500', gradient: 'bg-gradient-to-br from-orange-500/5 to-transparent' },
    { icon: FiCheckCircle, label: 'Delivered', value: stats.delivered, color: 'bg-gradient-to-br from-emerald-500 to-teal-500', gradient: 'bg-gradient-to-br from-emerald-500/5 to-transparent' },
    { icon: FiClock, label: 'In Progress', value: stats.pending, color: 'bg-gradient-to-br from-blue-500 to-cyan-500', gradient: 'bg-gradient-to-br from-blue-500/5 to-transparent' },
    { icon: FiXCircle, label: 'Cancelled', value: stats.cancelled, color: 'bg-gradient-to-br from-red-500 to-rose-500', gradient: 'bg-gradient-to-br from-red-500/5 to-transparent' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">👋</span>
          <h1 className="text-2xl font-display font-bold text-white">Welcome back, {user?.name?.split(' ')[0]}!</h1>
        </div>
        <p className="text-slate-400">Here's what's happening with your shipments today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} value={loading ? '–' : card.value} />
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-display font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickAction to="/book" icon={FiPlusCircle} label="Book a Parcel" desc="Send a new package" color="bg-gradient-to-br from-orange-500 to-amber-500" />
          <QuickAction to="/track" icon={FiSearch} label="Track Parcel" desc="Enter your tracking ID" color="bg-gradient-to-br from-blue-500 to-cyan-500" />
          <QuickAction to="/history" icon={FiClock} label="View History" desc="All your shipments" color="bg-gradient-to-br from-emerald-500 to-teal-500" />
        </div>
      </div>

      {/* Recent Shipments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold text-white">Recent Shipments</h2>
          <Link to="/history" className="text-orange-400 hover:text-orange-300 text-sm flex items-center gap-1 transition-colors">View all <FiArrowRight /></Link>
        </div>
        <div className="card-glass overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : stats.recent.length === 0 ? (
            <div className="text-center py-12">
              <FiTruck className="text-4xl text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No shipments yet</p>
              <Link to="/book" className="btn-orange inline-flex items-center gap-2 mt-4 text-sm px-4 py-2">Book your first parcel <FiArrowRight /></Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/8">
                    {['Tracking ID', 'Receiver', 'Type', 'Status', 'Date'].map(h => (
                      <th key={h} className="text-left text-slate-500 text-xs font-semibold uppercase tracking-wider px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {stats.recent.map(p => (
                    <tr key={p._id} className="hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3 font-mono text-orange-400 text-sm">{p.trackingId}</td>
                      <td className="px-4 py-3 text-slate-300 text-sm">{p.receiverName}</td>
                      <td className="px-4 py-3 text-slate-400 text-sm">{p.parcelType}</td>
                      <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                      <td className="px-4 py-3 text-slate-400 text-sm">{format(new Date(p.createdAt), 'MMM d, yyyy')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
