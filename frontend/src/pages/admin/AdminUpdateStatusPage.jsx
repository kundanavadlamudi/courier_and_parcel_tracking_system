import React, { useState } from 'react';
import { FiSearch, FiRefreshCw, FiMapPin, FiCheckCircle, FiPackage, FiTruck } from 'react-icons/fi';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const STATUSES = ['Booked', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'];

export default function AdminUpdateStatusPage() {
  const [trackingId, setTrackingId] = useState('');
  const [parcel, setParcel] = useState(null);
  const [searching, setSearching] = useState(false);
  const [form, setForm] = useState({ status: '', location: '', description: '' });
  const [updating, setUpdating] = useState(false);

  const searchParcel = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return toast.error('Enter a tracking ID');
    setSearching(true);
    try {
      const { data } = await api.get(`/parcels/${trackingId.trim().toUpperCase()}`);
      setParcel(data);
      setForm({ status: data.status, location: '', description: '' });
    } catch {
      toast.error('Parcel not found');
      setParcel(null);
    } finally { setSearching(false); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.status) return toast.error('Select a status');
    if (!form.location.trim()) return toast.error('Enter the current location');
    setUpdating(true);
    try {
      const { data } = await api.put(`/admin/update-status/${parcel._id}`, form);
      setParcel(data);
      toast.success('Status updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setUpdating(false); }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-white mb-1">Update Delivery Status</h1>
        <p className="text-slate-400">Search a parcel and update its tracking status</p>
      </div>

      {/* Search */}
      <form onSubmit={searchParcel} className="card-glass mb-6 flex gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            className="input-dark pl-11 font-mono uppercase tracking-widest text-lg"
            placeholder="TRK0000000000"
            value={trackingId}
            onChange={e => setTrackingId(e.target.value.toUpperCase())}
            maxLength={13}
          />
        </div>
        <button type="submit" disabled={searching} className="btn-ghost px-6 flex items-center gap-2 flex-shrink-0">
          {searching ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSearch />}
          Search
        </button>
      </form>

      {parcel && (
        <div className="space-y-6 animate-slide-up">
          {/* Parcel info */}
          <div className="card-glass">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-slate-400 text-sm">Tracking ID</p>
                <p className="text-xl font-mono font-bold text-orange-400">{parcel.trackingId}</p>
              </div>
              <StatusBadge status={parcel.status} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                ['Sender', parcel.senderName],
                ['Receiver', parcel.receiverName],
                ['Type', parcel.parcelType],
                ['Priority', parcel.priority],
              ].map(([label, val]) => (
                <div key={label} className="glass rounded-xl p-3">
                  <div className="text-slate-500 text-xs mb-1">{label}</div>
                  <div className="text-white text-sm font-medium truncate">{val}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="glass rounded-xl p-3 flex items-start gap-2">
                <FiMapPin className="text-orange-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-slate-500 text-xs mb-0.5">From</div>
                  <div className="text-slate-300">{parcel.senderAddress}</div>
                </div>
              </div>
              <div className="glass rounded-xl p-3 flex items-start gap-2">
                <FiMapPin className="text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-slate-500 text-xs mb-0.5">To</div>
                  <div className="text-slate-300">{parcel.receiverAddress}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Update form */}
          <form onSubmit={handleUpdate} className="card-glass space-y-5">
            <h3 className="text-lg font-display font-semibold text-white flex items-center gap-2">
              <FiRefreshCw className="text-violet-400" /> Update Status
            </h3>

            <div>
              <label className="block text-slate-400 text-sm mb-2">New Status *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {STATUSES.map(s => (
                  <button
                    key={s} type="button"
                    onClick={() => setForm(f => ({ ...f, status: s }))}
                    className={`py-2.5 px-3 rounded-xl border text-sm font-medium transition-all text-center ${
                      form.status === s
                        ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-1.5">Current Location *</label>
              <div className="relative">
                <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  className="input-dark pl-11"
                  placeholder="e.g. Hyderabad Sorting Hub"
                  value={form.location}
                  onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-1.5">Update Note</label>
              <textarea
                className="input-dark resize-none"
                rows={3}
                placeholder="e.g. Parcel received at sorting facility, being processed for dispatch"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>

            <button type="submit" disabled={updating || !form.status || !form.location.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold transition-all hover:shadow-lg hover:shadow-violet-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {updating
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><FiCheckCircle /> Apply Status Update</>}
            </button>
          </form>

          {/* Recent history */}
          <div className="card-glass">
            <h3 className="text-lg font-display font-semibold text-white mb-5 flex items-center gap-2">
              <FiPackage className="text-slate-400" /> Recent History
            </h3>
            <div className="space-y-3">
              {[...parcel.trackingHistory].reverse().slice(0, 5).map((h, i) => (
                <div key={i} className="flex items-start gap-3 p-3 glass rounded-xl">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${i === 0 ? 'bg-violet-400' : 'bg-slate-600'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm font-medium ${i === 0 ? 'text-white' : 'text-slate-400'}`}>{h.status}</span>
                      <span className="text-slate-500 text-xs flex-shrink-0">{format(new Date(h.updatedAt), 'MMM d, HH:mm')}</span>
                    </div>
                    {h.description && <p className="text-slate-500 text-xs mt-0.5">{h.description}</p>}
                    {h.location && (
                      <div className="flex items-center gap-1 mt-0.5 text-slate-500 text-xs">
                        <FiMapPin className="text-xs flex-shrink-0" /> {h.location}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
