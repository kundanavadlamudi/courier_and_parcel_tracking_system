import React, { useState } from 'react';
import { FiBox, FiCheckCircle, FiMapPin, FiPackage, FiSearch, FiTruck } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';

const STAGES = ['Booked', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'];
const STAGE_ICONS = {
  Booked: FiBox,
  'Picked Up': FiPackage,
  'In Transit': FiTruck,
  'Out for Delivery': FiMapPin,
  Delivered: FiCheckCircle
};

export default function TrackParcelPage({ publicMode = false }) {
  const [trackingId, setTrackingId] = useState('');
  const [parcel, setParcel] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return toast.error('Enter a tracking ID');
    setLoading(true);
    try {
      const { data } = await api.get(`/parcels/${trackingId.trim().toUpperCase()}`);
      setParcel(data);
    } catch {
      toast.error('Parcel not found. Check your tracking ID.');
      setParcel(null);
    } finally {
      setLoading(false);
    }
  };

  const currentStageIdx = parcel ? STAGES.indexOf(parcel.status) : -1;

  return (
    <div className={publicMode ? 'min-h-screen bg-slate-950 p-6' : ''}>
      <div className="max-w-3xl mx-auto animate-fade-in">
        {publicMode && (
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Parcelyt Logo" className="w-10 h-10 rounded-xl" />
              <div>
                <div className="text-white font-display font-bold">Parcelyt</div>
                <div className="text-slate-500 text-xs">Courier Tracking</div>
              </div>
            </div>
            <a href="/login" className="btn-ghost py-2 px-4 text-sm">Login</a>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold text-white mb-1">Track Your Parcel</h1>
          <p className="text-slate-400">Enter your tracking ID to get delivery updates</p>
        </div>

        <form onSubmit={handleTrack} className="card-glass mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                className="input-dark pl-11 font-mono uppercase text-lg tracking-widest"
                placeholder="TRK0000000000"
                value={trackingId}
                onChange={e => setTrackingId(e.target.value.toUpperCase())}
                maxLength={13}
              />
            </div>
            <button type="submit" disabled={loading} className="btn-orange px-8 flex items-center justify-center gap-2 flex-shrink-0">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiSearch /> Track</>}
            </button>
          </div>
        </form>

        {parcel && (
          <div className="space-y-6 animate-slide-up">
            <div className="card-glass">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Tracking ID</p>
                  <p className="text-2xl font-mono font-bold text-orange-400">{parcel.trackingId}</p>
                </div>
                <StatusBadge status={parcel.status} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  ['From', parcel.senderName],
                  ['To', parcel.receiverName],
                  ['Type', parcel.parcelType],
                  ['Priority', parcel.priority],
                ].map(([label, val]) => (
                  <div key={label} className="glass rounded-xl p-3">
                    <div className="text-slate-500 text-xs mb-1">{label}</div>
                    <div className="text-white text-sm font-medium truncate">{val}</div>
                  </div>
                ))}
              </div>
              {parcel.estimatedDelivery && (
                <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                  <span className="text-orange-300 text-sm">
                    Estimated Delivery: <strong>{format(new Date(parcel.estimatedDelivery), 'EEEE, MMMM d, yyyy')}</strong>
                  </span>
                </div>
              )}
            </div>

            <div className="card-glass">
              <h3 className="text-lg font-display font-semibold text-white mb-6">Delivery Progress</h3>
              <div className="relative">
                <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-white/10" />
                <div
                  className="absolute top-5 left-[10%] h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-1000"
                  style={{ width: parcel.status === 'Cancelled' ? '0%' : `${Math.max(0, (currentStageIdx / (STAGES.length - 1)) * 80)}%` }}
                />
                <div className="relative flex justify-between">
                  {STAGES.map((stage, idx) => {
                    const Icon = STAGE_ICONS[stage];
                    const done = idx <= currentStageIdx && parcel.status !== 'Cancelled';
                    const active = idx === currentStageIdx && parcel.status !== 'Cancelled';
                    return (
                      <div key={stage} className="flex flex-col items-center gap-2" style={{ width: `${100 / STAGES.length}%` }}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-500 border-2 ${
                          done ? 'bg-gradient-to-br from-orange-500 to-amber-500 border-orange-400 shadow-lg shadow-orange-500/30' :
                          'bg-slate-800 border-white/10'
                        } ${active ? 'scale-110' : ''}`}>
                          <Icon className={`text-base ${done ? 'text-white' : 'text-slate-500'}`} />
                        </div>
                        <span className={`text-xs text-center font-medium leading-tight ${done ? 'text-orange-300' : 'text-slate-500'}`}>
                          {stage}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="card-glass">
              <h3 className="text-lg font-display font-semibold text-white mb-6">Tracking History</h3>
              <div className="relative space-y-0">
                {[...parcel.trackingHistory].reverse().map((entry, i) => (
                  <div key={i} className="flex gap-4 pb-6 last:pb-0 relative">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${i === 0 ? 'bg-orange-400' : 'bg-slate-600'}`} />
                      {i < parcel.trackingHistory.length - 1 && <div className="w-px flex-1 bg-white/10 mt-1" />}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className={`font-semibold text-sm ${i === 0 ? 'text-white' : 'text-slate-400'}`}>{entry.status}</div>
                          {entry.description && <div className="text-slate-500 text-xs mt-0.5">{entry.description}</div>}
                          {entry.location && <div className="text-slate-500 text-xs mt-0.5 flex items-center gap-1"><FiMapPin className="text-xs" />{entry.location}</div>}
                        </div>
                        <div className="text-slate-500 text-xs flex-shrink-0">{format(new Date(entry.updatedAt), 'MMM d, HH:mm')}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
